// URL de ton Strapi (importée depuis config.js)
import { API_BASE_URL } from "../../../config.js";

/**
 * Recherche films et acteurs - JSDOC = décrire role parametre et retour
 * @param {string} query - Terme de recherche
 * @returns {Promise<object>} - Obj qui contient les tableaux de films et d'acteurs
 */
export async function searchAll(query) {
  if (!query) return { movies: [], actors: [] };

  try {
    // Construire l'URL de l'API avec le terme de recherche
    const url = `${API_BASE_URL}/api/tmdb/api_search?q=${encodeURIComponent(query)}`;
    // log de l'URL pour debug
    // console.log(" Appel API :", url);

    // Appel à l'API
    const response = await fetch(url);

    // Vérifie la réponse http est valide
    if (!response.ok) throw new Error(`Erreur ${response.status}`);
    const data = await response.json();

    // Vérifie que la structure contient bien les champs attendus
    if (!data.movies) throw new Error("error movies not found");
    if (!data.actors) throw new Error("error actors not found");

    // retourner les résultats 
    return {
      movies: data.movies,
      actors: data.actors,
    };

    // Gestion des erreurs de recherche 
  } catch (error) {
    console.error("Erreur lors de la recherche :", error);
    //  si erreur = tableau vide 
    return { movies: [], actors: [] };
  }
}
