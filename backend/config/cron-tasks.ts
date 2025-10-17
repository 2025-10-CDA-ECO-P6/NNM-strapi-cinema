export default {
  testJob: {
    task: async ({ strapi }) => {
      console.log("✅ Cron job exécuté !");
    },
    options: {
      rule: "*/1 * * * *", // toutes les minutes
    },
  },
};
