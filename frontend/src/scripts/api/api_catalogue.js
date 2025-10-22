// url du endpoint -> films populaires
import {API_BASE_URL} from "../../../config.js"

const API_URL = `${API_BASE_URL}/api/tmdb/api_catalog`;

export async function getMoviesCatalogFromServer() {

    const moviesToKeep = [];

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Erreur API : ${response.status}`);
        }

        const responseData = await response.json();

        const moviesArray = responseData.data;

        if (!Array.isArray(moviesArray)) {
          throw new Error;
        }

        const moviesToKeep = moviesArray.filter(movie => {
            // Un film est conservé s'il a  'poster_image'
            return movie.poster_image
        });

        return moviesToKeep;
    } catch (error) {
        console.error("Erreur lors du chargement des films : ", error.message);
        return [];
    }
}