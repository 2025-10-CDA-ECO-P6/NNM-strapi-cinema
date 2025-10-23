import {ActorDto, MovieDto} from "../types/types"
export function createTmdbRepository(strapi: any) {
    return {
        async loadExistingActors(actorIds: number[]): Promise<Map<number, ActorDto>> {
            const existingActors = await strapi.db.query('api::tmdb.actor').findMany({
                where: { tmdb_actor_id: { $in: actorIds } }
            });
            return new Map<number, ActorDto>(existingActors.map(a => [a.tmdb_actor_id, a]));
        },

        async loadExistingMovies(movieIds: number[]):  Promise<Map<number, MovieDto>> {
            const existingMovies = await strapi.db.query('api::tmdb.movie').findMany({
                where: { tmdb_id: { $in: movieIds } },
                select: ['id', 'tmdb_id']
            });
            return new Map<number, MovieDto>(existingMovies.map(m => [m.tmdb_id, m]));
        },

        async upsertActor(actorData: any, existingActorMap: Map<number, any>) {
            let existing = existingActorMap.get(actorData.tmdb_actor_id);
            if (!existing) {
                existing = await strapi.db.query('api::tmdb.actor').create({ data: { ...actorData, associated_movies: [] } });
                existingActorMap.set(actorData.tmdb_actor_id, existing);
            } else {
                await strapi.db.query('api::tmdb.actor').update({ where: { id: existing.id }, data: actorData });
            }
            return existing.id;
        },

        async upsertMovie(movieData: any, existingMovieMap: Map<number, any>) {
            const existing = existingMovieMap.get(movieData.tmdb_id);
            if (!existing) {
                const newMovie = await strapi.db.query('api::tmdb.movie').create({ data: movieData });
                existingMovieMap.set(movieData.tmdb_id, newMovie);
                return { created: true, updated: false };
            }
            await strapi.db.query('api::tmdb.movie').update({ where: { id: existing.id }, data: movieData });
            return { created: false, updated: true };
        }
    };
}