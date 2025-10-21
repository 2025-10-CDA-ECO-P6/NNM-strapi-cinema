export default () => ({
  'users-permissions': {
    config: {
      jwtSecret: process.env.JWT_SECRET,
      jwt: {
        expiresIn: '1d', // durée de vie du token (ici 1 jour)
      },
    },
  },
});
