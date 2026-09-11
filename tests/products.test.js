// Products API tests
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import request from 'supertest'

let app

describe('Products API', () => {
  beforeAll(async () => {
    const serverModule = await import('../server.js')
    app = serverModule.default || serverModule
  })

  afterAll(async () => {
    // Server cleanup handled by global teardown
  })

  describe('GET /api/products', () => {
    it('should return all products with 200 status', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200)

      expect(response.body).toHaveProperty('products')
      expect(Array.isArray(response.body.products)).toBe(true)
      expect(response.body.products.length).toBeGreaterThan(0)
    })

    it('should return products with correct structure', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200)

      const product = response.body.products[0]
      expect(product).toHaveProperty('id')
      expect(product).toHaveProperty('name')
      expect(product).toHaveProperty('brand')
      expect(product).toHaveProperty('category')
      expect(product).toHaveProperty('price')
      expect(product).toHaveProperty('mrp')
      expect(product).toHaveProperty('image')
      expect(product).toHaveProperty('tag')
      expect(product).toHaveProperty('color')
      expect(product).toHaveProperty('rating')
      expect(product).toHaveProperty('reviews')
      expect(product).toHaveProperty('description')
    })

    it('should filter products by category', async () => {
      const response = await request(app)
        .get('/api/products?category=Women')
        .expect(200)

      expect(response.body.products.every(p => p.category.toLowerCase() === 'women')).toBe(true)
    })

    it('should filter products by search query', async () => {
      const response = await request(app)
        .get('/api/products?search=shirt')
        .expect(200)

      expect(response.body.products.every(p => 
        p.name.toLowerCase().includes('shirt') ||
        p.brand.toLowerCase().includes('shirt') ||
        p.category.toLowerCase().includes('shirt')
      )).toBe(true)
    })

    it('should sort products by price low to high', async () => {
      const response = await request(app)
        .get('/api/products?sort=price-low')
        .expect(200)

      const prices = response.body.products.map(p => p.price)
      const sortedPrices = [...prices].sort((a, b) => a - b)
      expect(prices).toEqual(sortedPrices)
    })

    it('should sort products by price high to low', async () => {
      const response = await request(app)
        .get('/api/products?sort=price-high')
        .expect(200)

      const prices = response.body.products.map(p => p.price)
      const sortedPrices = [...prices].sort((a, b) => b - a)
      expect(prices).toEqual(sortedPrices)
    })

    it('should sort products by rating', async () => {
      const response = await request(app)
        .get('/api/products?sort=rating')
        .expect(200)

      const ratings = response.body.products.map(p => p.rating)
      const sortedRatings = [...ratings].sort((a, b) => b - a)
      expect(ratings).toEqual(sortedRatings)
    })

    it('should combine category filter and sort', async () => {
      const response = await request(app)
        .get('/api/products?category=Men&sort=price-low')
        .expect(200)

      expect(response.body.products.every(p => p.category.toLowerCase() === 'men')).toBe(true)
      const prices = response.body.products.map(p => p.price)
      const sortedPrices = [...prices].sort((a, b) => a - b)
      expect(prices).toEqual(sortedPrices)
    })

    it('should return empty array for non-existent category', async () => {
      const response = await request(app)
        .get('/api/products?category=NonExistentCategory')
        .expect(200)

      expect(response.body.products).toEqual([])
    })

    it('should return empty array for non-matching search', async () => {
      const response = await request(app)
        .get('/api/products?search=nonexistentproductxyz')
        .expect(200)

      expect(response.body.products).toEqual([])
    })
  })
})