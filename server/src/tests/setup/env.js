/**
 * Runs before every test file (Jest `setupFiles`).
 *
 * The equivalent of the <env> block in Laravel's phpunit.xml: tests always run in the "test"
 * environment and never pick up a developer's real settings.
 */
process.env.APP_ENV = 'test';
process.env.LOG_LEVEL = 'silent';

// Placeholder database settings so the config can load. Tests that need a real database
// will bring their own settings (via .env.testing) when we reach the database step.
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.DB_USERNAME = 'guardcafe_test';
process.env.DB_PASSWORD = 'guardcafe_test';
process.env.DB_NAME = 'guardcafe_test';
