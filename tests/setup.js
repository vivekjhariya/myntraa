// Test setup file - runs before all tests
import { beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest'

// Mock environment variables for testing
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-secret-key-for-testing-only'
process.env.PORT = '3002'

// Mock console methods to reduce noise in tests
const originalConsole = { ...console }
beforeAll(() => {
  console.log = vi.fn()
  console.error = vi.fn()
  console.warn = vi.fn()
})

afterAll(() => {
  console.log = originalConsole.log
  console.error = originalConsole.error
  console.warn = originalConsole.warn
})

// Global test utilities
global.testUtils = {
  // Generate a valid JWT token for testing
  generateToken: async (payload = { id: 'test-user-id', email: 'test@example.com', name: 'Test User' }) => {
    const jwt = await import('jsonwebtoken')
    return jwt.default.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })
  },

  // Create test user data
  createTestUser: (overrides = {}) => ({
    name: 'Test User',
    email: `test-${Date.now()}@example.com`,
    password: 'password123',
    ...overrides
  }),

  // Create test product data
  createTestProduct: (overrides = {}) => ({
    id: `test-${Date.now()}`,
    name: 'Test Product',
    brand: 'Test Brand',
    category: 'Test',
    price: 1000,
    mrp: 1500,
    image: 'https://example.com/image.jpg',
    tag: 'Test',
    color: '#ffffff',
    rating: 4.5,
    reviews: 10,
    description: 'Test description',
    ...overrides
  })
}

// Clean up any global state between tests
beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  vi.resetModules()
})