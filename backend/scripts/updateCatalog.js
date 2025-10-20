//  Charge les variables d’environnement depuis le fichier .env
// Cela permet d’accéder à TMDB_API_KEY, etc.
require('dotenv').config();

//  Axios est utilisé pour faire des requêtes HTTP (vers l’API TMDb)
const axios = require('axios');

/**
 *  Fonction principale d’import des films depuis TMDb
 * 
 * @param {object} strapi - instance Strapi fournie automatiquement
 *                          quand le script est exécuté dans le contexte Strapi.
 * 
 * Cette fonction :
 * 1️⃣ Récupère les films populaires depuis l’API TMDb
 * 2️⃣ Vérifie s’ils existent déjà dans la base Strapi
 * 3️⃣ Ajoute les nouveaux films sans créer de doublons
 */
async function updateCatalog(strapi) {
  //  Récupère ta clé d’API TMDb depuis les variables d’environnement
  const TMDB_API_KEY = process.env.TMDB_API_KEY;

  //  Construit l’URL pour récupérer les films populaires (langue française)
  const TMDB_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=fr-FR&page=1`;

  console.log('🔄 Mise à jour du catalogue depuis TMDb...');

  //  Compteurs pour savoir combien de films sont ajoutés / déjà présents
  let added = 0;
  let existsCount = 0;

  try {
    //  Requête vers l’API TMDb pour récupérer les films populaires
    const { data } = await axios.get(TMDB_URL);

    //  Boucle sur chaque film renvoyé par TMDb
    for (const movie of data.results) {

      //  Vérifie si le film existe déjà dans la base Strapi (via son ID TMDb)
      const exists = await strapi.db.query('api::movie.movie').findOne({
        where: { tmdb_id: movie.id },
      });

      if (!exists) {
        // Si le film n’existe pas → on le crée dans Strapi
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
        //  Si le film existe déjà → on ne fait rien
        console.log(`⚠️ Déjà présent : ${movie.title}`);
        existsCount++;
      }
    }

    //  Résumé final dans la console
    console.log(`🎉 Catalogue mis à jour : ${added} ajoutés, ${existsCount} déjà présents.`);
  } catch (error) {
    //  Gestion des erreurs réseau ou API
    console.error('❌ Erreur de mise à jour :', error.message);
    throw error;
  }
}

//  Exportation de la fonction pour qu’elle soit utilisée ailleurs 
module.exports = { updateCatalog };
