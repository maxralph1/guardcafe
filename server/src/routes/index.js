import { Router } from 'express';
import webRoutes from './webRoutes.js';

/**
 * Routes served under the API prefix (API_PREFIX in .env, "/api/v1" by default).
 * Route groups are mounted here as we build them, e.g. apiRoutes.use('/auth', authRoutes).
 */
export const apiRoutes = Router();

export { webRoutes };
