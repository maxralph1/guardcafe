import { STATUS_CODES } from 'node:http';

/**
 * An error that carries an HTTP status, like Symfony's HttpException in Laravel.
 *
 * Throw it (or call `abort()`) anywhere while handling a request and the exception handler
 * turns it into a JSON response.
 */
export class HttpException extends Error {
  /**
   * @param {number} status - HTTP status code, from 400 to 599.
   * @param {string} [message] - Defaults to the standard text for the status, e.g. "Not Found".
   * @param {object} [options]
   * @param {Record<string, string[]>} [options.errors] - Field-level errors, e.g. for a 422.
   * @param {Record<string, string>} [options.headers] - Extra response headers.
   * @param {unknown} [options.cause] - The error that led to this one.
   */
  constructor(status, message, { errors, headers, cause } = {}) {
    if (!Number.isInteger(status) || status < 400 || status > 599) {
      throw new RangeError(
        `HttpException status must be an integer from 400 to 599, got ${status}`,
      );
    }

    super(message || STATUS_CODES[status] || 'Error', cause === undefined ? undefined : { cause });

    this.name = 'HttpException';
    this.status = status;
    this.errors = errors;
    this.headers = headers ?? {};
  }
}

/** Stops the current request with an HTTP error, like Laravel's abort() helper. */
export const abort = (status, message, options) => {
  throw new HttpException(status, message, options);
};
