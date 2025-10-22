// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }: any) {
    // Middleware de redirection vers ton frontend
    strapi.server.use(async (ctx, next) => {
      // Si on visite la racine "/"
      if (ctx.request.url === '/' || ctx.request.url === '/index.html') {
        // 🔁 Redirige vers ta page d'authentification frontend
        ctx.redirect('http://localhost:5500/frontend/index.html');
        return;
      }

      // Sinon, continuer le flux normal
      await next();
    });
  },
};
