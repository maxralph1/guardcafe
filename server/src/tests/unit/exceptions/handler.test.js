import { HttpException } from '../../../app/exceptions/HttpException.js';
import { createErrorHandler, notFoundHandler } from '../../../app/exceptions/handler.js';

/** A minimal stand-in for Express's response that records what the handler does to it. */
const fakeResponse = (overrides = {}) => ({
  headersSent: false,
  statusCode: undefined,
  headers: {},
  body: undefined,
  status(code) {
    this.statusCode = code;
    return this;
  },
  set(headers) {
    Object.assign(this.headers, headers);
    return this;
  },
  json(body) {
    this.body = body;
    return this;
  },
  ...overrides,
});

/** Runs the error handler and returns the response plus anything it passed on to next(). */
const handle = (error, { debug = false, res = fakeResponse() } = {}) => {
  const forwarded = [];

  createErrorHandler({ debug })(error, {}, res, (value) => forwarded.push(value));

  return { res, forwarded };
};

/** An error shaped like the ones libraries throw: it carries its own HTTP status. */
const libraryError = (status, extra = {}) =>
  Object.assign(new Error('internal detail'), { status, ...extra });

describe('notFoundHandler', () => {
  it('passes a 404 HttpException to next()', () => {
    const forwarded = [];

    notFoundHandler({}, fakeResponse(), (error) => forwarded.push(error));

    expect(forwarded).toHaveLength(1);
    expect(forwarded[0]).toBeInstanceOf(HttpException);
    expect(forwarded[0].status).toBe(404);
    expect(forwarded[0].message).toBe('Not Found');
  });
});

describe('createErrorHandler', () => {
  it('has four parameters, which is how Express recognises an error handler', () => {
    expect(createErrorHandler().length).toBe(4);
  });

  describe('HttpException', () => {
    it('responds with its status and message', () => {
      const { res } = handle(new HttpException(409, 'Already exists'));

      expect(res.statusCode).toBe(409);
      expect(res.body).toEqual({ message: 'Already exists' });
    });

    it('includes field errors when it has them', () => {
      const errors = { email: ['The email field is required.'] };

      const { res } = handle(new HttpException(422, 'The given data was invalid.', { errors }));

      expect(res.statusCode).toBe(422);
      expect(res.body).toEqual({ message: 'The given data was invalid.', errors });
    });

    it('sets its headers on the response', () => {
      const { res } = handle(
        new HttpException(429, 'Slow down', { headers: { 'Retry-After': '60' } }),
      );

      expect(res.headers).toEqual({ 'Retry-After': '60' });
    });
  });

  describe('errors thrown by libraries', () => {
    it('uses their status with the standard text, never their own message', () => {
      const { res } = handle(libraryError(403));

      expect(res.statusCode).toBe(403);
      expect(res.body).toEqual({ message: 'Forbidden' });
    });

    it('also understands statusCode', () => {
      const { res } = handle(Object.assign(new Error('x'), { statusCode: 401 }));

      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({ message: 'Unauthorized' });
    });

    it('explains malformed JSON', () => {
      const { res } = handle(libraryError(400, { type: 'entity.parse.failed' }));

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ message: 'Malformed JSON.' });
    });

    it('explains an oversized body', () => {
      const { res } = handle(libraryError(413, { type: 'entity.too.large' }));

      expect(res.statusCode).toBe(413);
      expect(res.body).toEqual({ message: 'Payload Too Large.' });
    });

    it('keeps a 5xx status but hides the message', () => {
      const { res } = handle(libraryError(503));

      expect(res.statusCode).toBe(503);
      expect(res.body).toEqual({ message: 'Server Error' });
    });

    it.each([200, 302, 700, '404', NaN])('treats the invalid status %p as a 500', (status) => {
      const { res } = handle(libraryError(status));

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ message: 'Server Error' });
    });
  });

  describe('unexpected errors', () => {
    it('respond with a 500 and reveal nothing', () => {
      const { res } = handle(new Error('internal detail'));

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ message: 'Server Error' });
      expect(JSON.stringify(res.body)).not.toContain('internal detail');
    });

    it('are recorded on the response so pino-http can log them', () => {
      const error = new Error('internal detail');

      const { res } = handle(error);

      expect(res.err).toBe(error);
    });

    it('are handled even when something other than an Error was thrown', () => {
      const { res } = handle('just a string');

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ message: 'Server Error' });
    });
  });

  describe('debug mode', () => {
    it('adds the message, exception name and stack trace to a 500', () => {
      const { res } = handle(new TypeError('internal detail'), { debug: true });

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe('internal detail');
      expect(res.body.exception).toBe('TypeError');
      expect(Array.isArray(res.body.trace)).toBe(true);
      expect(res.body.trace[0]).toContain('internal detail');
    });

    it('also describes things that were not Errors', () => {
      const { res } = handle('just a string', { debug: true });

      expect(res.body.message).toBe('just a string');
    });

    it('adds nothing to errors below 500', () => {
      const { res } = handle(new HttpException(404, 'Not Found'), { debug: true });

      expect(res.body).toEqual({ message: 'Not Found' });
    });
  });

  describe('logging', () => {
    it('records 5xx errors on the response, but not 4xx ones', () => {
      expect(handle(new HttpException(500)).res.err).toBeDefined();
      expect(handle(new HttpException(404)).res.err).toBeUndefined();
    });
  });

  describe('when the response has already started', () => {
    it('hands the error back to Express and writes nothing', () => {
      const error = new Error('too late');

      const { res, forwarded } = handle(error, { res: fakeResponse({ headersSent: true }) });

      expect(forwarded).toEqual([error]);
      expect(res.statusCode).toBeUndefined();
      expect(res.body).toBeUndefined();
    });
  });
});
