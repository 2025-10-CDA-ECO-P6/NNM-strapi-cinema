import { factories } from "@strapi/strapi";
// serveur interne Koa strapi pour requete http et context = typage
import { Context } from "koa";

// Contrôleur pour gérer la recherche (films + acteurs)
export default factories.createCoreController("api::tmdb.movie", ({ strapi }) => ({
  async apiSearch(ctx: Context) {
    try {
      const { q } = ctx.query;

      // --- Vérification du paramètre ---
      // Vérifier que le paramètre de requête 'q' est bien présent et valide
      if (!q || typeof q !== "string" || q.trim() === "") {
        ctx.status = 400;
        ctx.body = { error: "Le paramètre 'q' est requis." };
        return;
      }

      // Nettoyage du texte saisi
      const query = q.trim();

      // --- Recherche de films ---
      // Interroge la table des films via le content-type `tmdb.movie`
      // Recherche uniquement titre 
      // (recherche insensible à la casse avec $containsi).
      const movies = await strapi.db.query("api::tmdb.movie").findMany({
        where: {
          // containsi = strapi operator pour recherche insensible à la casse
          title: { $containsi: query },
        },
        select: [
          "id",
          "title",
          "release_date",
          "realisator",
          "poster_image",
          "background_image",
        ],
        limit: 20, // limite resultat pour perf
      });

      // --- Recherche d’acteurs ---
      // Logique modèle `tmdb.actor`.
      // Cherche dans name, last_name et full_name.
      const actors = await strapi.db.query("api::tmdb.actor").findMany({
        where: {
          $or: [
            { name: { $containsi: query } },
            { last_name: { $containsi: query } },
            { full_name: { $containsi: query } },
          ],
        },
        select: [
          "id",
          "tmdb_actor_id",
          "name",
          "last_name",
          "full_name",
          "birth_date",
        ],
        limit: 20,
      });

      // --- Réponse structurée ---
      // Renvoie dans un seul objet
      // afficher résultats sous deux sections distinctes (films / artistes).
      ctx.body = {
        query,
        movies,
        actors,
        total_movies: movies.length,
        total_actors: actors.length,
      };
    } catch (error: any) {
      // Gestion des erreurs serveur (requête, BDD, etc.)
      ctx.status = 500;
      ctx.body = { error: error.message };
    }
  },
}));
