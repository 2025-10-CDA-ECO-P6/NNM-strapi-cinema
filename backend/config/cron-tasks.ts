// lien des routes
import path from "path";

const scriptPath = path.resolve(process.cwd(), "scripts/updateCatalog.js");
const { updateCatalog } = require(scriptPath);



export default {
  updateMoviesJob: {
    task: async ({ strapi }) => {
      console.log("🕙 Lancement du cron job : mise à jour du catalogue TMDb...");
      await updateCatalog(strapi);
      console.log("✅ Cron terminé !");
    },
    options: {
      rule: "*0 6 * * *", // toutes les jours à 6h du matin
      tz: "Europe/Paris", // fuseau horaire
    },
  },
};
