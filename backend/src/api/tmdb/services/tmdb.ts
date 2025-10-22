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
    const CONFIG = {
        ACTOR_PARALLEL_LIMIT: 10,
        PAGE_CHUNK_LIMIT: 5,
        NUMBER_PAGES_TO_FETCH: 100
    }


    const chunkArray = <T>(array: T[], chunkSize: number) => {
        const result = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            result.push(array.slice(i, i + chunkSize));
        }
        return result;
    };

    function deduplicateMovies(moviesFetched: MovieDto[]) {
        const uniqueMovies = new Map();
        for (const movie of moviesFetched) {
            if (!uniqueMovies.has(movie.id)) {
                uniqueMovies.set(movie.id, movie);
            }
        }
        return Array.from(uniqueMovies.values());
    }

    function exctractUniqueActorIds(deduplicatedMovies: MovieDto[]) {
        const uniqueActorIds = new Set();
        for (const movieFetched of deduplicatedMovies) {
            for (const actor of movieFetched.actors) {
                uniqueActorIds.add(actor.tmdb_actor_id);
            }
        }
        return Array.from(uniqueActorIds).filter(id => id !== null && id !== undefined);
    }

    async function fetchActorDetails(tmdbId: number, actorDetailMap: Map<number, string>): Promise<void> {
        try {
            const resp = await axios.get(`${baseUrl}/person/${tmdbId}`, {
                params: {api_key: apiKey, language: "fr-FR"}
            });

            if (resp.data && resp.data.id) {
                const birthday = resp.data.birthday || 'N/C';
                actorDetailMap.set(resp.data.id, birthday);
            }
        } catch (error) {
            strapi.log.warn(`Erreur détails acteur TMDB ID ${tmdbId}: ${error.message}.`);
            actorDetailMap.set(tmdbId, 'N/C');
        }
    }

    function enrichMovieWithDetails(movie: MovieDto, credits: RawCreditResponse, illustration: RawImagesResponse): void {
        const director = credits.crew.find((member: RawCrewMember) => member.job === 'Director');

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
                    tmdb_actor_id: acteur.id,
                    profile_path: acteur.profile_path
                };
            });
    }

    const fetchPopularMoviePage = (page: number) => {
        return axios.get<RawMovieListResponse<RawMovieResponse>>(`${baseUrl}/movie/popular`, {
            params: {
                api_key: apiKey,
                page
            }
        })
    }
    const fetchMovieCredit = (movie: MovieDto) => {
        return axios.get<RawCreditResponse>(`${baseUrl}/movie/${movie.id}/credits`, {
            params: {api_key: apiKey, language: "us-US"}
        })
    }
    const fetchMovieIllustration = (movie: MovieDto) => {
        return axios.get<RawImagesResponse>(`${baseUrl}/movie/${movie.id}/images`, {
            params: {api_key: apiKey, include_image_language: 'fr,null'}
        })
    }




