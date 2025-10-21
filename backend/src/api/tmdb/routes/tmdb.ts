export default {
  routes: [
    {
      method: 'GET',
      path: '/tmdb/secure-popular',
      handler: 'tmdb.securePopular',
      config: {
        auth: false, // on gère l’auth dans le contrôleur
      },
    },
  ],
};

