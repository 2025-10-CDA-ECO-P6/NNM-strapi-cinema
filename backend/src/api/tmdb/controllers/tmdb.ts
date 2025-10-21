// Import de la factory Strapi pour créer un contrôleur personnalisé
import { factories } from '@strapi/strapi';
import { errors } from '@strapi/utils';

const { UnauthorizedError } = errors;

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

  /**
   * Méthode GET /api/tmdb/secure-popular
   * ------------------------------------------------------------
   * Même logique que "popular", mais nécessite un token JWT valide.
   */
  async securePopular(ctx) {
    try {
      // Vérification du token
      const authHeader = ctx.request.header.authorization;
      if (!authHeader) {
        throw new UnauthorizedError('Missing Authorization header');
      }

      const token = authHeader.split(' ')[1];
      try {
        // Vérifie la validité du token JWT
        const decoded = await strapi.plugins['users-permissions'].services.jwt.verify(token);
        ctx.state.user = decoded;
      } catch (err) {
        throw new UnauthorizedError('Invalid or expired token');
      }

      // Si token valide → on récupère les films comme avant
      const movies = await strapi
        .service('api::tmdb.tmdb')
        .syncDatabase();

      ctx.body = {
        user: ctx.state.user, // facultatif : infos de l’utilisateur connecté
        movies,
      };

    } catch (err) {
      ctx.status = err.status || 401;
      ctx.body = { error: err.message };
    }
  },

}));
