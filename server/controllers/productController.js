import { products } from '../data/products.js'

export function listProducts(req, res) {
  const { category, search, sort } = req.query
  const query = String(search || '').toLowerCase()
  const result = products.filter(product => (!category || category === 'All' || product.category.toLowerCase() === category.toLowerCase()) && (!query || `${product.name} ${product.brand} ${product.category}`.toLowerCase().includes(query)))
  if (sort === 'price-low') result.sort((a, b) => a.price - b.price)
  if (sort === 'price-high') result.sort((a, b) => b.price - a.price)
  if (sort === 'rating') result.sort((a, b) => b.rating - a.rating)
  res.json({ products: result })
}
