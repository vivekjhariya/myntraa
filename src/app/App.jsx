import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { StoreProvider } from '../hooks/useStore'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Home from '../pages/Home'
import CatalogPage from '../pages/CatalogPage'
import ProductPage from '../pages/ProductPage'
import CartPage from '../pages/CartPage'
import WishlistPage from '../pages/WishlistPage'
import AccountPage from '../pages/AccountPage'
import AuthPage from '../pages/AuthPage'
import CheckoutPage from '../pages/CheckoutPage'

export default function App() {
  return <BrowserRouter><StoreProvider><Header /><main>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<CatalogPage />} />
      <Route path="/products/:id" element={<ProductPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/account" element={<AccountPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="*" element={<Home />} />
    </Routes>
  </main><Footer /></StoreProvider></BrowserRouter>
}
