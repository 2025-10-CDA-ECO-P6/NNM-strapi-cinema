import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::tmdb.actor", ({ strapi }) => ({
  async apiActor(context) {
    try {
      const respons = await strapi.db.query("api::tmdb.actor").findMany({
        where: { full_name: { $notNull: true } },
        orderBy: { full_name: "desc" },
        limit: 10,
      });

      if (!respons) {
        context.body = [];
      }

      context.body = respons;
    } catch (error) {
      context.status = 500;
      context.body = { error: error.message };
    }
  },
}));
