import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { request } from '../services/api'

const StoreContext = createContext(null)
const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) || fallback } catch { return fallback } }

export function StoreProvider({ children }) {
  const [user, setUser] = useState(() => read('myntraa_user', null))
  const [cart, setCart] = useState(() => read('myntraa_cart', []))
  const [wishlist, setWishlist] = useState(() => read('myntraa_wishlist', []))
  const [theme, setTheme] = useState(() => localStorage.getItem('myntraa_theme') || 'light')
  useEffect(() => { localStorage.setItem('myntraa_cart', JSON.stringify(cart)) }, [cart])
  useEffect(() => { localStorage.setItem('myntraa_wishlist', JSON.stringify(wishlist)) }, [wishlist])
  useEffect(() => { document.body.dataset.theme = theme; localStorage.setItem('myntraa_theme', theme) }, [theme])
  const addToCart = product => {
    setCart(items => { const found = items.find(item => item.id === product.id); return found ? items.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item) : [...items, { ...product, qty: 1 }] })
    if (localStorage.getItem('myntraa_token')) request('/cart', { method: 'POST', body: JSON.stringify({ ...product, qty: 1 }) }).catch(() => {})
  }
  const updateQty = (id, qty) => setCart(items => items.map(item => item.id === id ? { ...item, qty } : item).filter(item => item.qty > 0))
  const toggleWishlist = product => setWishlist(items => items.some(item => item.id === product.id) ? items.filter(item => item.id !== product.id) : [...items, product])
  const value = useMemo(() => ({ user, setUser, cart, wishlist, toggleWishlist, addToCart, updateQty, theme, setTheme, cartCount: cart.reduce((sum, item) => sum + item.qty, 0), logout: () => { localStorage.removeItem('myntraa_token'); localStorage.removeItem('myntraa_user'); setUser(null) } }), [user, cart, wishlist, theme])
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
export const useStore = () => useContext(StoreContext)
