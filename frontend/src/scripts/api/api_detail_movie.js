// URL de base de ton Strapi
import { API_BASE_URL } from "../../../config.js";

/**
 * Récupère le détail d’un film par ID depuis l’API Strapi
 * @param {string|number} id - Identifiant du film
 * @returns {Promise<object|null>} - Les données du film ou null si erreur
 */
export async function getMovieDetail(id) {
  // si pas d'id = stop 
  if (!id) return null;

  try {
    // construire l'URL de l'API
    const url = `${API_BASE_URL}/api/tmdb/api_detail_movie/${id}`;
    //  appel à l'API
    const response = await fetch(url);

    // si réponse pas ok = erreur
    if (!response.ok) throw new Error(`Erreur API (${response.status})`);
    const data = await response.json();

    // si erreur dans les données = erreur
    if (data.error) 
      throw new Error(data.error.message);

    // Renvoi des données du film
    return data;
  } catch (error) {
    // Si fetch plante = log et renvoi null
    console.error("Erreur getMovieDetail:", error);
    return null;
  }
}
