import config from './index.js';

/**
 * Cross-origin settings (the equivalent of Laravel's config/cors.php).
 *
 * `origin` comes from CORS_ORIGIN in .env. While it is empty, no cross-origin request is allowed.
 */
export default Object.freeze({
  origin: config.corsOrigin,
  methods: Object.freeze(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']),
  allowedHeaders: Object.freeze(['Content-Type', 'Authorization', 'X-Requested-With']),
  exposedHeaders: Object.freeze(['X-Request-Id', 'RateLimit', 'RateLimit-Policy', 'Retry-After']),
  credentials: true,
  maxAge: 86400,
});
