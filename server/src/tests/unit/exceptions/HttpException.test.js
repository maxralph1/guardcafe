import { HttpException, abort } from '../../../app/exceptions/HttpException.js';

describe('HttpException', () => {
  it('is an Error that carries its HTTP status', () => {
    const exception = new HttpException(404, 'No such officer');

    expect(exception).toBeInstanceOf(Error);
    expect(exception).toBeInstanceOf(HttpException);
    expect(exception.name).toBe('HttpException');
    expect(exception.status).toBe(404);
    expect(exception.message).toBe('No such officer');
  });

  it('defaults the message to the standard text for the status', () => {
    expect(new HttpException(404).message).toBe('Not Found');
    expect(new HttpException(403).message).toBe('Forbidden');
    expect(new HttpException(503).message).toBe('Service Unavailable');
  });

  it('defaults to no field errors and no extra headers', () => {
    const exception = new HttpException(400);

    expect(exception.errors).toBeUndefined();
    expect(exception.headers).toEqual({});
  });

  it('carries field errors, headers and a cause when given', () => {
    const cause = new Error('original');
    const exception = new HttpException(422, 'The given data was invalid.', {
      errors: { email: ['The email field is required.'] },
      headers: { 'Retry-After': '60' },
      cause,
    });

    expect(exception.errors).toEqual({ email: ['The email field is required.'] });
    expect(exception.headers).toEqual({ 'Retry-After': '60' });
    expect(exception.cause).toBe(cause);
  });

  it.each([200, 399, 600, 404.5, '404', null, undefined])('rejects the status %p', (status) => {
    expect(() => new HttpException(status)).toThrow(RangeError);
  });
});

describe('abort', () => {
  it('throws an HttpException with the given status and message', () => {
    expect(() => abort(404, 'Officer not found')).toThrow(HttpException);
    expect(() => abort(404, 'Officer not found')).toThrow('Officer not found');
  });

  it('passes the options through', () => {
    let thrown;

    try {
      abort(409, 'Conflict', { headers: { 'X-Test': '1' } });
    } catch (error) {
      thrown = error;
    }

    expect(thrown.status).toBe(409);
    expect(thrown.headers).toEqual({ 'X-Test': '1' });
  });
});
