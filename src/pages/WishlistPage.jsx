import EmptyState from '../components/ui/EmptyState'
import ProductCard from '../components/ui/ProductCard'
import { useStore } from '../hooks/useStore'
export default function WishlistPage() { const { wishlist } = useStore(); return <section className="catalog page-section"><div className="container page-title"><div><span className="eyebrow">YOUR EDIT</span><h1>Wishlist <small>{wishlist.length} saved</small></h1></div></div>{wishlist.length ? <div className="container product-grid">{wishlist.map(product => <ProductCard key={product.id} product={product}/>)}</div> : <div className="container"><EmptyState title="Your wishlist is empty" text="Save pieces you love and find them here anytime." action="Discover styles"/></div>}</section> }
