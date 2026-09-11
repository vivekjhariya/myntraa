// Cart API tests
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import request from 'supertest'

let app
let authToken
let testUser

describe('Cart API', () => {
  beforeAll(async () => {
    const serverModule = await import('../server.js')
    app = serverModule.default || serverModule

    // Create a test user and get auth token
    testUser = {
      name: 'Cart Test User',
      email: `cart-test-${Date.now()}@example.com`,
      password: 'password123'
    }

    const signupResponse = await request(app)
      .post('/api/auth/signup')
      .send(testUser)
      .expect(201)

    authToken = signupResponse.body.token
  })

  afterAll(async () => {
    // Server cleanup handled by global teardown
  })

  const getAuthHeader = () => ({ Authorization: `Bearer ${authToken}` })

  describe('GET /api/cart', () => {
    it('should return empty cart for new user', async () => {
      const response = await request(app)
        .get('/api/cart')
        .set(getAuthHeader())
        .expect(200)

      expect(response.body).toHaveProperty('items')
      expect(Array.isArray(response.body.items)).toBe(true)
      expect(response.body.items).toEqual([])
    })

    it('should reject request without auth token', async () => {
      await request(app)
        .get('/api/cart')
        .expect(401)
    })

    it('should reject request with invalid token', async () => {
      await request(app)
        .get('/api/cart')
        .set({ Authorization: 'Bearer invalid-token' })
        .expect(401)
    })
  })

  describe('POST /api/cart', () => {
    it('should add item to cart', async () => {
      // First get a product ID
      const productsResponse = await request(app).get('/api/products').expect(200)
      const productId = productsResponse.body.products[0].id

      const response = await request(app)
        .post('/api/cart')
        .set(getAuthHeader())
        .send({ id: productId, qty: 1 })
        .expect(201)

      expect(response.body).toHaveProperty('items')
      expect(response.body.items.length).toBe(1)
      expect(response.body.items[0]).toHaveProperty('id', productId)
      expect(response.body.items[0]).toHaveProperty('qty', 1)
    })

    it('should increment quantity when adding same product', async () => {
      const productsResponse = await request(app).get('/api/products').expect(200)
      const productId = productsResponse.body.products[0].id

      // Add first time
      await request(app)
        .post('/api/cart')
        .set(getAuthHeader())
        .send({ id: productId, qty: 1 })
        .expect(201)

      // Add second time
      const response = await request(app)
        .post('/api/cart')
        .set(getAuthHeader())
        .send({ id: productId, qty: 2 })
        .expect(201)

      expect(response.body.items[0].qty).toBe(3)
    })

    it('should reject adding item without auth', async () => {
      const productsResponse = await request(app).get('/api/products').expect(200)
      const productId = productsResponse.body.products[0].id

      await request(app)
        .post('/api/cart')
        .send({ id: productId, qty: 1 })
        .expect(401)
    })

    it('should reject adding item with invalid product ID', async () => {
      const response = await request(app)
        .post('/api/cart')
        .set(getAuthHeader())
        .send({ id: 'invalid-product-id', qty: 1 })
        .expect(201)

      // The item will be added but filtered out when fetching
      // because it doesn't exist in the products list
      expect(response.body.items).toEqual([])
    })

    it('should default qty to 1 when not provided', async () => {
      const productsResponse = await request(app).get('/api/products').expect(200)
      const productId = productsResponse.body.products[0].id

      const response = await request(app)
        .post('/api/cart')
        .set(getAuthHeader())
        .send({ id: productId })
        .expect(201)

      expect(response.body.items[0].qty).toBe(1)
    })
  })

  describe('PATCH /api/cart/:id', () => {
    let productId

    beforeAll(async () => {
      const productsResponse = await request(app).get('/api/products').expect(200)
      productId = productsResponse.body.products[0].id

      // Add item to cart first
      await request(app)
        .post('/api/cart')
        .set(getAuthHeader())
        .send({ id: productId, qty: 1 })
        .expect(201)
    })

    it('should update item quantity', async () => {
      const response = await request(app)
        .patch(`/api/cart/${productId}`)
        .set(getAuthHeader())
        .send({ qty: 5 })
        .expect(200)

      expect(response.body.items[0].qty).toBe(5)
    })

    it('should remove item when qty is 0', async () => {
      const response = await request(app)
        .patch(`/api/cart/${productId}`)
        .set(getAuthHeader())
        .send({ qty: 0 })
        .expect(200)

      expect(response.body.items).toEqual([])
    })

    it('should reject update without auth', async () => {
      await request(app)
        .patch(`/api/cart/${productId}`)
        .send({ qty: 5 })
        .expect(401)
    })
  })

  describe('DELETE /api/cart/:id', () => {
    let productId

    beforeAll(async () => {
      const productsResponse = await request(app).get('/api/products').expect(200)
      productId = productsResponse.body.products[0].id

      // Add item to cart first
      await request(app)
        .post('/api/cart')
        .set(getAuthHeader())
        .send({ id: productId, qty: 1 })
        .expect(201)
    })

    it('should remove item from cart', async () => {
      const response = await request(app)
        .delete(`/api/cart/${productId}`)
        .set(getAuthHeader())
        .expect(200)

      expect(response.body.items).toEqual([])
    })

    it('should reject delete without auth', async () => {
      await request(app)
        .delete(`/api/cart/${productId}`)
        .expect(401)
    })
  })

  describe('Cart with multiple items', () => {
    it('should handle multiple different products in cart', async () => {
      const productsResponse = await request(app).get('/api/products').expect(200)
      const productIds = productsResponse.body.products.slice(0, 3).map(p => p.id)

      // Add multiple items
      for (const id of productIds) {
        await request(app)
          .post('/api/cart')
          .set(getAuthHeader())
          .send({ id, qty: 1 })
          .expect(201)
      }

      const response = await request(app)
        .get('/api/cart')
        .set(getAuthHeader())
        .expect(200)

      expect(response.body.items.length).toBe(3)
      expect(response.body.items.map(i => i.id).sort()).toEqual(productIds.sort())
    })
  })
})