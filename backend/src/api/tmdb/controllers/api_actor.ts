import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::tmdb.actor", ({ strapi }) => ({
  async getAllActors(context) {
    try {
      const result = await strapi.db.query("api::tmdb.actor").findMany({
        where: { full_name: { $notNull: true } },
        orderBy: { full_name: "asc" },
        limit: 10,
      });

      if (!result) {
        context.body = [];
      }

      context.body = result;
    } catch (error) {
      context.status = 500;
      context.body = { error: error.message };
    }
  },

  async getActorById(context) {
    try {
      const { id } = context.params;

      const result = await strapi.db.query("api::tmdb.actor").findOne({
        where: { id: Number.parseInt(id) },
        populate: {
          associated_movies: true,
        },
      });

      if (!result) {
        context.status = 404;
        context.body = { error: "Actor not found" };
      }
      context.body = result;
    } catch (error) {
      context.status = 500;
      context.body = { error: error.message };
    }
  },
}));
