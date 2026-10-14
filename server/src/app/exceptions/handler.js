import { STATUS_CODES } from 'node:http';
import { HttpException } from './HttpException.js';
/**
 * Messages for the errors Express's body parser (express.json) raises.
 */
const BODY_PARSER_MESSAGES = new Map([
  ['entity.parse.failed', 'Malformed JSON.'],
  ['entity.too.large', 'Payload Too Large.'],
]);

const isErrorStatus = (value) => Number.isInteger(value) && value >= 400 && value <= 599;

/** Runs when no route matched: hands a 404 to the error handler. */
export const notFoundHandler = (req, res, next) => {
  next(new HttpException(404, 'Not Found'));
};

/**
 * Builds the error handler that turns every error into a JSON response (the equivalent of
 * Laravel's exception Handler).
 *
 *   HttpException         -> its own status, message, errors and headers
 *   library errors (4xx)  -> that status, with the standard text (their own message is never shown)
 *   anything else         -> 500 "Server Error"
 *
 * The message and stack trace of an unexpected error are only included when `debug` is on.
 */
export const createErrorHandler = ({ debug = false } = {}) => {
  /** Express recognises an error handler by its four parameters, so `next` has to stay. */
  return (err, req, res, next) => {
    /** Too late to send a clean response: let Express close the connection. */
    if (res.headersSent) return next(err);

    const error = err instanceof Error ? err : new Error(String(err));

    let status = 500;
    let headers = {};
    let body = { message: 'Server Error' };

    if (error instanceof HttpException) {
      status = error.status;
      headers = error.headers;
      body = { message: error.message };
      if (error.errors) body.errors = error.errors;
    } else {
      /** Libraries such as body-parser and http-errors set `status` (or `statusCode`) themselves. */
      const libraryStatus = error.status ?? error.statusCode;

      if (isErrorStatus(libraryStatus)) {
        status = libraryStatus;
        if (status < 500) {
          body = { message: BODY_PARSER_MESSAGES.get(error.type) ?? STATUS_CODES[status] };
        }
      }
    }

    if (status >= 500) {
      /** pino-http picks this up and logs the error, with its stack, in the request's log line. */
      res.err = error;

      if (debug) {
        body = {
          ...body,
          message: error.message || body.message,
          exception: error.name,
          trace: (error.stack ?? '').split('\n').map((line) => line.trim()),
        };
      }
    }

    return res.status(status).set(headers).json(body);
  };
};
