// Import de la factory Strapi pour créer un service personnalisé
import {factories} from '@strapi/strapi';
import axios, {AxiosResponse} from 'axios';
import {
    MovieDto,
    RawCastMember,
    RawCreditResponse, RawCrewMember, RawImagesResponse,
    RawMovieListResponse,
    RawMovieResponse
} from "../types/types";
import {mapRawMovieToDTO} from "../types/mapper";

// On exporte un objet (service Strapi) contenant une méthode asynchrone
export default factories.createCoreService('api::tmdb.movie', ({strapi}) => {

    // Définition des variables au niveau du service (accessible par toutes les méthodes)
    const apiKey = process.env.TMDB_API_KEY;
    const baseUrl = process.env.TMDB_BASE_URL;
    const CONFIG = {
        PAGES_TO_FETCH: 100,
        PAGE_BATCH_SIZE: 3,
        ACTOR_PARALLEL_LIMIT: 10,
        TOP_ACTORS_COUNT: 5,
        MOVIE_DETAILS_CHUNK_SIZE: 10,
        DELAY_BETWEEN_CHUNKS_MS: 500
    }


    const chunkArray = <T>(array: T[], chunkSize: number) => {
        const result = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            result.push(array.slice(i, i + chunkSize));
        }
        return result;
    };

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // =========================================================================================
    // 🆕 DEDUPLICATION : Déduplication des films dans les données recupérés car leur api renvois des doublons
    // ========================================================================
    const deduplicateMovies = (movies: MovieDto[]): MovieDto[] => {
        const uniqueMovies = new Map();
        for (const movie of movies) {
            if (!uniqueMovies.has(movie.id)) {
                uniqueMovies.set(movie.id, movie);
            }
        }
        const deduplicatedMovies = Array.from(uniqueMovies.values());

        return deduplicatedMovies;
    };

    // ========================================================================
    // 🆕 EXTRACTION :Récupération des ids unique des acteurs
    // ========================================================================
    const extractUniqueActorIds = (movies: MovieDto[]): number[] => {
        const uniqueActorIds = new Set<number>();
        for (const movieFetched of movies) {
            for (const actor of movieFetched.actors) {
                uniqueActorIds.add(actor.tmdb_actor_id);
            }
        }
        const allUniqueActorIds = Array.from(uniqueActorIds).filter(id => id !== null && id !== undefined);

        return allUniqueActorIds;
    };

    // ========================================================================
    // 🆕 EXTRACTION : Récupération des crédits pour une liste de films
    // ========================================================================
    const fetchMovieCredits = async (movies: MovieDto[]): Promise<RawCreditResponse[]> => {
        const creditPromises = movies.map((movie) =>
            axios.get<RawCreditResponse>(`${baseUrl}/movie/${movie.id}/credits`, {
                params: {api_key: apiKey, language: "us-US"}
            })
        );
        const creditResponses: AxiosResponse<RawCreditResponse>[] = await Promise.all(creditPromises);
        return creditResponses.map(resp => resp.data);
    };

    // ========================================================================
    // 🆕 EXTRACTION : Récupération des images pour une liste de films
    // ========================================================================
    const fetchMovieImages = async (movies: MovieDto[]): Promise<RawImagesResponse[]> => {
        const illustrationsPromises = movies.map((movie) =>
            axios.get<RawImagesResponse>(`${baseUrl}/movie/${movie.id}/images`, {
                params: {api_key: apiKey, include_image_language: 'fr,null'}
            })
        );
        const illustrationResponses: AxiosResponse<RawImagesResponse>[] = await Promise.all(illustrationsPromises);
        return illustrationResponses.map(resp => resp.data);
    };

    // ========================================================================
    // 🆕 EXTRACTION : Extraction et mapping des top acteurs
    // ========================================================================
    const extractTopActors = (credits: RawCreditResponse) => {
        return credits.cast
            .filter((acteur: RawCastMember) =>
                acteur.id && acteur.name && acteur.name.trim().length > 0
            )
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, CONFIG.TOP_ACTORS_COUNT)
            .map((acteur: RawCastMember) => {
                const nameParts = acteur.name.trim().split(/\s+/);
                return {
                    name: nameParts[0] || null,
                    last_name: nameParts.slice(1).join(" ") || null,
                    tmdb_actor_id: acteur.id
                };
            });
    };

    // ========================================================================
    // 🆕 EXTRACTION : Enrichissement d'un film avec crédits et images
    // ========================================================================
    const enrichMovieWithCreditsAndImages = (
        movie: MovieDto,
        credits: RawCreditResponse,
        images: RawImagesResponse
    ): void => {
        const director = credits.crew.find((member: RawCrewMember) => member.job === 'Director');

        movie.background_image = images.backdrops[0]?.file_path || null;
        movie.poster_image = images.posters[0]?.file_path || null;
        movie.realisator = director ? director.name : null;
        movie.actors = extractTopActors(credits);

        strapi.log.info(`background image : ${movie.background_image} / poster_image : ${movie.poster_image}`);

        if (movie.actors.length < CONFIG.TOP_ACTORS_COUNT && credits.cast.length >= CONFIG.TOP_ACTORS_COUNT) {
            strapi.log.error(`⚠️ Film "${movie.title}": seulement ${movie.actors.length} acteurs conservés alors que ${credits.cast.length} disponibles !`);
        }
    };





    return ({

        //Fonction qui interroge l'API TMDb pour récupérer les films populaires et en parralléle les crédits de chaques films
        async getPopularMovies(): Promise<MovieDto[]> {

            const allMovies: MovieDto[] = [];
            const pageNumbers = Array.from({length: 100}, (_, i) => i + 1);
            const pageChunks = chunkArray(pageNumbers, 5);

            try {
                // recuperation des films par batch
                for (const chunk of pageChunks) {
                    const pagePromises = chunk.map(page =>
                        axios.get<RawMovieListResponse<RawMovieResponse>>(`${baseUrl}/movie/popular`, {
                            params: {
                                api_key: apiKey,
                                page
                            }
                        })
                    );
                    const responses = await Promise.allSettled(pagePromises)

                    // on extrait les reponse reussis
                    const successfulResponses = responses
                        .filter((result): result is PromiseFulfilledResult<AxiosResponse<RawMovieListResponse<RawMovieResponse>>> =>
                            result.status === 'fulfilled'
                        )
                        .map(result => result.value)

                    const mappedData = successfulResponses.flatMap(resp =>
                        resp.data.results.map(mapRawMovieToDTO)
                    );

                    const [credits, images] = await Promise.all([
                        fetchMovieCredits(mappedData),
                        fetchMovieImages(mappedData)
                    ]);

                    mappedData.forEach((movie, index) => {
                        enrichMovieWithCreditsAndImages(movie, credits[index], images[index]);
                    });

                    allMovies.push(...mappedData);

                    if (pageChunks.indexOf(chunk) < pageChunks.length - 1) {
                        await sleep(CONFIG.DELAY_BETWEEN_CHUNKS_MS);
                    }
                }

                return allMovies;
            } catch (error) {
                throw new Error(`Impossible de contacter TMDb: ${error?.message}`);
            }
        },

        // synchronisation de la base pour evité les doublons
        async syncDatabase() {
            let created = 0;
            let updated = 0;

            // ✅ ÉTAPE 1: Récupération et dédoublonnage
            const allMoviesFetched = await this.getPopularMovies();
            const deduplicatedMovies = deduplicateMovies(allMoviesFetched);
            const allUniqueActorIds = extractUniqueActorIds(deduplicatedMovies);

            // ----------------------------------------------------------------------
            // 💥 PHASE 2:  PRÉ-CHARGEMENT MASSIF (UNE SEULE FOIS)
            // ----------------------------------------------------------------------

            // --- Acteurs : Pré-chargement et map ---
            const existingActorsFromDb = await strapi.db.query('api::tmdb.actor').findMany({
                where: {
                    tmdb_actor_id: {
                        $in: allUniqueActorIds,
                    },
                },
            });

            const existingActorMap = new Map(
                existingActorsFromDb.map(actor => [actor.tmdb_actor_id, actor])
            );


            // --- Films : Pré-chargement et map ---
            const allTmdbMovieIds = deduplicatedMovies.map(m => m.id).filter(id => id !== null && id !== undefined);
            const existingMoviesFromDb = await strapi.db.query('api::tmdb.movie').findMany({
                where: {
                    tmdb_id: {
                        $in: allTmdbMovieIds,
                    },
                },
                select: ['id', 'tmdb_id']
            });
            const existingMovieMap = new Map(
                existingMoviesFromDb.map(movie => [movie.tmdb_id, movie])
            );


            // ----------------------------------------------------------------------
            // 💥 PHASE 2: TMDB - RÉCUPÉRATION DES DÉTAILS MANQUANTS (Anniversaire Acteurs)
            // ----------------------------------------------------------------------

            const actorIdsToFetch = [];
            const actorDetailMap = new Map();


            // determiner quel ids appeler
            for (const tmdbId of allUniqueActorIds) {
                const existingActor = existingActorMap.get(tmdbId);

                // si l'acteur est deja en bdd et à deja une date de naissance, on utlise le cache
                if (existingActor && existingActor.birth_date && existingActor.birth_date !== 'N/C') {
                    actorDetailMap.set(tmdbId, existingActor.birth_date);
                } else {
                    actorIdsToFetch.push(tmdbId);
                }
            }

            // traitement du bday en sequentiel pour eviter rate limit de tmdb
            // on crée la requete quon va utiliser plus tard dans la boucle sur chaque chunk
            const fetchActorDetails = async (tmdbId: number) => {
                try {
                    const resp = await axios.get(`${baseUrl}/person/${tmdbId}`, {
                        params: {api_key: apiKey, language: "fr-FR"}
                    });

                    if (resp.data && resp.data.id) {
                        const birthday = resp.data.birthday || 'N/C';
                        if (birthday && birthday !== 'N/C') {
                        }
                        actorDetailMap.set(resp.data.id, birthday);
                    }
                } catch (error) {
                    actorDetailMap.set(tmdbId, 'N/C');
                }
            };

            const actorIdChunks = chunkArray(actorIdsToFetch, CONFIG.ACTOR_PARALLEL_LIMIT);
            let totalProcessed = 0;

            // boucle sur les lots et execute en parralle a l'interiur de chaque lots
            for (const chunk of actorIdChunks) {
                // on execute toute les requete du lot en parallele
                const processingPromises = chunk.map(fetchActorDetails);
                // attend que tout les requete du lot sont terminé avant de passer au suivant
                await Promise.all(processingPromises);
                totalProcessed += chunk.length;
            }


            // ----------------------------------------------------------------------
            // 💥 PHASE 3: SYNCHRONISATION BDD FINALE (Lecture du Cache)
            // ----------------------------------------------------------------------
            let processedCount = 0;

            // boucle principal avec tout les film recuperés et dédupliqué
            for (const movieFetched of deduplicatedMovies) {
                const actorsInfos = movieFetched.actors;
                const actorsStrapiIds = [];

                for (const actor of actorsInfos) {

                    // ==== Recuperation bulk des acteurs exitant en BDD grace a la map préchargé=====
                    let existingActor = existingActorMap.get(actor.tmdb_actor_id);
                    let birth_date = actorDetailMap.get(actor.tmdb_actor_id) || 'N/C';

                    // Assurer la gestion des valeurs nulles/vides pour le full_name
                    const firstName = actor.name || '';
                    const lastName = actor.last_name || '';


                    const actorData = {
                        full_name: `${firstName} ${lastName}`.trim(),
                        tmdb_actor_id: actor.tmdb_actor_id,
                        name: firstName.trim(),
                        last_name: lastName.trim(),
                        birth_date: birth_date,

                    }
                    // si l'acteur n'existe pas alors on crée l'entrée en bdd dans la table actor
                    if (!existingActor) {
                        existingActor = await strapi.db.query('api::tmdb.actor').create({
                            data: {
                                ...actorData,
                                associated_movies: [] // Nécessaire pour initialiser la relation ManyToMany
                            }

                        });
                        existingActorMap.set(actor.tmdb_actor_id, existingActor);
                    } else {
                        await strapi.db.query('api::tmdb.actor').update({
                            where: {id: existingActor.id},
                            data: actorData
                        });
                    }
                    // on met a jour la list des id actors pour le film courant
                    actorsStrapiIds.push(existingActor.id); // Utilise L'ID DE LA BDD
                }


                const movieData = {
                    tmdb_id: movieFetched.id,
                    title: movieFetched.title,
                    realisator: movieFetched.realisator,
                    description: movieFetched.description,
                    background_image: movieFetched.background_image,
                    poster_image: movieFetched.poster_image,
                    release_date: movieFetched.release_date,
                    actors: actorsStrapiIds, // on ajoute le tableau d'ids des acteurs qui jouent dans le film pour la relation

                }

                // Recherche du film dans le cache (map) -> instantané
                const existing = existingMovieMap.get(movieFetched.id);

                // si le film existe on met a jour ses infos
                if (existing) {
                    await strapi.db.query('api::tmdb.movie').update({
                        where: {id: existing.id},
                        data: movieData
                    });
                    updated++;
                } else {
                    // sinon on crée le film en bdd
                    await strapi.db.query('api::tmdb.movie').create({
                        data: movieData
                    });
                    // mise a jour du cache
                    existingMovieMap.set(movieFetched.id, existing);
                    created++;
                }
                processedCount++;
            }
        }
    });
});