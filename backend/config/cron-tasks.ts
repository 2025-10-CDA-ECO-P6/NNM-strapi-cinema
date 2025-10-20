export default {
  updateTmdbCatalog: {
    task: async ({ strapi }) => {
      //  Message de log indiquant le début du cron job
      strapi.log.info("⏰ Lancement du cron job : mise à jour du catalogue TMDb");

      try {
        //  On récupère le service TMDb (défini dans src/api/tmdb/services/tmdb.ts)
        const tmdbService = strapi.service("api::tmdb.tmdb");

        //  Si le service n'existe pas, on lance une erreur explicite
        if (!tmdbService) {
          throw new Error("Le service 'api::tmdb.tmdb' est introuvable");
        }

        //  On appelle la fonction du service qui va récupérer les films populaires depuis TMDb
        strapi.log.info("🎬 Appel du service TMDb pour récupérer les films populaires...");
        const movies = await tmdbService.getPopularMovies();

        //  On log le nombre total de films récupérés
        strapi.log.info(`📥 ${movies.length} films récupérés depuis TMDb.`);

        //  Pour chaque film récupéré, on vérifie s'il existe déjà dans la base
        for (const movie of movies) {
          const existing = await strapi.db
            .query("api::tmdb.movie") // On interroge le modèle Movie
            .findOne({ where: { tmdb_id: movie.id } }); // Recherche par identifiant TMDb

          if (!existing) {
            //  Si le film n'existe pas, on l’ajoute à la base
            await strapi.db.query("api::tmdb.movie").create({
              data: {
                title: movie.title,
                description: movie.overview,
                release_date: movie.release_date,
                tmdb_id: movie.id,
              },
            });
            strapi.log.info(`➕ Film ajouté : ${movie.title}`);
          } else {
            //  Sinon, on log simplement qu'il est déjà présent
            strapi.log.debug(`⚠️ Film déjà présent : ${movie.title}`);
          }
        }

        //  Fin du processus avec un message récapitulatif
        strapi.log.info(`✅ Mise à jour terminée : ${movies.length} films analysés.`);
      } catch (error) {
        //  Gestion d’erreur globale en cas de problème pendant le cron
        strapi.log.error("❌ Erreur lors de la mise à jour TMDb :", error);
      }
    },

    options: {
      //  Exécution tous les jours à 3h du matin (heure serveur)
      // Format CRON : minute heure jour-du-mois mois jour-de-la-semaine
      rule: "0 3 * * *",
    },
  },
};
