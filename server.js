import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import mysql from 'mysql2/promise'
import path from 'path'
import { fileURLToPath } from 'url'
import productRoutes from './server/routes/productRoutes.js'

const app = express()
const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || 'myntraa-demo-secret-change-me'
app.use(cors())
app.use(express.json())
app.use('/api/catalog/products', productRoutes)

const products = [
  ['1','Sage linen co-ord set','House of Myntraa','Women',1899,2999,'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=700&q=85','New drop','#dce5d5',4.8,128],
  ['2','Relaxed everyday shirt','North Nine','Men',1299,1899,'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=700&q=85','Bestseller','#d9e1e6',4.7,94],
  ['3','Luna satin slip dress','Mysa Studio','Women',2399,3499,'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=700&q=85','Just in','#e8d4d8',4.9,76],
  ['4','Textured tote bag','Sonder','Women',999,1499,'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=700&q=85','Trending','#e5ddce',4.6,201],
  ['5','Utility overshirt','East End','Men',1749,2499,'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=700&q=85','Bestseller','#cfd3ce',4.5,65],
  ['6','Cotton day dress','Mellow','Women',1499,2299,'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=700&q=85','Limited','#e4cfbc',4.8,88],
  ['7','Cloud knit pullover','Little Loop','Kids',899,1299,'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=700&q=85','Cute pick','#e5d8c6',4.7,42],
  ['8','Everyday sneakers','Cove','Men',2199,3299,'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&q=85','Iconic','#d9d9d9',4.6,315],
  ['9','Glow essentials kit','Orris','Beauty',799,1099,'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=700&q=85','Bestseller','#ead9d0',4.9,154],
  ['10','Handwoven cushion set','Nook','Home',1199,1699,'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=700&q=85','New','#dbd0c1',4.5,38],
  ['11','Ribbed polo tee','Common Ground','Men',899,1299,'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=700&q=85','Easy essential','#ced8dc',4.4,72],
  ['12','Pleated wide leg pants','Form & Fold','Women',1699,2499,'https://images.unsplash.com/photo-1506629905607-d9f6a2c2ac8a?w=700&q=85','Editor pick','#d5c9c3',4.7,58]
  ,['13','Classic straight fit jeans','Denim District','Women',1599,2499,'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=700&q=85','Best fit','#c9d5df',4.7,184]
  ,['14','High rise cargo pants','Urban Theory','Women',1899,2799,'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=700&q=85','Trending','#d8d1c4',4.6,112]
  ,['15','Oversized graphic shirt','Offbeat','Women',1199,1799,'https://images.unsplash.com/photo-1564257577054-2e9b8f7d7f4e?w=700&q=85','New drop','#e6d9d3',4.5,61]
  ,['16','Slim taper blue jeans','Denim District','Men',1799,2699,'https://images.unsplash.com/photo-1542272604-787c3835535d?w=700&q=85','Bestseller','#c6d3dc',4.8,226]
  ,['17','Classic Oxford shirt','North Nine','Men',1399,1999,'https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?w=700&q=85','Work edit','#dfe4e6',4.6,87]
  ,['18','Relaxed linen trousers','Form & Fold','Men',1699,2399,'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=700&q=85','Summer pick','#e1d8c8',4.7,73]
  ,['19','Printed casual shirt','Little Loop','Boys',699,999,'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=700&q=85','Play ready','#d9e4ed',4.6,44]
  ,['20','Boys jogger pants','Little Loop','Boys',799,1199,'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=700&q=85','Everyday','#d8d5ce',4.5,39]
  ,['21','Girls floral party dress','Mini Mellow','Girls',1099,1599,'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=700&q=85','Party edit','#f0d8da',4.8,68]
  ,['22','Girls denim jacket','Mini Mellow','Girls',999,1499,'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=700&q=85','Layer up','#cbd9e4',4.7,51]
  ,['23','Kids colour block hoodie','Tiny Tribe','Kids',899,1299,'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=700&q=85','Cosy pick','#ddd7e6',4.7,57]
  ,['24','Kids cotton shorts set','Tiny Tribe','Kids',749,1099,'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=700&q=85','Value set','#d8e5d2',4.6,46]
  ,['25','Women relaxed linen pants','House of Myntraa','Women',1499,2199,'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=700&q=85','New season','#e4dacb',4.8,91]
  ,['26','Men textured overshirt','East End','Men',1599,2299,'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=700&q=85','Layering hero','#ccd5d0',4.6,79]
  ,['27','Women printed cotton shirt','Mellow','Women',1299,1899,'https://images.unsplash.com/photo-1605763240000-7e93b172d754?w=700&q=85','Fresh print','#ecd8d0',4.7,63]
  ,['28','Men cargo utility pants','Urban Theory','Men',1799,2599,'https://images.unsplash.com/photo-1517438476312-10d79c077509?w=700&q=85','Utility edit','#d2d4c8',4.5,48]
  ,['29','Floral printed kurta set','Aara Studio','Women',2199,3299,'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=700&q=85','Festive edit','#ead4c7',4.8,96]
  ,['30','Embroidered occasion saree','Aara Studio','Women',2899,4499,'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&q=85','Occasion wear','#d8c2c9',4.9,74]
  ,['31','Men cotton kurta','Indigo Route','Men',1199,1799,'https://images.unsplash.com/photo-1597983073493-88cd35cf93d0?w=700&q=85','Festive edit','#d9e2dc',4.7,83]
  ,['32','Performance running tee','Motion Lab','Men',899,1299,'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=85','Activewear','#d7e0e5',4.6,119]
  ,['33','High support sports bra','Motion Lab','Women',999,1499,'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=700&q=85','Activewear','#ded7e6',4.7,142]
  ,['34','Everyday ballet flats','Sole Story','Women',1299,1999,'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=700&q=85','New in','#ead8cd',4.5,67]
  ,['35','Leather finish loafers','Sole Story','Men',1999,2999,'https://images.unsplash.com/photo-1614252235316-8c857d6c43a5?w=700&q=85','Office edit','#d4c3b2',4.6,88]
  ,['36','Canvas weekend backpack','Carryall Co.','Accessories',1399,2099,'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700&q=85','Travel pick','#d2dcd4',4.7,102]
  ,['37','Layered charm necklace','Lustre','Accessories',699,999,'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=700&q=85','Trending','#e9dcc4',4.5,56]
  ,['38','Unisex retro sunglasses','Lustre','Accessories',799,1199,'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=700&q=85','Summer ready','#d9d4cd',4.4,63]
  ,['39','Baby organic cotton romper','Tiny Tribe','Kids',599,899,'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=700&q=85','Soft essentials','#e4ded1',4.8,47]
  ,['40','Kids printed rain jacket','Tiny Tribe','Kids',1099,1599,'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=700&q=85','Weather ready','#d5e2e8',4.6,31]
].map(([id,name,brand,category,price,mrp,image,tag,color,rating,reviews]) => ({ id, name, brand, category, price, mrp, image, tag, color, rating, reviews, description: 'A considered everyday piece designed to move with you. Made in small batches with comfort and character in mind.' }))

