import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import FilterBar from '../components/ui/FilterBar'
import ProductCard from '../components/ui/ProductCard'
import EmptyState from '../components/ui/EmptyState'
import { getProducts } from '../services/api'
import { ProductGridSkeleton } from '../components/ui/Skeleton'
export default function CatalogPage() {
  const [params] = useSearchParams(); const [products, setProducts] = useState([]); const [loading, setLoading] = useState(true); const [sort, setSort] = useState('featured'); const category = params.get('category') || 'All'; const search = params.get('search') || ''
  useEffect(() => { setLoading(true); getProducts({ category: category === 'All' ? '' : category, search }).then(data => setProducts(data.products || [])).catch(() => {}).finally(() => setLoading(false)) }, [category, search])
  const sorted = useMemo(() => [...products].sort((a, b) => sort === 'price-low' ? a.price - b.price : sort === 'price-high' ? b.price - a.price : sort === 'rating' ? b.rating - a.rating : 0), [products, sort])
  return <section className="catalog page-section"><FilterBar category={search ? `Search: ${search}` : category} sort={sort} setSort={setSort} count={sorted.length}/>{loading ? <ProductGridSkeleton count={8}/> : <div className="container product-grid">{sorted.length ? sorted.map(product => <ProductCard key={product.id} product={product}/>) : <EmptyState title="Nothing here yet" text="Try another search or browse our latest edit."/>}</div>}</section>
}
