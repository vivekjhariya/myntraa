import { products } from '../data/products.js'

export function findProduct(id) {
  return products.find(product => product.id === String(id))
}

export function searchProducts({ category, search } = {}) {
  const query = String(search || '').toLowerCase()
  return products.filter(product => (!category || category === 'All' || product.category.toLowerCase() === category.toLowerCase()) && (!query || `${product.name} ${product.brand} ${product.category}`.toLowerCase().includes(query)))
}