// ============================================
// FONCTIONS DE TRAITEMENT DES ACTEURS
// ============================================

    /**
     * Charge tous les acteurs existants depuis la BDD
     */
    async function loadExistingActors(actorIds) {
        const existingActorsFromDb = await strapi.db.query('api::tmdb.actor').findMany({
            where: {
                tmdb_actor_id: {
                    $in: actorIds,
                },
            },
        });

        return new Map(
            existingActorsFromDb.map(actor => [actor.tmdb_actor_id, actor])
        );
    }

    /**
     * Détermine quels acteurs nécessitent un appel API pour récupérer leurs détails
     */
    function determineActorsToFetch(actorIds, existingActorMap) {
        const actorIdsToFetch = [];
        const actorDetailMap = new Map();

        for (const tmdbId of actorIds) {
            const existingActor = existingActorMap.get(tmdbId);

            // Si l'acteur existe déjà avec une date de naissance, on utilise le cache
            if (existingActor && existingActor.birth_date && existingActor.birth_date !== 'N/C') {
                actorDetailMap.set(tmdbId, existingActor.birth_date);
            } else {
                actorIdsToFetch.push(tmdbId);
            }
        }

        return { actorIdsToFetch, actorDetailMap };
    }


    /**
     * Prépare les données d'un acteur pour la création/mise à jour
     */
    function prepareActorData(actor, actorDetailMap) {
        const firstName = actor.name || '';
        const lastName = actor.last_name || '';
        const birth_date = actorDetailMap.get(actor.tmdb_actor_id) || 'N/C';

        return {
            full_name: `${firstName} ${lastName}`.trim(),
            tmdb_actor_id: actor.tmdb_actor_id,
            name: firstName.trim(),
            last_name: lastName.trim(),
            birth_date: birth_date,
            profile_path: actor.profile_path
        };
    }

    /**
     * Récupère les détails des acteurs par lots pour éviter le rate limit
     */
    async function fetchActorDetailsBatch(actorIdsToFetch, actorDetailMap) {
        const actorIdChunks = chunkArray(actorIdsToFetch, CONFIG.ACTOR_PARALLEL_LIMIT);
        let totalProcessed = 0;

        for (const chunk of actorIdChunks) {
            const processingPromises = chunk.map(tmdbId =>
                fetchActorDetails(tmdbId, actorDetailMap)
            );
            await Promise.all(processingPromises);
            totalProcessed += chunk.length;
        }

        return totalProcessed;
    }


    /**
     * Crée ou met à jour un acteur dans la BDD
     */
    async function upsertActor(actor, actorDetailMap, existingActorMap) {
        let existingActor = existingActorMap.get(actor.tmdb_actor_id);
        const actorData = prepareActorData(actor, actorDetailMap);

        if (!existingActor) {
            existingActor = await strapi.db.query('api::tmdb.actor').create({
                data: {
                    ...actorData,
                    associated_movies: [] // Initialiser la relation ManyToMany
                }
            });
            existingActorMap.set(actor.tmdb_actor_id, existingActor);
        } else {
            await strapi.db.query('api::tmdb.actor').update({
                where: { id: existingActor.id },
                data: actorData
            });
        }

        return existingActor.id;
    }


