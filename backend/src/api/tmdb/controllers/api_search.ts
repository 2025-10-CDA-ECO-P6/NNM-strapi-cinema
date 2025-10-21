// Factory de Strapi = Contrôleur personnalisé
import { factories } from "@strapi/strapi";
// Typage du contexte de requête (ctx)
import { Context } from "koa";
// Typage données (films, acteurs)
import { MovieDto, ActorDto } from "../types/types";

export default factories.createCoreController("api::tmdb.movie", ({ strapi }) => ({

  // Méthode personnalisée : /api/search
  // Recherche simultanée dans les films et les acteurs
  async apiSearch(ctx: Context) {
    try {
      const { q } = ctx.query;

      if (!q || typeof q !== "string" || q.trim() === "") {
        ctx.status = 400;
        ctx.body = { error: "Le paramètre 'q' est requis pour la recherche." };
        return;
      }

      const query = q.trim().toLowerCase();

      // === Recherche des films ===
      const movies: MovieDto[] = await strapi.db.query("api::tmdb.movie").findMany({
        where: {
          $or: [
            { title: { $containsi: query } },
            { description: { $containsi: query } },
            { realisator: { $containsi: query } },
          ],
        },
        select: [
          "id",
          "title",
          "description",
          "release_date",
          "realisator",
          "poster_image",
          "background_image",
        ],
        limit: 15,
      });

      // === Recherche des acteurs ===
      const actors: ActorDto[] = await strapi.db.query("api::tmdb.actor").findMany({
        where: {
          $or: [
            { name: { $containsi: query } },
            { last_name: { $containsi: query } },
          ],
        },
        select: [
          "tmdb_actor_id",
          "name",
          "last_name",
          "birth_date",
        ],
        limit: 15,
      });

      // === Réponse structurée ===
      ctx.body = {
        query,
        movies,
        actors,
        total_movies: movies.length,
        total_actors: actors.length,
      };
    } catch (error: any) {
      ctx.status = 500;
      ctx.body = { error: error.message };
    }
  },
}));
