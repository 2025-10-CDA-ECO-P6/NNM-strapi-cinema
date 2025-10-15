// On importe la bibliothèque axios pour faire des requêtes HTTP
import axios from 'axios';

// On exporte un objet (service Strapi) contenant une méthode asynchrone
export default {
  
  // Cette fonction interroge l'API TMDb pour récupérer les films populaires
  async getPopularMovies() {
    
    // Récupération de la clé API depuis les variables d'environnement (.env)
    const apiKey = process.env.TMDB_API_KEY;

    // Définition de l'URL de base de TMDb
    // Evite de répéter l'URL dans toutes les requetes
    const baseUrl = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';

    try {
      // Requête GET vers l'endpoint TMDb /movie/popular
      // Précise la clé API et la langue
      const response = await axios.get(`${baseUrl}/movie/popular`, {
        params: {
          api_key: apiKey,
          language: 'fr-FR',
        },
      });

      // Si requête ok, renvoie uniquement le tableau des résultats
      return response.data.results;

    } catch (error) {
      // Erreur (réseau, clé invalide, etc.), log un message dans la console Strapi
      strapi.log.error('Erreur TMDb:', error.message);

      // Erreur critique, on propage l'erreur au contrôleur
      throw new Error('Impossible de contacter TMDb');
    }
  },
};
