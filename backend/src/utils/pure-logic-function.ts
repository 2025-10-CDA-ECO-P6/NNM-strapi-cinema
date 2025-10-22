import {
    ActorDto,
    MovieDto,
    RawCastMember,
    RawCreditResponse,
    RawCrewMember,
    RawImagesResponse
} from "../api/tmdb/types/types";

export const DEFAULT_CONFIG = {
    ACTOR_PARALLEL_LIMIT: 10,
    PAGE_CHUNK_LIMIT: 5,
    NUMBER_PAGES_TO_FETCH: 100
};

export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) result.push(array.slice(i, i + chunkSize));
    return result;
}

export function deduplicateMovies(moviesFetched: MovieDto[]): MovieDto[] {
    const unique = new Map<number, MovieDto>();
    for (const m of moviesFetched) if (!unique.has(m.id)) unique.set(m.id, m);
    return Array.from(unique.values());
}

export function exctractUniqueActorIds(deduplicatedMovies: MovieDto[]): number[] {
    const set = new Set<number>();
    for (const movie of deduplicatedMovies) {
        for (const actor of movie.actors) set.add(actor.tmdb_actor_id);
    }
    return Array.from(set).filter(id => id != null);
}

export function enrichMovieWithDetails(movie: MovieDto, credits: RawCreditResponse, illustration: RawImagesResponse): void {
    const director = credits.crew.find((c: RawCrewMember) => c.job === 'Director');
    movie.background_image = illustration.backdrops?.[0]?.file_path || null;
    movie.poster_image = illustration.posters?.[0]?.file_path || null;
    movie.realisator = director?.name || null;
    movie.actors = credits.cast
        .filter((a: RawCastMember) => a.id && a.name?.trim().length)
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 5)
        .map((acteur: RawCastMember) => {
            const parts = acteur.name.trim().split(/\s+/);
            return {
                name: parts[0] || null,
                last_name: parts.slice(1).join(' ') || null,
                tmdb_actor_id: acteur.id,
                profile_path: acteur.profile_path
            };
        });
}

export function determineActorsToFetch(actorIds: number[], existingActorMap: Map<number, ActorDto>) {
    const actorIdsToFetch: number[] = [];
    const actorDetailMap = new Map<number, string>();
    for (const id of actorIds) {
        const existing = existingActorMap.get(id);
        if (existing?.birth_date && existing.birth_date !== 'N/C') actorDetailMap.set(id, existing.birth_date);
        else actorIdsToFetch.push(id);
    }
    return { actorIdsToFetch, actorDetailMap };
}

export function prepareActorData(actor: any, actorDetailMap: Map<number, string>) {
    const firstName = actor.name || '';
    const lastName = actor.last_name || '';
    const birth_date = actorDetailMap.get(actor.tmdb_actor_id) || 'N/C';
    return {
        full_name: `${firstName} ${lastName}`.trim(),
        tmdb_actor_id: actor.tmdb_actor_id,
        name: firstName.trim(),
        last_name: lastName.trim(),
        birth_date,
        profile_path: actor.profile_path
    };
}

export function prepareMovieData(movie: MovieDto, actorsStrapiIds: number[]) {
    return {
        tmdb_id: movie.id,
        title: movie.title,
        realisator: movie.realisator,
        description: movie.description,
        background_image: movie.background_image,
        poster_image: movie.poster_image,
        release_date: movie.release_date,
        actors: actorsStrapiIds
    };
}

export async function fetchActorDetailsBatch(
    actorIdsToFetch: number[],
    actorDetailMap: Map<number, string>,
    fetchActorDetailsFn: (tmdbId: number, actorDetailMap: Map<number,string>) => Promise<void>,
    parallelLimit = DEFAULT_CONFIG.ACTOR_PARALLEL_LIMIT
) {
    const chunks = chunkArray(actorIdsToFetch, parallelLimit);
    let total = 0;
    for (const chunk of chunks) {
        await Promise.all(chunk.map(id => fetchActorDetailsFn(id, actorDetailMap)));
        total += chunk.length;
    }
    return total;
}
