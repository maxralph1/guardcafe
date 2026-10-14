import request from 'supertest';
import { createApp } from '../../app.js';
import config from '../../config/index.js';
import corsConfig from '../../config/cors.js';

const allowedOrigin = 'http://localhost:5173';

describe('security headers', () => {
  const app = createApp();

  it('sets the helmet defaults', async () => {
    const response = await request(app).get('/health');

    expect(response.headers['x-content-type-options']).toBe('nosniff');
  });

  it('does not reveal that the server runs Express', async () => {
    const response = await request(app).get('/health');

    expect(response.headers['x-powered-by']).toBeUndefined();
  });
});

describe('request ids', () => {
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
  const app = createApp();

  it('gives every response a unique X-Request-Id', async () => {
    const first = await request(app).get('/health');
    const second = await request(app).get('/health');

    expect(first.headers['x-request-id']).toMatch(uuid);
    expect(second.headers['x-request-id']).toMatch(uuid);
    expect(first.headers['x-request-id']).not.toBe(second.headers['x-request-id']);
  });

  it('ignores an id supplied by the client', async () => {
    const response = await request(app).get('/health').set('X-Request-Id', 'chosen-by-client');

    expect(response.headers['x-request-id']).not.toBe('chosen-by-client');
  });

  it('includes the id on error responses', async () => {
    const response = await request(app).get('/no-such-route');

    expect(response.headers['x-request-id']).toMatch(uuid);
  });
});

describe('CORS', () => {
  const app = createApp({ cors: { ...corsConfig, origin: [allowedOrigin] } });

  it('allows a configured origin, with credentials', async () => {
    const response = await request(app).get('/health').set('Origin', allowedOrigin);

    expect(response.headers['access-control-allow-origin']).toBe(allowedOrigin);
    expect(response.headers['access-control-allow-credentials']).toBe('true');
  });

  it('does not allow any other origin', async () => {
    const response = await request(app).get('/health').set('Origin', 'http://evil.example');

    expect(response.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('allows no cross-origin request at all while no origin is configured', async () => {
    const closedApp = createApp({ cors: { ...corsConfig, origin: [] } });

    const response = await request(closedApp).get('/health').set('Origin', allowedOrigin);

    expect(response.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('answers a preflight request', async () => {
    const response = await request(app)
      .options(`${config.apiPrefix}/anything`)
      .set('Origin', allowedOrigin)
      .set('Access-Control-Request-Method', 'DELETE');

    expect(response.status).toBe(204);
    expect(response.headers['access-control-allow-origin']).toBe(allowedOrigin);
    expect(response.headers['access-control-allow-methods']).toContain('DELETE');
    expect(response.headers['access-control-max-age']).toBe('86400');
  });
});

describe('rate limiting', () => {
  it('rejects requests over the limit with a JSON 429', async () => {
    const app = createApp({ rateLimit: { windowMs: 60_000, max: 2 } });
    const url = `${config.apiPrefix}/anything`;

    // The route does not exist, so these are 404s, but they still count towards the limit.
    expect((await request(app).get(url)).status).toBe(404);
    expect((await request(app).get(url)).status).toBe(404);

    const blocked = await request(app).get(url);

    expect(blocked.status).toBe(429);
    expect(blocked.body).toEqual({ message: 'Too Many Attempts.' });
  });

  it('never throttles the health check', async () => {
    const app = createApp({ rateLimit: { windowMs: 60_000, max: 1 } });

    for (let attempt = 0; attempt < 3; attempt += 1) {
      expect((await request(app).get('/health')).status).toBe(200);
    }
  });

  it('keeps separate counters for each app instance', async () => {
    const options = { rateLimit: { windowMs: 60_000, max: 1 } };
    const url = `${config.apiPrefix}/anything`;

    await request(createApp(options)).get(url);

    expect((await request(createApp(options)).get(url)).status).toBe(404);
  });

  it('does not send the legacy X-RateLimit headers', async () => {
    const response = await request(createApp()).get(`${config.apiPrefix}/anything`);

    expect(response.headers['x-ratelimit-limit']).toBeUndefined();
  });
});
