import { Heart, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useStore } from '../../hooks/useStore'
import { discount, money } from '../../lib/format'
export default function ProductCard({ product }) {
  const { wishlist, toggleWishlist, addToCart } = useStore(); const wished = wishlist.some(item => item.id === product.id)
  return <article className="product-card"><div className="product-image" style={{ background: product.color || '#eee' }}><Link to={`/products/${product.id}`}><img src={product.image} alt={product.name} loading="lazy"/></Link><button aria-label="Toggle wishlist" className={`heart-btn ${wished ? 'wished' : ''}`} onClick={() => toggleWishlist(product)}>{wished ? '♥' : <Heart size={17}/>}</button>{product.tag && <span className="product-tag">{product.tag}</span>}</div><div className="product-info"><Link to={`/products/${product.id}`}><p className="product-brand">{product.brand}</p><h3>{product.name}</h3></Link><div className="price-row"><strong>{money(product.price)}</strong><del>{money(product.mrp)}</del><span className="discount">{discount(product.price, product.mrp)}</span></div><button className="quick-add" onClick={() => addToCart(product)}>Add to bag</button><small className="rating"><Star size={12} fill="currentColor"/> {product.rating} ({product.reviews})</small></div></article>
}
