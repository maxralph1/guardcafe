/**
 * Runs before every database test file (see jest.database.config.js).
 *
 * Like setup/env.js, it puts the run in the "test" environment, which makes config/index.js read
 * .env.testing. Unlike setup/env.js, it does not replace the database settings: the real ones
 * come from .env.testing.
 */
process.env.APP_ENV = 'test';
process.env.LOG_LEVEL = 'silent';
