// backend/config/cron-tasks.ts
export default {
  updateTmdbCatalog: {
    task: async ({ strapi }) => {
      strapi.log.info("⏰ Lancement du cron job : synchronisation du catalogue TMDb");
      try {
        const tmdbService = strapi.service("api::tmdb.tmdb");
        if (!tmdbService) {
          throw new Error("Le service 'api::tmdb.tmdb' est introuvable");
        }
        await tmdbService.syncDatabase();
        strapi.log.info("✅ Cron TMDb terminé avec succès !");
      } catch (error) {
        strapi.log.error("❌ Erreur lors de la synchronisation TMDb :", error);
      }
    },
    options: {
      rule: "0 3 * * ",
      // ou "0 3 * * *"
    },
  },
};
