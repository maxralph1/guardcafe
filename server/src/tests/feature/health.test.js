import request from 'supertest';
import { createApp } from '../../app.js';
import config from '../../config/index.js';

describe('GET /health', () => {
  const app = createApp();

  it('reports that the application is running', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/application\/json/);
    expect(response.body).toMatchObject({ status: 'ok', name: 'GuardCafe' });
    expect(new Date(response.body.timestamp).toISOString()).toBe(response.body.timestamp);
  });

  it('is never cached', async () => {
    const response = await request(app).get('/health');

    expect(response.headers['cache-control']).toBe('no-store');
  });

  it('lives at the root of the server, not under the API prefix', async () => {
    const response = await request(app).get(`${config.apiPrefix}/health`);

    expect(response.status).toBe(404);
  });
});
