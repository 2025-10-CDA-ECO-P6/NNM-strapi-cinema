// Import de la factory Strapi pour créer un service personnalisé
import { factories } from '@strapi/strapi';
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
export default factories.createCoreService('api::tmdb.movie', ({ strapi }) => {

    // Définition des variables au niveau du service (accessible par toutes les méthodes)
    const apiKey = process.env.TMDB_API_KEY;
    const baseUrl = process.env.TMDB_BASE_URL;

    const chunkArray = <T>(array: T[], chunkSize: number) => {
        const result = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            result.push(array.slice(i, i + chunkSize));
        }
        return result;
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

                    // on log les eches ( a supprimé en prod)
                    responses.forEach((result, index) => {
                        if (result.status === 'rejected') {
                            strapi.log.error(`Echec page ${chunk[index]} : ${result.reason?.message}`);
                        }
                    })

                    // maintenant mappé toute les donné de toute les pages du chunk
                    const mappedData = successfulResponses.flatMap(resp =>
                        resp.data.results.map(mapRawMovieToDTO)
                    );

                    // récupération des crédits en parrallèle sur la page courante de la boucle
                    const creditPromise = mappedData.map((movie) =>
                        axios.get<RawCreditResponse>(`${baseUrl}/movie/${movie.id}/credits`, {
                            params: {api_key: apiKey, language: "us-US"}
                        })
                    );

                    const creditResponse = await Promise.all(creditPromise);


                    // recupération en paralléle sur la page courante des images pour les films de la pages
                    const illustrationsPromise = mappedData.map((movie) =>
                        axios.get<RawImagesResponse>(`${baseUrl}/movie/${movie.id}/images`, {
                            params: {api_key: apiKey, include_image_language: 'fr,null'}
                        })
                    );

                    const illustrationResponse = await Promise.all(illustrationsPromise);


                    // assignation des acteur + realisateur pour chaque film
                    mappedData.forEach((movie, index) => {
                        const credits = creditResponse[index].data;
                        const illustration = illustrationResponse[index].data;
                        const director = credits.crew.find((member: RawCrewMember) => member.job === 'Director')

                        movie.background_image = illustration.backdrops[0]?.file_path || null;
                        movie.poster_image = illustration.posters[0]?.file_path || null;
                        movie.realisator = director ? director.name : null;
                        movie.actors = credits.cast
                            .filter((acteur: RawCastMember) =>
                                acteur.id && acteur.name && acteur.name.trim().length > 0
                            )
                            .sort((a, b) => b.popularity - a.popularity)
                            .slice(0, 5)
                            .map((acteur: RawCastMember) => {
                                const nameParts = acteur.name.trim().split(/\s+/);
                                return {
                                    name: nameParts[0] || null,
                                    last_name: nameParts.slice(1).join(" ") || null,
                                    tmdb_actor_id: acteur.id
                                };
                            });
                        strapi.log.info(`backround image : ${movie.background_image} / poster_image : ${movie.poster_image}`);
                        if (movie.actors.length < 5 && credits.cast.length >= 5) {
                            strapi.log.error(`⚠️ Film "${movie.title}": seulement ${movie.actors.length} acteurs conservés alors que ${credits.cast.length} disponibles !`);
                        }
                    })
                    allMovies.push(...mappedData);

                    strapi.log.info(`✅ Chunk terminé. Pause de 2s...`);

                }


                return allMovies;

            } catch (error) {
                // 🔥 LOG DÉTAILLÉ DE L'ERREUR PRINCIPALE
                strapi.log.error(`\n🔥 === ERREUR CRITIQUE TMDB ===`);
                strapi.log.error(`Message: ${error?.message}`);
                strapi.log.error(`Code: ${error?.code}`);
                strapi.log.error(`Name: ${error?.name}`);

                if (error?.response) {
                    strapi.log.error(`\n📡 Réponse HTTP:`);
                    strapi.log.error(`  Status: ${error.response.status}`);
                    strapi.log.error(`  Status Text: ${error.response.statusText}`);
                    strapi.log.error(`  Headers: ${JSON.stringify(error.response.headers, null, 2)}`);
                    strapi.log.error(`  Data: ${JSON.stringify(error.response.data, null, 2)}`);
                }

                if (error?.config) {
                    strapi.log.error(`\n🔧 Configuration de la requête:`);
                    strapi.log.error(`  URL: ${error.config.url}`);
                    strapi.log.error(`  Method: ${error.config.method}`);
                    strapi.log.error(`  Params: ${JSON.stringify(error.config.params, null, 2)}`);
                    strapi.log.error(`  Timeout: ${error.config.timeout}ms`);
                }

                strapi.log.error(`\n📚 Stack trace:`);
                strapi.log.error(error?.stack);

                throw new Error(`Impossible de contacter TMDb: ${error?.message}`);
            }
        },

        // synchronisation de la base pour evité les doublons
        async syncDatabase() {
            let created = 0;
            let updated = 0;
            const allMoviesFetched = await this.getPopularMovies();

            strapi.log.info(`\n📊 === 3 PREMIERS FILMS RÉCUPÉRÉS ===`);
            allMoviesFetched.slice(0, 3).forEach(movie => {
                strapi.log.info(`Film "${movie.title}" (ID: ${movie.id})`);
                strapi.log.info(`  - background_image: ${movie.background_image}`);
                strapi.log.info(`  - poster_image: ${movie.poster_image}`);
            });

            const uniqueMovies = new Map();
            for (const movie of allMoviesFetched) {
                if (!uniqueMovies.has(movie.id)) {
                    uniqueMovies.set(movie.id, movie);
                }
            }
            const deduplicatedMovies = Array.from(uniqueMovies.values());
            strapi.log.info(`\n📊 === 3 PREMIERS FILMS APRÈS DÉDUPLICATION ===`);
            deduplicatedMovies.slice(0, 3).forEach(movie => {
                strapi.log.info(`Film "${movie.title}" (ID: ${movie.id})`);
                strapi.log.info(`  - background_image: ${movie.background_image}`);
                strapi.log.info(`  - poster_image: ${movie.poster_image}`);
            });

            strapi.log.info(`Films récupérés: ${allMoviesFetched.length}, Films uniques après déduplication: ${deduplicatedMovies.length}`);

            //Identification de tous les IDs TMDB uniques des acteurs
            const uniqueActorIds = new Set();
            for (const movieFetched of deduplicatedMovies) {
                for (const actor of movieFetched.actors) {
                    uniqueActorIds.add(actor.tmdb_actor_id);
                }
            }
            const allUniqueActorIds = Array.from(uniqueActorIds).filter(id=> id !== null && id !== undefined);
            strapi.log.info(`Synchronisation: ${uniqueActorIds.size} acteurs uniques à traiter.`);

            // ----------------------------------------------------------------------
            // 💥 PHASE 1: OPTIMISATION BDD - PRÉ-CHARGEMENT MASSIF (UNE SEULE FOIS)
            // ----------------------------------------------------------------------

            // --- Acteurs : Pré-chargement et map ---
            const existingActorsFromDb = await strapi.db.query('api::tmdb.actor').findMany({
                where: {
                    tmdb_actor_id: {
                        $in : allUniqueActorIds,
                    },
                },
            });

            const existingActorMap = new Map(
                existingActorsFromDb.map(actor => [actor.tmdb_actor_id, actor])
            );
            strapi.log.info(`Optimisation BDD: ${existingActorMap.size} acteurs existants pré-chargés.`);

            // --- Films : Pré-chargement et map ---
            const allTmdbMovieIds = deduplicatedMovies.map(m => m.id).filter(id => id !== null && id !== undefined);
            const existingMoviesFromDb = await strapi.db.query('api::tmdb.movie').findMany({
                where : {
                   tmdb_id:  {
                       $in : allTmdbMovieIds,
                   },
                },
                select : ['id', 'tmdb_id']
            });
            const existingMovieMap = new Map(
                existingMoviesFromDb.map(movie => [movie.tmdb_id, movie])
            );

            strapi.log.info(`Optimisation BDD: ${existingMovieMap.size} films existants pré-chargés.`);

            // ----------------------------------------------------------------------
            // 💥 PHASE 2: TMDB - RÉCUPÉRATION DES DÉTAILS MANQUANTS (Anniversaire Acteurs)
            // ----------------------------------------------------------------------

            const actorIdsToFetch = [];
            const actorDetailMap = new Map();


            // determiner quel ids appeler
            for (const tmdbId of allUniqueActorIds) {
                const existingActor = existingActorMap.get(tmdbId);

                // si l'acteur est deja en bdd et à deja une date de naissance, on utlise le cache
                if (existingActor && existingActor.birth_date && existingActor.birth_date !== 'N/C'){
                    actorDetailMap.set(tmdbId, existingActor.birth_date);
                } else {
                    actorIdsToFetch.push(tmdbId);
                }
            }
            strapi.log.info(`Synchronisation: ${actorIdsToFetch.length} acteurs à requêter auprès de TMDB (nouveaux ou sans date).`);

            // traitement du bday en sequentiel pour eviter rate limit de tmdb
            const ACTOR_PARALLEL_LIMIT = 10;
            // on crée la requete quon va utiliser plus tard dans la boucle sur chaque chunk
            const fetchActorDetails = async (tmdbId: number) => {
                try {
                    const resp = await axios.get(`${baseUrl}/person/${tmdbId}`,  {
                        params : {api_key : apiKey, language : "fr-FR"}
                    });

                    if (resp.data && resp.data.id) {
                        const birthday = resp.data.birthday || 'N/C';
                        if (birthday && birthday !== 'N/C') {

                        }
                        actorDetailMap.set(resp.data.id, birthday);
                    }
                } catch (error) {
                    strapi.log.warn(`Erreur détails acteur TMDB ID ${tmdbId}: ${error.message}.`);
                    actorDetailMap.set(tmdbId, 'N/C');
                }
            };

            const actorIdChunks = chunkArray(actorIdsToFetch, ACTOR_PARALLEL_LIMIT);
            let totalProcessed = 0;

            strapi.log.info(`Synchronisation: ${actorIdsToFetch.length} acteurs uniques à traiter en lots de ${ACTOR_PARALLEL_LIMIT}.`);

            // boucle sur les lots et execute en parralle a l'interiur de chaque lots
            for (const chunk of actorIdChunks) {
                // on execute toute les requete du lot en parallele
                const processingPromises = chunk.map(fetchActorDetails);
                // attend que tout les requete du lot sont terminé avant de passer au suivant
                await Promise.all(processingPromises);
                totalProcessed += chunk.length;
                strapi.log.info(`Détails acteurs: ${totalProcessed} / ${actorIdsToFetch.length} traités...`);
            }

            // ----------------------------------------------------------------------
            // 💥 PHASE 3: SYNCHRONISATION BDD FINALE (Lecture du Cache)
            // ----------------------------------------------------------------------

            let processedCount = 0;

            // boucle principal avec tout les film recuperés
            for (const movieFetched of deduplicatedMovies) {

                if (processedCount < 3) {
                    strapi.log.info(`\n📦 === TRAITEMENT FILM ${processedCount + 1} : "${movieFetched.title}" ===`);
                    strapi.log.info(`AVANT création movieData:`);
                    strapi.log.info(`  movieFetched.background_image = "${movieFetched.background_image}"`);
                    strapi.log.info(`  movieFetched.poster_image = "${movieFetched.poster_image}"`);
                }

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
                        tmdb_actor_id : actor.tmdb_actor_id,
                        name: firstName.trim(),
                        last_name: lastName.trim(),
                        birth_date: birth_date,

                    }

                    // si l'acteur n'existe pas alors on crée l'entrée en bdd dans la table actor
                    if (!existingActor) {
                        existingActor = await strapi.db.query('api::tmdb.actor').create({
                            data: {
                                ...actorData,
                                associated_movies : [] // Nécessaire pour initialiser la relation ManyToMany
                            }

                        });
                        existingActorMap.set(actor.tmdb_actor_id, existingActor);
                    }else {
                        await strapi.db.query('api::tmdb.actor').update({
                            where: { id: existingActor.id },
                            data: actorData
                        });
                    }

                    // on met a jour la list des id actors pour le film courant
                    actorsStrapiIds.push(existingActor.id); // Utiliser l'ID Strapi
                }



                // ==== Recuperation bulk des films exitant en BDD =====

                const movieData = {
                    tmdb_id : movieFetched.id,
                    title: movieFetched.title,
                    realisator: movieFetched.realisator,
                    description: movieFetched.description,
                    background_image: movieFetched.background_image,
                    poster_image: movieFetched.poster_image,
                    release_date: movieFetched.release_date,
                    actors: actorsStrapiIds, // on ajoute le tableau d'ids des acteurs qui jouent dans le film pour la relation

                }


                if (processedCount < 3) {
                    strapi.log.info(`APRÈS création movieData:`);
                    strapi.log.info(`  movieData.background_image = "${movieData.background_image}"`);
                    strapi.log.info(`  movieData.poster_image = "${movieData.poster_image}"`);
                }

                // Recherche du film dans le cache (map) -> instantané
                const existing = existingMovieMap.get(movieFetched.id);

                // si le film existe on met a jour ses infos
                if (existing) {
                    await  strapi.db.query('api::tmdb.movie').update({
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
                    existingMovieMap.set(movieFetched.tmdb_id, existing);
                    created++;
                }

                if (processedCount < 3) {
                    const savedMovie = await strapi.db.query('api::tmdb.movie').findOne({
                        where: {tmdb_id: movieFetched.id}
                    });
                    strapi.log.info(`VÉRIFIÉ EN BDD:`);
                    strapi.log.info(`  background_image = "${savedMovie.background_image}"`);
                    strapi.log.info(`  poster_image = "${savedMovie.poster_image}"`);
                    strapi.log.info(`=====================================\n`);
                }

                processedCount++;

            }
            strapi.log.info(`Synchronisation TMDB terminée: ${created} films créés, ${updated} films mis à jour.`);
        }
    });
});