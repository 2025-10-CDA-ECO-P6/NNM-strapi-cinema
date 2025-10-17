export default {
  testJob: {
    task: async ({ strapi }) => {
      console.log("✅ Cron job exécuté à 10h !");
    },
    options: {
      rule: "0 11 * * *", // tous les jours à 11h00
    },
  },
};
