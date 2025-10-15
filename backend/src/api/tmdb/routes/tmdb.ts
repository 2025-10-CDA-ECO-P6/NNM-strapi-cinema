export default {
  // Declaration de la liste des routes disponibles pour l'API TMDb
  routes: [
    {
      // Type de méthode HTTP : 
      method: 'GET',

      // Chemin de la route : ce sera accessible via
      // http://localhost:1337/api/tmdb/popular
      path: '/tmdb/popular',

      // Nom du contrôleur et de la fonction à exécuter quand cette route est appelée
      // - "tmdb" = nom du contrôleur
      // - "popular" = nom de la méthode
      handler: 'tmdb.popular',

      // Configuration spécifique à cette route
      config: {
        // Auth = autorisation d'accès à la route (false = public / true = protégé)
        auth: false,
      },
    },
  ],
};
