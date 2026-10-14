import appConfig from '../../../config/app.js';

/**
 * Tells load balancers and uptime monitors that the application is running.
 */
export default class HealthController {
  /** An arrow function, so it still works when passed straight to a route (`this` stays bound). */
  show = (req, res) => {
    res.set('Cache-Control', 'no-store').json({
      status: 'ok',
      name: appConfig.name,
      timestamp: new Date().toISOString(),
    });
  };
}
