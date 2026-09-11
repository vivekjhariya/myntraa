// Coupons API tests
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import request from 'supertest'

let app

describe('Coupons API', () => {
  beforeAll(async () => {
    const serverModule = await import('../server.js')
    app = serverModule.default || serverModule
  })

  afterAll(async () => {
    // Server cleanup handled by global teardown
  })

  describe('POST /api/coupons/validate', () => {
    it('should validate STYLE10 coupon', async () => {
      const response = await request(app)
        .post('/api/coupons/validate')
        .send({ code: 'STYLE10', subtotal: 1000 })
        .expect(200)

      expect(response.body).toHaveProperty('valid', true)
      expect(response.body).toHaveProperty('discount')
      expect(response.body).toHaveProperty('message')
      expect(response.body.discount).toBe(100) // 10% of 1000
    })

    it('should cap STYLE10 discount at 500', async () => {
      const response = await request(app)
        .post('/api/coupons/validate')
        .send({ code: 'STYLE10', subtotal: 10000 })
        .expect(200)

      expect(response.body.discount).toBe(500) // Capped at 500
    })

    it('should validate FIRSTORDER coupon', async () => {
      const response = await request(app)
        .post('/api/coupons/validate')
        .send({ code: 'FIRSTORDER', subtotal: 1000 })
        .expect(200)

      expect(response.body).toHaveProperty('valid', true)
      expect(response.body.discount).toBe(150) // 15% of 1000
    })

    it('should cap FIRSTORDER discount at 750', async () => {
      const response = await request(app)
        .post('/api/coupons/validate')
        .send({ code: 'FIRSTORDER', subtotal: 10000 })
        .expect(200)

      expect(response.body.discount).toBe(750) // Capped at 750
    })

    it('should validate FREESHIP coupon for subtotal >= 499', async () => {
      const response = await request(app)
        .post('/api/coupons/validate')
        .send({ code: 'FREESHIP', subtotal: 500 })
        .expect(200)

      expect(response.body).toHaveProperty('valid', true)
      expect(response.body.discount).toBe(99) // Delivery fee waived
    })

    it('should not apply FREESHIP for subtotal < 499', async () => {
      const response = await request(app)
        .post('/api/coupons/validate')
        .send({ code: 'FREESHIP', subtotal: 100 })
        .expect(200)

      expect(response.body).toHaveProperty('valid', true)
      expect(response.body.discount).toBe(0) // No discount for low subtotal
    })

    it('should reject invalid coupon code', async () => {
      const response = await request(app)
        .post('/api/coupons/validate')
        .send({ code: 'INVALID', subtotal: 1000 })
        .expect(400)

      expect(response.body).toHaveProperty('valid', false)
      expect(response.body).toHaveProperty('message')
    })

    it('should reject coupon with missing subtotal', async () => {
      const response = await request(app)
        .post('/api/coupons/validate')
        .send({ code: 'STYLE10' })
        .expect(400)

      expect(response.body).toHaveProperty('valid', false)
      expect(response.body).toHaveProperty('message')
    })

    it('should reject coupon with zero subtotal', async () => {
      const response = await request(app)
        .post('/api/coupons/validate')
        .send({ code: 'STYLE10', subtotal: 0 })
        .expect(400)

      expect(response.body).toHaveProperty('valid', false)
      expect(response.body).toHaveProperty('message')
    })

    it('should be case-insensitive for coupon code', async () => {
      const response = await request(app)
        .post('/api/coupons/validate')
        .send({ code: 'style10', subtotal: 1000 })
        .expect(200)

      expect(response.body).toHaveProperty('valid', true)
      expect(response.body.discount).toBe(100)
    })

    it('should handle decimal subtotal correctly', async () => {
      const response = await request(app)
        .post('/api/coupons/validate')
        .send({ code: 'STYLE10', subtotal: 999.99 })
        .expect(200)

      expect(response.body.discount).toBe(99) // 10% of 999.99 = 99.999, rounded down
    })
  })
})