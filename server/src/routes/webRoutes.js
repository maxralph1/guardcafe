import { Router } from 'express';
import HealthController from '../app/http/controllers/HealthController.js';

/**
 * Routes served from the root of the server, outside the API prefix and never rate limited.
 */
const webRoutes = Router();

const health = new HealthController();

webRoutes.get('/health', health.show);

export default webRoutes;
