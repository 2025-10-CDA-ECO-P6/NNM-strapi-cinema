export default {
  updateTmdbCatalog: {
    task: async ({ strapi }) => {
      strapi.log.info("⏰ Lancement du cron job : synchronisation du catalogue TMDb");

      try {
        // 🔹 On récupère le service TMDb
        const tmdbService = strapi.service("api::tmdb.tmdb");

        if (!tmdbService) {
          throw new Error("Le service 'api::tmdb.tmdb' est introuvable");
        }

        // 🔹 Appel direct de la méthode de synchronisation
        await tmdbService.syncDatabase();

        strapi.log.info("✅ Cron TMDb terminé avec succès !");
      } catch (error) {
        strapi.log.error("❌ Erreur lors de la synchronisation TMDb :", error);
      }
    },

    options: {
      // 🕒 Toutes les minutes (pour test)
      rule: "0 3 * * *",
    },
  },
};

