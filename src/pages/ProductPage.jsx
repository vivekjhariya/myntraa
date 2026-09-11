import { ArrowLeft, Heart, ShoppingBag, Star, Zap } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getProducts } from '../services/api'
import { useStore } from '../hooks/useStore'
import { discount, money } from '../lib/format'
import EmptyState from '../components/ui/EmptyState'
import { ProductDetailSkeleton } from '../components/ui/Skeleton'
export default function ProductPage() {
  const { id } = useParams(); const [product, setProduct] = useState(null); const [loading, setLoading] = useState(true); const { addToCart, wishlist, toggleWishlist } = useStore(); const navigate = useNavigate()
  useEffect(() => { setLoading(true); getProducts().then(data => setProduct((data.products || []).find(item => item.id === id))).catch(() => {}).finally(() => setLoading(false)) }, [id])
  if (loading) return <ProductDetailSkeleton />
  if (!product) return <EmptyState title="Product not found" text="This piece may have moved on."/>
  const wished = wishlist.some(item => item.id === product.id)
  return <section className="product-page container"><button className="back-link" onClick={() => navigate(-1)}><ArrowLeft size={15}/> Back to shopping</button><div className="product-detail"><div className="detail-image" style={{ background: product.color }}><img src={product.image} alt={product.name}/></div><div className="detail-copy"><p className="product-brand">{product.brand}</p><h1>{product.name}</h1><p className="rating"><Star size={14} fill="currentColor"/> {product.rating} <span>({product.reviews} reviews)</span></p><div className="detail-price"><strong>{money(product.price)}</strong><del>{money(product.mrp)}</del><b>{discount(product.price, product.mrp)}</b></div><p className="description">{product.description}</p><div className="size-title">Select size <a href="#size-guide">Size guide</a></div><div className="sizes">{['XS', 'S', 'M', 'L', 'XL'].map(size => <button key={size}>{size}</button>)}</div><div className="detail-actions"><button className="primary-btn" onClick={() => { addToCart(product); navigate('/cart') }}><ShoppingBag size={18}/> Add to bag</button><button className={`outline-btn ${wished ? 'wished' : ''}`} onClick={() => toggleWishlist(product)}><Heart size={18} fill={wished ? 'currentColor' : 'none'}/> {wished ? 'Saved' : 'Wishlist'}</button></div><div className="delivery"><Zap size={17}/><span><b>Easy delivery & returns</b><small>Free delivery on orders over ₹799</small></span></div></div></div><Link className="back-link related-link" to="/products">Continue exploring <ArrowLeft size={15}/></Link></section>
}
