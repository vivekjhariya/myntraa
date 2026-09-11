// Health endpoint tests
import { describe, it, expect, vi } from 'vitest'
import request from 'supertest'

// Import the app after setting up mocks
let app
let server

describe('Health Endpoint', () => {
  beforeAll(async () => {
    // Import the server module
    const serverModule = await import('../server.js')
    app = serverModule.default || serverModule
  })

  afterAll(async () => {
    if (server) {
      await new Promise(resolve => server.close(resolve))
    }
  })

  it('GET /api/health should return 200 with ok status', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200)

    expect(response.body).toHaveProperty('ok', true)
    expect(response.body).toHaveProperty('database')
    expect(typeof response.body.database).toBe('boolean')
  })

  it('GET /api/health should respond quickly', async () => {
    const start = Date.now()
    await request(app).get('/api/health').expect(200)
    const duration = Date.now() - start
    expect(duration).toBeLessThan(1000)
  })
})