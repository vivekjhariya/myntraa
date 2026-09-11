import { SlidersHorizontal } from 'lucide-react'
export default function FilterBar({ category, sort, setSort, count }) {
  return <div className="filter-row container"><div><span className="eyebrow">CURATED FOR YOU</span><h2>{category === 'All' ? 'Trending now' : category}</h2><small>{count} styles</small></div><label className="select-wrap"><SlidersHorizontal size={16}/><select value={sort} onChange={e => setSort(e.target.value)}><option value="featured">Sort: Featured</option><option value="price-low">Price: Low to high</option><option value="price-high">Price: High to low</option><option value="rating">Top rated</option></select></label></div>
}