const demoUsers = new Map()
const carts = new Map()
let pool = null
async function setupDatabase() {
  if (!process.env.DB_HOST) return console.log('ℹ MySQL not configured — using demo persistence')
  try {
    pool = await mysql.createPool({ host: process.env.DB_HOST, port: process.env.DB_PORT || 3306, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME, waitForConnections: true, connectionLimit: 5 })
    await pool.query('CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(120), email VARCHAR(190) UNIQUE, password VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)')
    await pool.query('CREATE TABLE IF NOT EXISTS cart_items (user_id VARCHAR(100), product_id VARCHAR(50), qty INT NOT NULL, PRIMARY KEY (user_id, product_id))')
    await pool.query('CREATE TABLE IF NOT EXISTS orders (id BIGINT AUTO_INCREMENT PRIMARY KEY, user_id VARCHAR(100) NOT NULL, status ENUM("placed","packed","shipped","delivered","cancelled") NOT NULL DEFAULT "placed", subtotal DECIMAL(10,2) NOT NULL, discount DECIMAL(10,2) NOT NULL DEFAULT 0, delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0, total DECIMAL(10,2) NOT NULL, customer_name VARCHAR(120) NOT NULL, phone VARCHAR(30) NOT NULL, address VARCHAR(255) NOT NULL, city VARCHAR(100) NOT NULL, pincode VARCHAR(20) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, INDEX idx_orders_user_id (user_id))')
    await pool.query('CREATE TABLE IF NOT EXISTS order_items (id BIGINT AUTO_INCREMENT PRIMARY KEY, order_id BIGINT NOT NULL, product_id VARCHAR(50) NOT NULL, product_name VARCHAR(180) NOT NULL, brand VARCHAR(120) NOT NULL, unit_price DECIMAL(10,2) NOT NULL, qty INT NOT NULL, FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE, INDEX idx_order_items_order_id (order_id))')
    console.log('✓ MySQL connected — users, cart, orders and order items are ready')
  } catch (error) { pool = null; console.log(`ℹ MySQL unavailable (${error.code || 'connection error'}) — using demo persistence`) }
}
const auth = (req, res, next) => { try { const token = req.headers.authorization?.replace('Bearer ', ''); req.user = token ? jwt.verify(token, JWT_SECRET) : null; if (!req.user) return res.status(401).json({ message: 'Please log in to continue' }); next() } catch { res.status(401).json({ message: 'Session expired. Please log in again.' }) } }
const publicUser = user => ({ id: user.id, name: user.name, email: user.email })

