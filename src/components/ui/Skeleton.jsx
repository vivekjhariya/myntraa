export function Skeleton({ className = '' }) {
  return <span className={`skeleton ${className}`} aria-hidden="true" />
}

export function ProductCardSkeleton() {
  return <article className="product-card skeleton-card">
    <Skeleton className="skeleton-product-image" />
    <div className="skeleton-product-copy">
      <Skeleton className="skeleton-brand" />
      <Skeleton className="skeleton-title" />
      <Skeleton className="skeleton-price" />
    </div>
  </article>
}

export function ProductGridSkeleton({ count = 4 }) {
  return <div className="container product-grid" aria-label="Loading products">
    {Array.from({ length: count }, (_, index) => <ProductCardSkeleton key={index} />)}
  </div>
}

export function ProductDetailSkeleton() {
  return <section className="product-page container skeleton-detail" aria-label="Loading product">
    <Skeleton className="skeleton-back" />
    <div className="product-detail">
      <Skeleton className="skeleton-detail-image" />
      <div className="skeleton-detail-copy">
        <Skeleton className="skeleton-brand" />
        <Skeleton className="skeleton-detail-title" />
        <Skeleton className="skeleton-rating" />
        <Skeleton className="skeleton-detail-price" />
        <Skeleton className="skeleton-description" />
        <Skeleton className="skeleton-description short" />
        <Skeleton className="skeleton-button" />
      </div>
    </div>
  </section>
}
