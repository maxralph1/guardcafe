import config from './config/index.js';
import logger from './config/logger.js';
import { createApp } from './app.js';

const app = createApp();

const server = app.listen(config.port, () => {
  logger.info({ port: config.port, env: config.env }, 'GuardCafe API listening');
});

server.on('error', (error) => {
  logger.fatal({ err: error }, 'Server failed to start');
  process.exit(1);
});

let shuttingDown = false;

/** Stops accepting requests, lets the ones in progress finish, then lets the process end. */
const shutdown = (reason, exitCode = 0) => {
  if (shuttingDown) return;
  shuttingDown = true;
  process.exitCode = exitCode;
  logger.info({ reason }, 'Shutting down');

  /** Last resort: stop waiting for open connections after 10 seconds. */
  setTimeout(() => {
    logger.error('Shutdown timed out, forcing exit');
    process.exit(1);
  }, 10_000).unref();

  server.close((error) => {
    if (error) {
      logger.error({ err: error }, 'Error while closing the server');
      process.exitCode = 1;
    }
  });
  server.closeIdleConnections();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.fatal({ err: reason }, 'Unhandled promise rejection');
  shutdown('unhandledRejection', 1);
});

process.on('uncaughtException', (error) => {
  logger.fatal({ err: error }, 'Uncaught exception');
  shutdown('uncaughtException', 1);
});
