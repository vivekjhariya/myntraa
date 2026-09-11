// Auth API tests
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import request from 'supertest'

let app

describe('Auth API', () => {
  beforeAll(async () => {
    const serverModule = await import('../server.js')
    app = serverModule.default || serverModule
  })

  afterAll(async () => {
    // Server cleanup handled by global teardown
  })

  describe('POST /api/auth/signup', () => {
    it('should create a new user and return token', async () => {
      const userData = {
        name: 'Test User',
        email: `test-${Date.now()}@example.com`,
        password: 'password123'
      }

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(201)

      expect(response.body).toHaveProperty('user')
      expect(response.body.user).toHaveProperty('id')
      expect(response.body.user).toHaveProperty('name', userData.name)
      expect(response.body.user).toHaveProperty('email', userData.email.toLowerCase())
      expect(response.body).toHaveProperty('token')
      expect(typeof response.body.token).toBe('string')
    })

    it('should reject signup with missing name', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'test@example.com', password: 'password123' })
        .expect(400)

      expect(response.body).toHaveProperty('message')
    })

    it('should reject signup with missing email', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Test User', password: 'password123' })
        .expect(400)

      expect(response.body).toHaveProperty('message')
    })

    it('should reject signup with missing password', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Test User', email: 'test@example.com' })
        .expect(400)

      expect(response.body).toHaveProperty('message')
    })

    it('should reject signup with password too short', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Test User', email: 'test@example.com', password: '123' })
        .expect(400)

      expect(response.body).toHaveProperty('message')
    })

    it('should reject duplicate email', async () => {
      const userData = {
        name: 'Test User',
        email: `duplicate-${Date.now()}@example.com`,
        password: 'password123'
      }

      // First signup
      await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(201)

      // Second signup with same email
      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(409)

      expect(response.body).toHaveProperty('message')
    })

    it('should normalize email to lowercase', async () => {
      const userData = {
        name: 'Test User',
        email: `UPPERCASE-${Date.now()}@EXAMPLE.COM`,
        password: 'password123'
      }

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(201)

      expect(response.body.user.email).toBe(userData.email.toLowerCase())
    })
  })

  describe('POST /api/auth/login', () => {
    let testUser

    beforeAll(async () => {
      // Create a test user for login tests
      testUser = {
        name: 'Login Test User',
        email: `login-test-${Date.now()}@example.com`,
        password: 'password123'
      }

      await request(app)
        .post('/api/auth/signup')
        .send(testUser)
        .expect(201)
    })

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: testUser.password })
        .expect(200)

      expect(response.body).toHaveProperty('user')
      expect(response.body.user).toHaveProperty('id')
      expect(response.body.user).toHaveProperty('name', testUser.name)
      expect(response.body.user).toHaveProperty('email', testUser.email.toLowerCase())
      expect(response.body).toHaveProperty('token')
    })

    it('should reject login with wrong password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: 'wrongpassword' })
        .expect(401)

      expect(response.body).toHaveProperty('message')
    })

    it('should reject login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nonexistent@example.com', password: 'password123' })
        .expect(401)

      expect(response.body).toHaveProperty('message')
    })

    it('should reject login with missing email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ password: 'password123' })
        .expect(401)

      expect(response.body).toHaveProperty('message')
    })

    it('should reject login with missing password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email })
        .expect(401)

      expect(response.body).toHaveProperty('message')
    })

    it('should be case-insensitive for email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email.toUpperCase(), password: testUser.password })
        .expect(200)

      expect(response.body).toHaveProperty('token')
    })
  })
})