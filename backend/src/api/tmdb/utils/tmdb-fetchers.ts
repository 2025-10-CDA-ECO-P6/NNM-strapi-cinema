import { AxiosInstance } from "axios";
import { MovieDto } from "../types/types";

export function createFetchers(httpClient: AxiosInstance, baseUrl: string, apiKey: string) {
    const fetchPopularMoviePage = (page: number) =>
        httpClient.get(`${baseUrl}/movie/popular`, { params: { api_key: apiKey, page } });

    const fetchMovieCredit = (movie: MovieDto) =>
        httpClient.get(`${baseUrl}/movie/${movie.id}/credits`, { params: { api_key: apiKey, language: 'us-US' } });

    const fetchMovieIllustration = (movie: MovieDto) =>
        httpClient.get(`${baseUrl}/movie/${movie.id}/images`, { params: { api_key: apiKey, include_image_language: 'fr,null' } });

    const fetchActorDetails = async (tmdbId: number, actorDetailMap: Map<number, string>) => {
        try {
            const resp = await httpClient.get(`${baseUrl}/person/${tmdbId}`, { params: { api_key: apiKey, language: 'fr-FR' } });
            actorDetailMap.set(tmdbId, resp.data.birthday || 'N/C');
        } catch {
            actorDetailMap.set(tmdbId, 'N/C');
        }
    };

    return { fetchPopularMoviePage, fetchMovieCredit, fetchMovieIllustration, fetchActorDetails };
}
