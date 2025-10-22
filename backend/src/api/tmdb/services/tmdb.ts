// src/api/tmdb/services/movie.ts
import { factories } from '@strapi/strapi';
import axios from 'axios';
import { createTmdbRepository } from '../repositories/tmdbRepository';
import { createFetchers } from '../utils/tmdb-fetchers';
import {
    chunkArray,
    deduplicateMovies,
    exctractUniqueActorIds,
    DEFAULT_CONFIG,
    enrichMovieWithDetails,
    determineActorsToFetch,
    prepareActorData,
    prepareMovieData,
    fetchActorDetailsBatch
} from '../utils/pure-logic-function';
import { mapRawMovieToDTO } from '../types/mapper';
import { MovieDto } from '../types/types';

export default factories.createCoreService('api::tmdb.movie', ({ strapi }) => {
    const CONFIG = DEFAULT_CONFIG;
    const DB_HANDLER = createTmdbRepository(strapi);

    const httpClient = axios.create({ timeout: 15000 });
    const baseUrl = process.env.TMDB_BASE_URL;
    const apiKey = process.env.TMDB_API_KEY;
    const fetchers = createFetchers(httpClient, baseUrl, apiKey);

    return {
        async getPopularMovies(): Promise<MovieDto[]> {
            const allMovies: MovieDto[] = [];
            const pageNumbers = Array.from({ length: CONFIG.NUMBER_PAGES_TO_FETCH }, (_, i) => i + 1);
            const pageChunks = chunkArray(pageNumbers, CONFIG.PAGE_CHUNK_LIMIT);

            for (const chunk of pageChunks) {
                const pageResponses = await Promise.all(chunk.map(p => fetchers.fetchPopularMoviePage(p)));
                const mappedData = pageResponses.flatMap(r => r.data.results.map(mapRawMovieToDTO));

                const creditResponses = await Promise.all(mappedData.map(m => fetchers.fetchMovieCredit(m)));
                const illustrationResponses = await Promise.all(mappedData.map(m => fetchers.fetchMovieIllustration(m)));

                mappedData.forEach((movie, i) => {
                    enrichMovieWithDetails(movie, creditResponses[i].data, illustrationResponses[i].data);
                    allMovies.push(movie);
                });
            }
            return deduplicateMovies(allMovies);
        },

        async syncDatabase() {
            const allMoviesFetched = await this.getPopularMovies();
            const deduplicatedMovies = allMoviesFetched;
            const allUniqueActorIds = exctractUniqueActorIds(deduplicatedMovies);

            const existingActorMap = await DB_HANDLER.loadExistingActors(allUniqueActorIds);
            const existingMovieMap = await DB_HANDLER.loadExistingMovies(deduplicatedMovies.map(m => m.id));

            const { actorIdsToFetch, actorDetailMap } = determineActorsToFetch(allUniqueActorIds, existingActorMap);


            await fetchActorDetailsBatch(actorIdsToFetch, actorDetailMap, fetchers.fetchActorDetails, CONFIG.ACTOR_PARALLEL_LIMIT);

            for (const movieFetched of deduplicatedMovies) {
                const actorsStrapiIds: number[] = [];
                for (const actor of movieFetched.actors) {
                    const actorData = prepareActorData(actor, actorDetailMap);
                    const actorId = await DB_HANDLER.upsertActor(actorData, existingActorMap);
                    actorsStrapiIds.push(actorId);
                }
                const movieData = prepareMovieData(movieFetched, actorsStrapiIds);
                await DB_HANDLER.upsertMovie(movieData, existingMovieMap);
            }
        }
    };
});