app.get('/api/health', (_, res) => res.json({ ok: true, database: Boolean(pool) }))
app.get('/api/products', (req, res) => {
  const { category, search, sort } = req.query
  let result = products.filter(p => (!category || category === 'All' || p.category.toLowerCase() === category.toLowerCase()) && (!search || `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(search.toLowerCase())))
  if (sort === 'price-low') result.sort((a,b) => a.price-b.price)
  if (sort === 'price-high') result.sort((a,b) => b.price-a.price)
  if (sort === 'rating') result.sort((a,b) => b.rating-a.rating)
  res.json({ products: result })
})
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password || password.length < 6) return res.status(400).json({ message: 'Name, email and a 6+ character password are required' })
  const normalized = email.toLowerCase().trim()
  try {
    let user
    if (pool) {
      const [exists] = await pool.query('SELECT id FROM users WHERE email=?', [normalized]); if (exists.length) return res.status(409).json({ message: 'An account with this email already exists' })
      const [result] = await pool.query('INSERT INTO users (name,email,password) VALUES (?,?,?)', [name.trim(), normalized, await bcrypt.hash(password, 10)]); user = { id: result.insertId, name: name.trim(), email: normalized }
    } else { if (demoUsers.has(normalized)) return res.status(409).json({ message: 'An account with this email already exists' }); user = { id: `demo_${Date.now()}`, name: name.trim(), email: normalized, password: await bcrypt.hash(password, 10) }; demoUsers.set(normalized, user) }
    res.status(201).json({ user: publicUser(user), token: jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' }) })
  } catch (error) { res.status(500).json({ message: 'Could not create account' }) }
})
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body; const normalized = email?.toLowerCase().trim()
  try {
    let user
    if (pool) { const [rows] = await pool.query('SELECT * FROM users WHERE email=?', [normalized]); user = rows[0] } else user = demoUsers.get(normalized)
    if (!user || !(await bcrypt.compare(password || '', user.password))) return res.status(401).json({ message: 'Email or password is incorrect' })
    res.json({ user: publicUser(user), token: jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' }) })
  } catch { res.status(500).json({ message: 'Could not sign in' }) }
})
const cartItems = key => (carts.get(key) || []).map(item => ({ ...item }))
app.get('/api/cart', auth, async (req, res) => {
  const key = String(req.user.id)
  if (pool) {
    const [rows] = await pool.query('SELECT product_id AS id, qty FROM cart_items WHERE user_id=?', [key])
    return res.json({ items: rows.map(row => ({ ...products.find(product => product.id === row.id), qty: row.qty })).filter(item => item.id) })
  }
  res.json({ items: cartItems(key) })
})
app.post('/api/cart', auth, async (req, res) => {
  const item = { ...req.body, qty: Math.max(1, Number(req.body.qty) || 1) }; const key = String(req.user.id)
  if (pool) {
    await pool.query('INSERT INTO cart_items (user_id, product_id, qty) VALUES (?,?,?) ON DUPLICATE KEY UPDATE qty=qty+VALUES(qty)', [key, item.id, item.qty])
    const [rows] = await pool.query('SELECT product_id AS id, qty FROM cart_items WHERE user_id=?', [key])
    return res.status(201).json({ items: rows.map(row => ({ ...products.find(product => product.id === row.id), qty: row.qty })).filter(value => value.id) })
  }
  const items = carts.get(key) || []; const found = items.find(i => i.id === item.id); carts.set(key, found ? items.map(i => i.id === item.id ? {...i, qty: i.qty + item.qty} : i) : [...items, item]); res.status(201).json({ items: cartItems(key) })
})
app.patch('/api/cart/:id', auth, async (req, res) => {
  const key = String(req.user.id); const qty = Number(req.body.qty)
  if (pool) {
    if (qty > 0) await pool.query('UPDATE cart_items SET qty=? WHERE user_id=? AND product_id=?', [qty, key, req.params.id])
    else await pool.query('DELETE FROM cart_items WHERE user_id=? AND product_id=?', [key, req.params.id])
    const [rows] = await pool.query('SELECT product_id AS id, qty FROM cart_items WHERE user_id=?', [key])
    return res.json({ items: rows.map(row => ({ ...products.find(product => product.id === row.id), qty: row.qty })).filter(value => value.id) })
  }
  const items = (carts.get(key) || []).map(i => i.id === req.params.id ? {...i, qty} : i).filter(i => i.qty > 0); carts.set(key, items); res.json({ items: cartItems(key) })
})
app.delete('/api/cart/:id', auth, async (req, res) => {
  const key = String(req.user.id)
  if (pool) {
    await pool.query('DELETE FROM cart_items WHERE user_id=? AND product_id=?', [key, req.params.id])
    const [rows] = await pool.query('SELECT product_id AS id, qty FROM cart_items WHERE user_id=?', [key])
    return res.json({ items: rows.map(row => ({ ...products.find(product => product.id === row.id), qty: row.qty })).filter(value => value.id) })
  }
  const items = (carts.get(key) || []).filter(i => i.id !== req.params.id); carts.set(key, items); res.json({ items: cartItems(key) })
})
app.get('/api/orders', auth, async (req, res) => {
  if (!pool) return res.json({ orders: [] })
  const [orders] = await pool.query('SELECT id, status, subtotal, discount, delivery_fee AS deliveryFee, total, customer_name AS customerName, created_at AS createdAt FROM orders WHERE user_id=? ORDER BY created_at DESC', [String(req.user.id)])
  const result = []
  for (const order of orders) {
    const [items] = await pool.query('SELECT product_id AS productId, product_name AS name, brand, unit_price AS unitPrice, qty FROM order_items WHERE order_id=?', [order.id])
    result.push({ ...order, items })
  }
  res.json({ orders: result })
})
app.post('/api/orders', auth, async (req, res) => {
  if (!pool) return res.status(503).json({ message: 'Order persistence requires MySQL' })
  const { customerName, phone, address, city, pincode, discount = 0, deliveryFee = 0 } = req.body
  if (!customerName || !phone || !address || !city || !pincode) return res.status(400).json({ message: 'Complete delivery details are required' })
  const key = String(req.user.id)
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()
    const [cartRows] = await connection.query('SELECT product_id AS id, qty FROM cart_items WHERE user_id=? FOR UPDATE', [key])
    const items = cartRows.map(row => ({ ...products.find(product => product.id === row.id), qty: row.qty })).filter(item => item.id)
    if (!items.length) { await connection.rollback(); return res.status(400).json({ message: 'Your cart is empty' }) }
    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)
    const safeDiscount = Math.min(Math.max(0, Number(discount) || 0), subtotal)
    const safeDelivery = Math.max(0, Number(deliveryFee) || 0)
    const total = subtotal - safeDiscount + safeDelivery
    const [orderResult] = await connection.query('INSERT INTO orders (user_id, subtotal, discount, delivery_fee, total, customer_name, phone, address, city, pincode) VALUES (?,?,?,?,?,?,?,?,?,?)', [key, subtotal, safeDiscount, safeDelivery, total, customerName.trim(), phone.trim(), address.trim(), city.trim(), pincode.trim()])
    for (const item of items) await connection.query('INSERT INTO order_items (order_id, product_id, product_name, brand, unit_price, qty) VALUES (?,?,?,?,?,?)', [orderResult.insertId, item.id, item.name, item.brand, item.price, item.qty])
    await connection.query('DELETE FROM cart_items WHERE user_id=?', [key])
    await connection.commit()
    res.status(201).json({ orderId: orderResult.insertId, total, status: 'placed' })
  } catch (error) {
    await connection.rollback()
    res.status(500).json({ message: 'Could not place order' })
  } finally { connection.release() }
})
app.post('/api/coupons/validate', (req, res) => { const code = String(req.body.code || '').toUpperCase(); const subtotal = Number(req.body.subtotal) || 0; const coupons = { STYLE10: { discount: Math.min(Math.round(subtotal * .1), 500), message: '10% off applied — nice choice!' }, FIRSTORDER: { discount: Math.min(Math.round(subtotal * .15), 750), message: '15% off applied to your first order!' }, FREESHIP: { discount: subtotal >= 499 ? 99 : 0, message: 'Delivery fee waived!' } }; if (!coupons[code]) return res.status(400).json({ valid: false, message: 'That coupon code is not valid' }); if (!subtotal) return res.status(400).json({ valid: false, message: 'Add an item before applying a coupon' }); res.json({ valid: true, ...coupons[code] }) })

const __dirname = path.dirname(fileURLToPath(import.meta.url))
if (process.env.NODE_ENV === 'production') { app.use(express.static(path.join(__dirname, 'dist'))); app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html'))) }
setupDatabase().finally(() => app.listen(PORT, '0.0.0.0', () => console.log(`Myntraa API running at http://localhost:${PORT}`)))
