export default {
  routes: [
    {
      method: "GET",
      path: "/tmdb/api_actor",
      handler: "api-actor.apiActor",
      config: {
        auth: false,
      },
    },
  ],
};
