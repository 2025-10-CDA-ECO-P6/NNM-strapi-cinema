export interface MovieDto {
    id: number,
    title: string,
    description : string,
    release_date : Date | null,
    realisator : string | null,
    background_image : string | null,
    poster_image : string | null,
    actors : ActorInfoMap[]

}

export interface ActorInfoMap {
    tmdb_actor_id: number;
    name: string;
    last_name: string | null;
    profile_path : string | null;
}

export interface ActorDto {
    tmdb_actor_id: number;
    name: string,
    last_name?  : string | null,
    birth_date? : Date | null,
    profile_path? : string | null,
    associated_movies: number[];
}

export interface RawCastMember {
    id: number;
    name: string;
    character: string;
    order: number;
    popularity : number | null;
    profile_path: string | null;
}

export interface RawCrewMember {
    id: number;
    name: string;
    job: string;
    department: string;
    profile_path: string | null;
}

export interface RawImagesResponse {
    backdrops : RawObjectImageResponse[],
    id: number,
    logos : RawObjectImageResponse[],
    posters: RawObjectImageResponse[]
}

export interface RawObjectImageResponse {
    aspect_ratio: number,
    height: number,
    iso_3166_1 : string,
    iso_639_1 : string,
    file_path : string,
    vote_average : number,
    vote_count : number,
    width: number
}

export interface RawCreditResponse {
    id: number;
    cast: RawCastMember[];
    crew: RawCrewMember[];
}


export interface RawMovieResponse {
    id: number;
    title: string;
    overview?: string | null;
    release_date?: string | null;
}

export interface RawMovieListResponse<T> {
    page : number,
    results : T[],
    total_pages : number,
    total_results : number
}