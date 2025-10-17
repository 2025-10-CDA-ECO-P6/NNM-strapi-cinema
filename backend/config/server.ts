// backend/config/server.ts
import cronTasks from './cron-tasks';

export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),

  app: {
    // ✅ Strapi va lire automatiquement tes 4 clés définies dans .env (APP_KEYS=...)
    keys: env.array('APP_KEYS'),
  },

  cron: {
    // ✅ Active les tâches planifiées (cron jobs)
    enabled: true,
    tasks: cronTasks, // Lie ton fichier cron-tasks.ts ici
  },
});
