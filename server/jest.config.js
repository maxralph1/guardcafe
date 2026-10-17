/** @type {import('jest').Config} */
export default {
  testEnvironment: 'node',
  roots: ['<rootDir>/src/tests'],
  testMatch: ['**/*.test.js'],
  /** Tests that need a real database run separately: `npm run test:database` (jest.database.config.js) */
  testPathIgnorePatterns: ['/node_modules/', '/src/tests/integration/'],

  /** 
   * The project is native ESM, so no code transform: tests run exactly as written.
   * (The `test` script also passes --experimental-vm-modules to Node, which Jest needs for ESM.)
  */
  transform: {},

  /** Runs before every test file: forces APP_ENV=test and safe placeholder settings. */
  setupFiles: ['<rootDir>/src/tests/setup/env.js'],

  /** One worker, so tests that share a database later never run at the same time. */
  maxWorkers: 1,
  clearMocks: true,

  /** With no transform, coverage has to come from V8 rather than Babel instrumentation. */
  coverageProvider: 'v8',
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.js', '!src/tests/**', '!src/app/entities/**', '!src/index.js'],
};