// ============================================
// FONCTIONS DE TRAITEMENT DES FILMS
// ============================================

    /**
     * Traite tous les acteurs d'un film et retourne leurs IDs Strapi
     */
    async function processMovieActors(actorsInfos, actorDetailMap, existingActorMap) {
        const actorsStrapiIds = [];

        for (const actor of actorsInfos) {
            const actorId = await upsertActor(actor, actorDetailMap, existingActorMap);
            actorsStrapiIds.push(actorId);
        }

        return actorsStrapiIds;
    }

    /**
     * Charge tous les films existants depuis la BDD
     */
    async function loadExistingMovies(movieIds) {
        const existingMoviesFromDb = await strapi.db.query('api::tmdb.movie').findMany({
            where: {
                tmdb_id: {
                    $in: movieIds,
                },
            },
            select: ['id', 'tmdb_id']
        });

        return new Map(
            existingMoviesFromDb.map(movie => [movie.tmdb_id, movie])
        );
    }

    /**
     * Prépare les données d'un film pour la création/mise à jour
     */
    function prepareMovieData(movieFetched, actorsStrapiIds) {
        return {
            tmdb_id: movieFetched.id,
            title: movieFetched.title,
            realisator: movieFetched.realisator,
            description: movieFetched.description,
            background_image: movieFetched.background_image,
            poster_image: movieFetched.poster_image,
            release_date: movieFetched.release_date,
            actors: actorsStrapiIds,
        };
    }


    /**
     * Crée ou met à jour un film dans la BDD
     */
    async function upsertMovie(movieFetched, actorsStrapiIds, existingMovieMap) {
        const movieData = prepareMovieData(movieFetched, actorsStrapiIds);
        const existing = existingMovieMap.get(movieFetched.id);

        if (existing) {
            // Mise à jour du film
            await strapi.db.query('api::tmdb.movie').update({
                where: { id: existing.id },
                data: movieData
            });
            return { created: false, updated: true };
        } else {
            // Création du film
            const newMovie = await strapi.db.query('api::tmdb.movie').create({
                data: movieData
            });
            existingMovieMap.set(movieFetched.id, newMovie);
            return { created: true, updated: false };
        }
    }




    return ({

        /**
         * Recupere 2000 films populaires sur tmdb
         */
        async getPopularMovies(): Promise<MovieDto[]> {
            const allMovies: MovieDto[] = [];
            const pageNumbers = Array.from({length: CONFIG.NUMBER_PAGES_TO_FETCH}, (_, i) => i + 1);
            const pageChunks = chunkArray(pageNumbers, CONFIG.PAGE_CHUNK_LIMIT);

            try {
                // recuperation des films par batch
                for (const chunk of pageChunks) {
                    const pagePromises = chunk.map(page =>
                        fetchPopularMoviePage(page)
                    );
                    const responses = await Promise.allSettled(pagePromises)
                    const successfulResponses = responses
                        .filter((result): result is PromiseFulfilledResult<AxiosResponse<RawMovieListResponse<RawMovieResponse>>> =>
                            result.status === 'fulfilled'
                        )
                        .map(result => result.value)
                    const mappedData = successfulResponses.flatMap(resp =>
                        resp.data.results.map(mapRawMovieToDTO)
                    );


                    const creditPromises = mappedData.map((movie) =>
                        fetchMovieCredit(movie)
                    );
                    const illustrationsPromises = mappedData.map((movie) =>
                        fetchMovieIllustration(movie)
                    );
                    const [creditResponses, illustrationResponses] = await Promise.all([
                        Promise.allSettled(creditPromises),
                        Promise.allSettled(illustrationsPromises)
                    ]);
                    mappedData.forEach((movie, index) => {
                        const creditResult = creditResponses[index]
                        const illustrationResult = illustrationResponses[index]
                        if (creditResult.status === 'fulfilled' && illustrationResult.status === 'fulfilled') {
                            const credits = creditResult.value.data;
                            const illustration = illustrationResult.value.data;
                            enrichMovieWithDetails(movie, credits, illustration);
                            allMovies.push(movie)
                        }
                    })

                    // fin de la boucle sur tout les batch
                }
                return deduplicateMovies(allMovies);
            } catch (error) {
                throw new Error(`Impossible de contacter TMDb: ${error?.message}`);
            }
        },

        /**
         * Syncronisation de la BDD avec les données recupérés
         */
            async syncDatabase() {
                const allMoviesFetched = await this.getPopularMovies();
                const deduplicatedMovies = allMoviesFetched;

                const allUniqueActorIds = exctractUniqueActorIds(deduplicatedMovies);
                const existingActorMap = await loadExistingActors(allUniqueActorIds);

                const allTmdbMovieIds = deduplicatedMovies.map(m => m.id).filter(id => id !== null && id !== undefined);
                const existingMovieMap = await loadExistingMovies(allTmdbMovieIds);

                const { actorIdsToFetch, actorDetailMap } = determineActorsToFetch(
                    allUniqueActorIds,
                    existingActorMap
                );

                // recuperation de acteurs par lots
                await fetchActorDetailsBatch(actorIdsToFetch, actorDetailMap);

                // boucle principal avec tout les film recuperés
                for (const movieFetched of deduplicatedMovies) {
                    const actorsStrapiIds = await processMovieActors(
                        movieFetched.actors,
                        actorDetailMap,
                        existingActorMap
                    );

                 await upsertMovie(movieFetched, actorsStrapiIds, existingMovieMap);

                }
            }
        });
});