// URL de mon API Strapi -> sur bdd locale
import { API_BASE_URL } from "../../../config.js";

// url du endpoint -> films populaires
const API_URL = `${API_BASE_URL}/api/tmdb/api_popular`;

// Fonction asynchrone → chercher les films dans la base via l’API
export async function getPopularMoviesFromDB() {
  try {
    // Log pour vérifier dans la console pour le fetch
    // console.log("Fetching depuis :", API_URL);

    // Requête à Strapi (fetch = aller chercher des données sur le serveur)
    const response = await fetch(API_URL);

    // Réponse n’est pas OK = Erreur
    if (!response.ok) throw new Error(`Erreur API : ${response.status}`);

    // Transforme réponse en JSON
    const data = await response.json();

    // Log reception des données
    // console.log("Films reçus :", data);

    // Return tableau de films 
    return data;

  } catch (error) {
    // Capture et log des erreurs
    console.error("Erreur lors du chargement des films :", error);

    // Renvoi tableau vide en cas d’erreur
    return [];
  }
}
