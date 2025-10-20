import {MovieDto, RawMovieResponse} from "./types";


function parseDateOrNull(d?: string | null): Date | null {
    if (!d) return null;
    const date = new Date(d);
    return Number.isNaN(date.getTime()) ? null : date;
}

export function mapRawMovieToDTO(raw: RawMovieResponse): MovieDto {
    return {
        id: raw.id,
        title: raw.title,
        description: raw.overview,
        release_date: parseDateOrNull(raw.release_date),
        realisator: null, // non fournis dans la reponse de l'api
        background_image  : null,  // non fournis dans la reponse de l'api
        poster_image : null,  // non fournis dans la reponse de l'api
        actors: [],  // non fournis dans la reponse de l'api
    };
}