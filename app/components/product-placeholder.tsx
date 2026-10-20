type ProductPlaceholderProps = {
  name: string;
  category: string;
  compact?: boolean;
  className?: string;
};

export function ProductPlaceholder({
  name,
  category,
  compact = false,
  className = "",
}: ProductPlaceholderProps) {
  return (
    <div
      className={`product-placeholder ${compact ? "product-placeholder-compact" : ""} ${className}`}
      role="img"
      aria-label={`Studio photograph coming soon for ${name}`}
    >
      <div className="product-placeholder-content" aria-hidden="true">
        <p className="product-placeholder-label">Studio photograph</p>
        {!compact ? (
          <div className="product-placeholder-text">
            <p className="product-placeholder-name">{name}</p>
            <p className="product-placeholder-category">{category}</p>
          </div>
        ) : null}
        <p className="product-placeholder-status">Coming soon</p>
      </div>
    </div>
  );
}
