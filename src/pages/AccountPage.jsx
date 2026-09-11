import { ArrowRight, LogOut, Package, UserRound } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../hooks/useStore'
import { request } from '../services/api'
import { useEffect, useState } from 'react'
import { money } from '../lib/format'
export default function AccountPage() {
  const { user, logout } = useStore(); const navigate = useNavigate(); const [orders, setOrders] = useState([])
  useEffect(() => { if (user) request('/orders').then(data => setOrders(data.orders || [])).catch(() => {}) }, [user])
  if (!user) return <section className="auth-page"><div className="auth-card"><div className="auth-brand"><span className="logo-mark">m</span><h1>Your style universe awaits</h1><p>Sign in to view orders, save your favourites and check out faster.</p></div><Link className="primary-btn full-width" to="/auth">Log in or sign up <ArrowRight size={16}/></Link></div></section>
  return <section className="page-section container account-page"><div className="account-hero"><div className="avatar"><UserRound size={28}/></div><div><span className="eyebrow">WELCOME BACK</span><h1>{user.name}</h1><p>{user.email}</p></div></div><div className="account-grid"><Link to="/checkout" className="account-card"><Package size={22}/><div><b>Orders & returns</b><p>Track your recent purchases</p></div><ArrowRight size={17}/></Link><Link to="/wishlist" className="account-card"><span className="account-symbol">♡</span><div><b>Saved styles</b><p>Pieces you want to remember</p></div><ArrowRight size={17}/></Link><button className="account-card" onClick={() => { logout(); navigate('/') }}><LogOut size={22}/><div><b>Sign out</b><p>We'll see you soon</p></div></button></div><section className="order-history"><div className="section-heading"><div><span className="eyebrow">YOUR PURCHASES</span><h2>Order history</h2></div></div>{orders.length ? orders.map(order => <article className="order-card" key={order.id}><div><b>Order #{order.id}</b><small>{new Date(order.createdAt).toLocaleDateString()}</small></div><span className="order-status">{order.status}</span><strong>{money(order.total)}</strong></article>) : <p className="muted-copy">Your completed orders will appear here after checkout.</p>}</section></section>
}
