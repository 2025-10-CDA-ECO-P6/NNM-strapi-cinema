import cronTasks from './cron-tasks';

export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),

  app: {
    //  Strapi va lire automatiquement les clés définies dans .env 
    keys: env.array('APP_KEYS'),
  },

  cron: {
    //  Active les tâches planifiées (cron jobs)
    enabled: true,
    tasks: cronTasks, // charge les tâches définies dans cron-tasks.ts
  },
});
