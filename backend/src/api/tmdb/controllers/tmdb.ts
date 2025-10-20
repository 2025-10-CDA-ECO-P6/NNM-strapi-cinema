// Import de la factory Strapi pour créer un contrôleur personnalisé
import { factories } from '@strapi/strapi';


export default factories.createCoreController('api::tmdb.movie', ({ strapi }) => ({

  /**
   * Méthode GET /api/tmdb/popular
   * ------------------------------------------------------------
   * Récupère la liste des films populaires depuis l’API TMDb.
   */
  async popular(ctx) {
    try {
      // Appel du service TMDb pour récupérer les films populaires
      const movies = await strapi
        .service('api::tmdb.tmdb')
        .syncDatabase();

      // Réponse HTTP 200 OK avec les données
      ctx.body = movies;
    } catch (err) {
      // Gestion d'erreur : code 500 et message détaillé
      ctx.status = 500;
      ctx.body = { error: err.message };
    }
  },

}));
