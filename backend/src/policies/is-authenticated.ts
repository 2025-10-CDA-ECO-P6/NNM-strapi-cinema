import { errors } from '@strapi/utils';
const { UnauthorizedError } = errors;

export default async (policyContext, config, { strapi }) => {
  const ctx = policyContext;

  // Vérifie la présence du header Authorization
  const authHeader = ctx.request.header.authorization;
  if (!authHeader) {
    throw new UnauthorizedError('Missing Authorization header');
  }

  const token = authHeader.split(' ')[1];
  try {
    // Vérifie la validité du token JWT
    const decoded = await strapi.plugins['users-permissions'].services.jwt.verify(token);
    ctx.state.user = decoded;
    return true; // Autorise l’accès
  } catch {
    throw new UnauthorizedError('Invalid or expired token');
  }
};
