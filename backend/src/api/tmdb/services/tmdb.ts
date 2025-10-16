// Import de la factory Strapi pour créer un service personnalisé
import { factories } from '@strapi/strapi';
const axios = require('axios');

// On exporte un objet (service Strapi) contenant une méthode asynchrone
export default factories.createCoreService('api::tmdb.movie', ({ strapi }) => ({

  //Fonction qui interroge l'API TMDb pour récupérer les films populaires
  async getPopularMovies() {
    // Récupération de la clé API depuis les variables d'environnement (.env)
    const apiKey = process.env.TMDB_API_KEY;

    // Définition de l'URL de base de TMDb
    const baseUrl = process.env.TMDB_BASE_URL;

    const allMovies = [];

    try {
      // Boucle sur 10 pages de résultats (20 films par page / 200 films totals)
      for (let page = 1; page <= 10; page++) {
        const { data } = await axios.get(`${baseUrl}/movie/popular`, {
          params: { api_key: apiKey, language: "fr-FR", page },
        });

        // Ajouter les résultats de la page au tableau global
        allMovies.push(...data.results);
      }

      // Renvoie le tableau combiné des 200 films populaires
      return allMovies;

    } catch (error) {
      // En cas d'erreur (réseau, clé invalide, etc.)
      strapi.log.error("Erreur TMDb:", error.message);

      // Erreur vers le contrôleur
      throw new Error("Impossible de contacter TMDb");
    }
  },
}));
