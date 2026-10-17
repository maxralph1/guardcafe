import baseConfig from './jest.config.js';

/**
 * The tests that need a real database (src/tests/integration). They are left out of `npm test`
 * so that it stays fast and works offline. Run them with `npm run test:database`; they use the
 * database in .env.testing, and refuse to run against any database not named *_test.
 */
export default {
  ...baseConfig,
  roots: ['<rootDir>/src/tests/integration'],
  testPathIgnorePatterns: ['/node_modules/'],

  /** Unlike the other tests, these keep the database settings from .env.testing */
  setupFiles: ['<rootDir>/src/tests/setup/databaseEnv.js'],

  /** Migrating an empty database over a slow connection can take minutes */
  testTimeout: 300_000,
};