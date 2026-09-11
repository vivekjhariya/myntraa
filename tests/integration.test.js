// Integration tests - Full user flow
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import request from 'supertest'

let app
let authToken
let testUser

describe('Integration: Full User Flow', () => {
  beforeAll(async () => {
    const serverModule = await import('../server.js')
    app = serverModule.default || serverModule

    // Create a test user
    testUser = {
      name: 'Integration Test User',
      email: `integration-${Date.now()}@example.com`,
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

  it('should complete full user journey: signup -> browse -> add to cart -> apply coupon -> checkout', async () => {
    // 1. Browse products
    const productsResponse = await request(app)
      .get('/api/products')
      .expect(200)

    expect(productsResponse.body.products.length).toBeGreaterThan(0)
    const productId = productsResponse.body.products[0].id
    const productPrice = productsResponse.body.products[0].price

    // 2. Add product to cart
    const addToCartResponse = await request(app)
      .post('/api/cart')
      .set(getAuthHeader())
      .send({ id: productId, qty: 2 })
      .expect(201)

    expect(addToCartResponse.body.items.length).toBe(1)
    expect(addToCartResponse.body.items[0].qty).toBe(2)

    // 3. View cart
    const cartResponse = await request(app)
      .get('/api/cart')
      .set(getAuthHeader())
      .expect(200)

    expect(cartResponse.body.items.length).toBe(1)
    expect(cartResponse.body.items[0].id).toBe(productId)
    expect(cartResponse.body.items[0].qty).toBe(2)

    // 4. Calculate subtotal
    const subtotal = productPrice * 2

    // 5. Apply coupon
    const couponResponse = await request(app)
      .post('/api/coupons/validate')
      .send({ code: 'STYLE10', subtotal })
      .expect(200)

    expect(couponResponse.body.valid).toBe(true)
    expect(couponResponse.body.discount).toBeGreaterThan(0)

    // 6. Update cart quantity
    const updateCartResponse = await request(app)
      .patch(`/api/cart/${productId}`)
      .set(getAuthHeader())
      .send({ qty: 3 })
      .expect(200)

    expect(updateCartResponse.body.items[0].qty).toBe(3)

    // 7. Remove item from cart
    const deleteCartResponse = await request(app)
      .delete(`/api/cart/${productId}`)
      .set(getAuthHeader())
      .expect(200)

    expect(deleteCartResponse.body.items).toEqual([])
  })

  it('should handle multiple users with separate carts', async () => {
    // Create second user
    const user2 = {
      name: 'User Two',
      email: `user2-${Date.now()}@example.com`,
      password: 'password123'
    }

    const signup2 = await request(app)
      .post('/api/auth/signup')
      .send(user2)
      .expect(201)

    const token2 = signup2.body.token
    const authHeader2 = { Authorization: `Bearer ${token2}` }

    // Get products
    const productsResponse = await request(app).get('/api/products').expect(200)
    const productId = productsResponse.body.products[0].id

    // User 1 adds to cart
    await request(app)
      .post('/api/cart')
      .set(getAuthHeader())
      .send({ id: productId, qty: 1 })
      .expect(201)

    // User 2 adds to cart
    await request(app)
      .post('/api/cart')
      .set(authHeader2)
      .send({ id: productId, qty: 5 })
      .expect(201)

    // Check user 1 cart
    const cart1 = await request(app)
      .get('/api/cart')
      .set(getAuthHeader())
      .expect(200)

    expect(cart1.body.items[0].qty).toBe(1)

    // Check user 2 cart
    const cart2 = await request(app)
      .get('/api/cart')
      .set(authHeader2)
      .expect(200)

    expect(cart2.body.items[0].qty).toBe(5)
  })

  it('should filter and sort products correctly', async () => {
    // Test category filter
    const womenResponse = await request(app)
      .get('/api/products?category=Women')
      .expect(200)

    expect(womenResponse.body.products.every(p => p.category === 'Women')).toBe(true)

    // Test search
    const searchResponse = await request(app)
      .get('/api/products?search=dress')
      .expect(200)

    expect(searchResponse.body.products.length).toBeGreaterThan(0)
    expect(searchResponse.body.products.every(p => 
      p.name.toLowerCase().includes('dress') ||
      p.category.toLowerCase().includes('dress')
    )).toBe(true)

    // Test sort by price
    const sortResponse = await request(app)
      .get('/api/products?sort=price-low')
      .expect(200)

    const prices = sortResponse.body.products.map(p => p.price)
    expect(prices).toEqual([...prices].sort((a, b) => a - b))
  })
})