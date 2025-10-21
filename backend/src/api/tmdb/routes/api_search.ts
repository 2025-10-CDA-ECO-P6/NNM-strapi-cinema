export default {
  routes: [
    {
      method: "GET",
      path: "/tmdb/api_search",
      handler: "api-search.apiSearch",
      config: {
        auth: false,
      },
    },
  ],
};
