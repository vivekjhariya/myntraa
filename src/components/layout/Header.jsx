import { Heart, Moon, Search, ShoppingBag, Sun, UserRound } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useStore } from '../../hooks/useStore'

const nav = [['Women', 'Women'], ['Men', 'Men'], ['Boys', 'Boys'], ['Girls', 'Girls'], ['Kids', 'Kids'], ['Accessories', 'Accessories'], ['Beauty', 'Beauty'], ['Home', 'Home']]
export default function Header() {
  const { cartCount, theme, setTheme } = useStore(); const navigate = useNavigate()
  return <header className="site-header"><div className="container nav-row">
    <Link className="logo" to="/"><span className="logo-mark">m</span>myntraa</Link>
    <nav className="desktop-nav">{nav.map(([label, value]) => <NavLink key={value} to={`/products?category=${value}`}>{label}</NavLink>)}</nav>
    <form className="searchbox" onSubmit={e => { e.preventDefault(); navigate(`/products?search=${encodeURIComponent(e.currentTarget.search.value)}`) }}><Search size={17}/><input name="search" aria-label="Search products" placeholder="Search styles, brands & more" /></form>
    <div className="nav-actions"><button className="icon-btn" onClick={() => navigate('/account')}><UserRound size={19}/><span>Profile</span></button><button className="icon-btn" onClick={() => navigate('/wishlist')}><Heart size={19}/><span>Wishlist</span></button><button className="icon-btn" onClick={() => navigate('/cart')}><ShoppingBag size={19}/><span>Bag</span>{cartCount > 0 && <b className="badge">{cartCount}</b>}</button><button className="theme-toggle" aria-label="Toggle theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? <Sun size={18}/> : <Moon size={18}/>}</button></div>
  </div><div className="mobile-cats container">{nav.map(([label, value]) => <Link key={value} to={`/products?category=${value}`}>{label}</Link>)}</div></header>
}
