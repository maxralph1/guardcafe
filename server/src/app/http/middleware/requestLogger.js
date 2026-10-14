import { randomUUID } from 'node:crypto';
import pinoHttp from 'pino-http';
import logger from '../../../config/logger.js';

/**
 * Logs every request and gives it an id, returned to the client in the X-Request-Id header so a
 * problem report can be matched to its log lines. Inside a request, use `req.log` for logging.
 */
export const requestLogger = () =>
  pinoHttp({
    logger,

    /** Always generated here, never trusted from the client. */
    genReqId: (req, res) => {
      const id = randomUUID();
      res.setHeader('X-Request-Id', id);
      return id;
    },

    customLogLevel: (req, res, err) => {
      if (err || res.statusCode >= 500) return 'error';
      if (res.statusCode >= 400) return 'warn';
      return 'info';
    },

    /** Monitors poll the health check constantly; logging it would only add noise. */
    autoLogging: { ignore: (req) => req.url === '/health' },
  });

export default requestLogger;
