import express from 'express';
import request from 'supertest';
import { createApp } from '../../app.js';
import config from '../../config/index.js';
import { HttpException } from '../../app/exceptions/HttpException.js';
import { createErrorHandler, notFoundHandler } from '../../app/exceptions/handler.js';

describe('errors from the real application', () => {
  const app = createApp();

  it('answers an unknown route with a JSON 404', async () => {
    const response = await request(app).get('/no-such-route');

    expect(response.status).toBe(404);
    expect(response.headers['content-type']).toMatch(/application\/json/);
    expect(response.body).toEqual({ message: 'Not Found' });
  });

  it('answers an unknown API route with a JSON 404', async () => {
    const response = await request(app).get(`${config.apiPrefix}/no-such-route`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Not Found' });
  });

  it('answers malformed JSON with a 400', async () => {
    const response = await request(app)
      .post(`${config.apiPrefix}/anything`)
      .set('Content-Type', 'application/json')
      .send('{"broken":');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Malformed JSON.' });
  });

  it('answers an oversized body with a 413', async () => {
    const response = await request(app)
      .post(`${config.apiPrefix}/anything`)
      .send({ notes: 'x'.repeat(200_000) });

    expect(response.status).toBe(413);
    expect(response.body).toEqual({ message: 'Payload Too Large.' });
  });
});

describe('the error handler inside a real Express app', () => {
  const buildApp = ({ debug = false } = {}) => {
    const app = express();

    app.get('/conflict', () => {
      throw new HttpException(409, 'Already exists');
    });

    app.get('/invalid', () => {
      throw new HttpException(422, 'The given data was invalid.', {
        errors: { email: ['The email field is required.'] },
      });
    });

    app.get('/throttled', () => {
      throw new HttpException(429, 'Too Many Attempts.', { headers: { 'Retry-After': '60' } });
    });

    app.get('/boom', () => {
      throw new Error('the database password is hunter2');
    });

    app.get('/async-boom', async () => {
      throw new Error('the async secret');
    });

    app.use(notFoundHandler);
    app.use(createErrorHandler({ debug }));

    return app;
  };

  it('turns an HttpException into its JSON response', async () => {
    const response = await request(buildApp()).get('/conflict');

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ message: 'Already exists' });
  });

  it('includes field errors in the Laravel shape', async () => {
    const response = await request(buildApp()).get('/invalid');

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      message: 'The given data was invalid.',
      errors: { email: ['The email field is required.'] },
    });
  });

  it('sends the headers an HttpException carries', async () => {
    const response = await request(buildApp()).get('/throttled');

    expect(response.status).toBe(429);
    expect(response.headers['retry-after']).toBe('60');
  });

  it('hides the details of an unexpected error', async () => {
    const response = await request(buildApp()).get('/boom');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Server Error' });
    expect(response.text).not.toContain('hunter2');
  });

  it('catches errors thrown inside async handlers too', async () => {
    const response = await request(buildApp()).get('/async-boom');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Server Error' });
  });

  it('shows the details of an unexpected error in debug mode', async () => {
    const response = await request(buildApp({ debug: true })).get('/boom');

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('the database password is hunter2');
    expect(response.body.exception).toBe('Error');
    expect(Array.isArray(response.body.trace)).toBe(true);
  });
});
