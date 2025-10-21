// Factory de Strapi = Contrôleur personnalisé
import { factories } from "@strapi/strapi";

// Contrôleur pour modèle "movie"
export default factories.createCoreController("api::tmdb.movie", ({ strapi }) => ({

  // Méthode personnalisée : /api/tmdb/api_popular
  // Récupérer les films “populaires”
  async apiPopular(ctx) {
    try {
      // Requête directe dans la base via Strapi
      // "findMany" = récupère plusieurs films
        const movies = await strapi.db.query("api::tmdb.movie").findMany({
        where: { release_date: { $notNull: true } },
        orderBy: { release_date: "desc" },
        limit: 10,
        });

      // Si ok , renvoi films
      ctx.body = movies;
    } catch (error) {
      // Sinon error 500
      ctx.status = 500;
      ctx.body = { error: error.message };
    }
  },
}));
