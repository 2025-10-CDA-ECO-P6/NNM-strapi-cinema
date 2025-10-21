// Factory de Strapi = Contrôleur personnalisé
import { factories } from "@strapi/strapi";


//Controleur pour model movie

export default factories.createCoreController("api::tmdb.movie", ({strapi}) => ({

    async apiCatalog(ctx) {
        try {
            const movie = await strapi.db.query("api::tmdb.movie").findMany({
                where: {release_date: {$notNull: true}},
                orderBy: {release_date: "desc"}
            });
        } catch (error) {
            ctx.status = 500;
            ctx.body = {error : error.message};
        }
    },

}));