import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from './server.js';

describe('API security and public contract', () => {
  it('returns a structured health response', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.data.status).toBe('ok');
  });

  it('rejects protected routes without a token', async () => {
    const response = await request(app).get('/api/v1/admins');
    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('UNAUTHORIZED');
  });

  it('validates contact submissions', async () => {
    const response = await request(app).post('/api/v1/contact-submissions').send({ email: 'invalid' });
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });
});
