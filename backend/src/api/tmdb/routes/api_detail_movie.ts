export default {
  routes: [
    {
      method: "GET",
      path: "/tmdb/api_detail_movie/:id",
      handler: "api-detail-movie.apiDetailMovie",
      config: {
        auth: false,
      },
    },
  ],
};