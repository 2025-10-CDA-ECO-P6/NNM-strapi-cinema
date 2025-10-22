export default {
  routes: [
    {
      method: "GET",
      path: "/tmdb/api_actor",
      handler: "api-actor.getAllActors",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/tmdb/api_actor/:id",
      handler: "api-actor.getActorById",
      config: {
        auth: false,
      },
    },
  ],
};
