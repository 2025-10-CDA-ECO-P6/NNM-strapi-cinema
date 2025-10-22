import { factories } from "@strapi/strapi";


// Contrôleur personnalisé = modèle "movie"
export default factories.createCoreController("api::tmdb.movie", ({ strapi }) => ({

  // Récupère le détail d’un film 
  async apiDetailMovie(ctx) {
    try {

      // Récupère ID passé dans l’URL
      const { id } = ctx.params;
      // bad request si pas d’ID
      if (!id) return ctx.badRequest("Aucun identifiant fourni");

      // Convertit l’ID reçu en nombre (tmdb_id)
      const tmdbId = parseInt(id, 10);

      /// Cherche le film correspondant dans la base
      const movie = await strapi.db.query("api::tmdb.movie").findOne({
        where: { tmdb_id: tmdbId },
        populate: {
          actors: true, // avec acteurs liés
        },
      });

      // Si aucun film trouvé → erreur 404
      if (!movie) return ctx.notFound("Film introuvable");

      // Retourne les données le front
      ctx.body = {
        id: movie.id,
        tmdb_id: movie.tmdb_id,
        title: movie.title,
        description: movie.description,
        release_date: movie.release_date,
        realisator: movie.realisator,
        poster_image: movie.poster_image,
        actors: movie.actors || [],
      };
    } catch (error) {
      // Log et message d’erreur si problème côté serveur
      strapi.log.error("Erreur api_detail_movie :", error);
      ctx.status = 500;
      ctx.body = { error: error.message };
    }
  },

}));
