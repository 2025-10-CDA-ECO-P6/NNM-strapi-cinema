export default {
  testJob: {
    task: async ({ strapi }) => {
      console.log("✅ Cron job exécuté à 10h !");
    },
    options: {
      rule: "0 10 * * *", // tous les jours à 10h00
    },
  },
};
