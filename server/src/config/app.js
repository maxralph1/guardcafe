import config from './index.js';

/**
 * Application-level settings (the equivalent of Laravel's config/app.php).
 */
export default Object.freeze({
  name: 'GuardCafe',

  /**
   * When true, unexpected errors include their message and stack trace in the JSON response.
   * Only ever on in development, never in production or test.
   */
  debug: config.isDev,
});
