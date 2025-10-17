// backend/scripts/updateCatalog.js
require('dotenv').config();
const axios = require('axios');

/**
 * updateCatalog(strapi)
 * - strapi : instance Strapi fournie par l'environnement d'exécution
 */
async function updateCatalog(strapi) {
  const TMDB_API_KEY = process.env.TMDB_API_KEY;
  const TMDB_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=fr-FR&page=1`;

  console.log('🔄 Mise à jour du catalogue depuis TMDb...');

  let added = 0;
  let existsCount = 0;

  try {
    const { data } = await axios.get(TMDB_URL);

    for (const movie of data.results) {
      const exists = await strapi.db.query('api::movie.movie').findOne({
        where: { tmdb_id: movie.id },
      });

      if (!exists) {
        await strapi.db.query('api::movie.movie').create({
          data: {
            title: movie.title,
            description: movie.overview,
            release_date: movie.release_date,
            tmdb_id: movie.id,
          },
        });
        console.log(`✅ Film ajouté : ${movie.title}`);
        added++;
      } else {
        console.log(`⚠️ Déjà présent : ${movie.title}`);
        existsCount++;
      }
    }

    console.log(`🎉 Catalogue mis à jour : ${added} ajoutés, ${existsCount} déjà présents.`);
  } catch (error) {
    console.error('❌ Erreur de mise à jour :', error.message);
    throw error;
  }
}

module.exports = { updateCatalog };
