export default {
  routes: [
    {
      method: "GET",
      path: "/tmdb/api_popular",
      handler: "api-popular.apiPopular",
      config: {
        auth: false,
      },
    },
  ],
};
