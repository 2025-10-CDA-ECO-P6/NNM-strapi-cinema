// backend/scripts/runUpdate.js
require('dotenv').config();
const { updateCatalog } = require('./updateCatalog');

// Utilise l'API v5
const { createStrapi } = require('@strapi/strapi');

(async () => {
  try {
    const strapi = await createStrapi();

    // start() démarre l'app (charge les configs TS via Strapi)
    await strapi.start();

    // Exécute la mise à jour
    await updateCatalog(strapi);

    // Arrêt propre
    await strapi.destroy();
    console.log('✅ Script terminé avec succès');
  } catch (err) {
    console.error('❌ Erreur lors de l’exécution du script :', err);
    process.exit(1);
  }
})();
