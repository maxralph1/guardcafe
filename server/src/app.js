import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { rateLimit } from 'express-rate-limit';
import config from './config/index.js';
import appConfig from './config/app.js';
import corsConfig from './config/cors.js';
import { requestLogger } from './app/http/middleware/requestLogger.js';
import { HttpException } from './app/exceptions/HttpException.js';
import { notFoundHandler, createErrorHandler } from './app/exceptions/handler.js';
import { apiRoutes, webRoutes } from './routes/index.js';

/**
 * Builds the Express application (the equivalent of Laravel's bootstrap/app.php).
 *
 * It is a function rather than a shared instance, so every test gets a fresh app with its own
 * rate-limit counters. The options exist only so tests can override the defaults.
 */
export const createApp = ({
  cors: corsOptions = corsConfig,
  rateLimit: rateLimitOptions = config.rateLimit,
  debug = appConfig.debug,
} = {}) => {
  const app = express();

  app.disable('x-powered-by');

  /** Logging, security headers, cross-origin rules and compression for every response */
  app.use(requestLogger());
  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(compression());

  /** Web routes (the health check) come before the rate limiter, so monitoring is never throttled */
  app.use(webRoutes);

  app.use(
    rateLimit({
      windowMs: rateLimitOptions.windowMs,
      limit: rateLimitOptions.max,
      standardHeaders: 'draft-8',
      legacyHeaders: false,
      /** Send the rejection through the error handler so it has the same JSON shape as any error */
      handler: (req, res, next, options) => {
        next(new HttpException(options.statusCode, 'Too Many Attempts.'));
      },
    }),
  );

  app.use(express.json({ limit: '100kb' }));

  /** API routes */
  app.use(config.apiPrefix, apiRoutes);

  /** Whatever no route matched, then every error */
  app.use(notFoundHandler);
  app.use(createErrorHandler({ debug }));

  return app;
};
