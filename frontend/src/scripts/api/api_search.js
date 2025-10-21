// URL de ton Strapi (importée depuis config.js)
import { API_BASE_URL } from "../../../config.js";

/**
 * Recherche films et acteurs
 * @param {string} query
 * @returns {Promise<object>}
 */
export async function searchAll(query) {
  if (!query) return { movies: [], actors: [] };

  try {
    const url = `${API_BASE_URL}/api/tmdb/api_search?q=${encodeURIComponent(query)}`;
    console.log(" Appel API :", url);
    const response = await fetch(url);

    if (!response.ok) throw new Error(`Erreur ${response.status}`);
    const data = await response.json();

    // Vérifie que les champs existent
    return {
      movies: data.movies || [],
      actors: data.actors || [],
    };
    
  } catch (error) {
    console.error("Erreur lors de la recherche :", error);
    return { movies: [], actors: [] };
  }
}
