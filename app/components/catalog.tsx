"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "./cart-provider";
import { MAX_PER_PIECE } from "@/app/lib/cart-limits";
import { ProductPlaceholder } from "./product-placeholder";
import type { Product } from "../data/products";
import { formatPrice } from "@/app/lib/format";

type CatalogProps = {
  products: Product[];
  initialCategory?: string;
};

const ALL = "Everything";

const sorts = {
  featured: "Featured",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  name: "Name: A to Z",
} as const;

type SortKey = keyof typeof sorts;

const fieldClass = "min-h-11 w-full bg-[var(--blush)] px-4 text-[var(--ink)] placeholder:text-[var(--muted)]";

export function Catalog({ products, initialCategory }: CatalogProps) {
  const { cart, cartCount, addToCart: addCartLine, updateQuantity } = useCart();
  const filters = [ALL, ...new Set(products.map((product) => product.category))];
  const [activeFilter, setActiveFilter] = useState(
    initialCategory && filters.includes(initialCategory) ? initialCategory : ALL,
  );
  const [cartOpen, setCartOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");
  const [availableOnly, setAvailableOnly] = useState(false);
  const needle = query.trim().toLowerCase();
  const visibleProducts = products
    .filter((product) => activeFilter === ALL || product.category === activeFilter)
    .filter((product) => !availableOnly || product.availability !== "Sold out")
    .filter((product) => !needle || `${product.name} ${product.category}`.toLowerCase().includes(needle))
    .sort((a, b) =>
      sort === "price-asc" ? a.price - b.price : sort === "price-desc" ? b.price - a.price : sort === "name" ? a.name.localeCompare(b.name) : 0,
    );
  const isFiltered = activeFilter !== ALL || availableOnly || needle !== "";
  const clearFilters = () => {
    setActiveFilter(ALL);
    setAvailableOnly(false);
    setQuery("");
  };
  const cartItems = cart.flatMap((line) => {
    const product = products.find((item) => item.id === line.productId);

    return product ? [{ ...line, product }] : [];
  });
  const cartTotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const addToCart = (productId: string) => {
    const product = products.find((item) => item.id === productId);

    if (product?.availability === "Sold out") {
      return;
    }

    addCartLine(productId);
    setCartOpen(true);
  };

  return (
    <section id="catalog" className="scroll-mt-24 px-5 pt-24 sm:px-8" aria-labelledby="catalog-heading">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 id="catalog-heading" data-reveal className="text-[length:var(--step-head)]">
          {activeFilter === ALL ? `All ${products.length} pieces` : activeFilter}
        </h2>
        <button type="button" onClick={() => setCartOpen(true)} className="btn btn-quiet">
          Basket ({cartCount})
        </button>
      </div>

      <div className="mt-8 flex flex-wrap gap-x-6 gap-y-1" role="group" aria-label="Filter by collection">
        {filters.map((filter) => {
          const isActive = filter === activeFilter;

          return (
            <button
              key={filter}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActiveFilter(filter)}
              className="sweep-link min-h-11"
            >
              {filter}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto_auto] sm:items-end">
        <label className="block text-[length:var(--step-small)]">
          <span className="mb-1 block text-[var(--muted)]">Search</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try “lamp”, “garland” or “keychain”"
            className={fieldClass}
          />
        </label>
        <label className="block text-[length:var(--step-small)]">
          <span className="mb-1 block text-[var(--muted)]">Sort by</span>
          <select value={sort} onChange={(event) => setSort(event.target.value as SortKey)} className={`${fieldClass} sm:w-auto`}>
            {Object.entries(sorts).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-h-11 items-center gap-2 text-[length:var(--step-small)]">
          <input type="checkbox" checked={availableOnly} onChange={(event) => setAvailableOnly(event.target.checked)} className="size-5 accent-[var(--rose-deep)]" />
          Hide sold out
        </label>
      </div>

      <p className="mt-6 text-[length:var(--step-small)] text-[var(--muted)]" role="status" aria-live="polite">
        Showing {visibleProducts.length} of {products.length} pieces
        {isFiltered ? (
          <>
            {" · "}
            <button type="button" onClick={clearFilters} className="text-link">
              Clear filters
            </button>
          </>
        ) : null}
      </p>

      {visibleProducts.length === 0 ? (
        <div className="mt-12 max-w-[44ch]">
          <p className="text-[length:var(--step-lead)] leading-snug">Nothing matches that yet.</p>
          <p className="mt-3 text-[var(--muted)]">
            Try a different word, or <Link href="/contact" className="text-link">ask the studio</Link>. Custom colours and sizes are possible.
          </p>
        </div>
      ) : null}

      <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 sm:gap-y-16 lg:grid-cols-3 xl:grid-cols-4">
        {visibleProducts.map((product, index) => (
          <article key={product.id} className="product-card" data-reveal style={{ "--i": index % 4 } as React.CSSProperties}>
            <Link href={`/shop/${product.id}`} aria-label={product.name}>
              <ProductPlaceholder name={product.name} category={product.category} className="aspect-[4/5]" />
            </Link>
            <p className="mt-4 text-[length:var(--step-small)] text-[var(--sage-deep)]">{product.category}</p>
            <h3 className="mt-1 text-[length:var(--step-lead)]">
              <Link href={`/shop/${product.id}`} className="transition-colors hover:text-[var(--rose-deep)]">
                {product.name}
              </Link>
            </h3>
            <p className="mt-2">
              {formatPrice(product.price)}{" "}
              <span className={product.availability === "Sold out" ? "text-[var(--rose-deep)]" : "text-[var(--muted)]"}>· {product.availability}</span>
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
              <button
                type="button"
                onClick={() => addToCart(product.id)}
                disabled={product.availability === "Sold out"}
                className="btn min-h-11 px-4 py-2"
              >
                {product.availability === "Sold out" ? "Sold out" : "Add to basket"}
              </button>
              <Link href={`/shop/${product.id}`} className="text-link">
                Details
              </Link>
            </div>
          </article>
        ))}
      </div>

      {cartOpen ? (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Shopping basket">
          <button type="button" aria-label="Close basket" onClick={() => setCartOpen(false)} className="absolute inset-0 bg-[rgba(90,62,43,0.4)]" />
          <aside className="relative flex h-full min-h-0 w-full max-w-md flex-col overflow-hidden bg-[var(--cream)] shadow-[var(--shadow-soft)]">
            <div className="flex shrink-0 items-center justify-between px-6 py-5">
              <h2 className="text-[length:var(--step-head)]">Your basket</h2>
              <button type="button" onClick={() => setCartOpen(false)} className="btn btn-quiet min-h-11 px-4 py-2">
                Close
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="grid min-h-0 flex-1 place-items-center px-8 text-center">
                <p className="text-[length:var(--step-lead)]">Your basket is empty. Add a piece to begin.</p>
              </div>
            ) : (
              <div className="min-h-0 flex-1 overflow-y-auto px-6 py-2">
                <div className="space-y-5">
                  {cartItems.map((item) => (
                    <article key={item.productId} className="flex gap-4">
                      <ProductPlaceholder name={item.product.name} category={item.product.category} compact className="size-20 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="leading-tight">{item.product.name}</p>
                        <p className="mt-1 text-[var(--muted)]">{formatPrice(item.product.price)}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center bg-[var(--blush)]">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="grid size-11 place-items-center text-lg"
                              aria-label={`Remove one ${item.product.name}`}
                            >
                              −
                            </button>
                            <span className="grid min-w-8 place-items-center tabular-nums">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              disabled={item.quantity >= MAX_PER_PIECE}
                              className="grid size-11 place-items-center disabled:opacity-40 text-lg"
                              aria-label={`Add one ${item.product.name}`}
                            >
                              +
                            </button>
                          </div>
                          <p className="tabular-nums">{formatPrice(item.product.price * item.quantity)}</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            <div className="shrink-0 bg-[var(--blush)] px-6 py-5">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="text-[length:var(--step-lead)] tabular-nums">{formatPrice(cartTotal)}</span>
              </div>
              {cartItems.length > 0 ? (
                <Link href="/checkout" className="btn mt-5 w-full">
                  Continue to checkout
                </Link>
              ) : (
                <button type="button" disabled className="btn mt-5 w-full">
                  Add a piece to continue
                </button>
              )}
            </div>
          </aside>
        </div>
      ) : null}
    </section>
  );
}
