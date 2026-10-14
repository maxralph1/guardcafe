import pino from 'pino';
import config from './index.js';

const transport = config.isDev
  ? {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    }
  : undefined;

const logger = pino({
  level: config.logLevel,
  base: { env: config.env },
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      '*.password',
      '*.passwordHash',
      'password',
    ],
    remove: true,
  },
  ...(transport ? { transport } : {}),
});

export default logger;
