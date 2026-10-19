"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "./cart-provider";
import { ProductPlaceholder } from "./product-placeholder";
import type { Product } from "../data/products";
import { formatPrice } from "@/app/lib/format";

type CatalogProps = {
  products: Product[];
};

export function Catalog({ products }: CatalogProps) {
  const { cart, cartCount, addToCart: addCartLine, updateQuantity } = useCart();
  const filters = ["All creations", ...new Set(products.map((product) => product.category))];
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const [cartOpen, setCartOpen] = useState(false);
  const visibleProducts =
    activeFilter === "All creations"
      ? products
      : products.filter((product) => product.category === activeFilter);
  const cartItems = cart.flatMap((line) => {
    const product = products.find((item) => item.id === line.productId);

    return product ? [{ ...line, product }] : [];
  });
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const addToCart = (productId: string) => {
    const product = products.find((item) => item.id === productId);

    if (product?.availability === "Sold out") {
      return;
    }

    addCartLine(productId);
    setCartOpen(true);
  };

  return (
    <section id="catalog" className="catalog-section mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
      <div className="catalogue-notice max-w-2xl font-sans text-sm leading-6 text-[var(--muted)]">
        Original studio photography is coming soon. These designed placeholders are not product photographs; prices and availability are current.
      </div>

      <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.24em] text-[var(--rose)]">
            The catalogue
          </p>
          <h2 className="mt-4 text-4xl tracking-[-0.035em] text-[var(--ink)] sm:text-5xl">
            Handmade favourites, ready to make your own.
          </h2>
          <p className="mt-5 font-sans text-base leading-7 text-[var(--muted)]">
            Add a creation to your basket, then complete payment securely through Razorpay.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="border-b border-[var(--ink)] pb-1 font-sans text-sm font-semibold text-[var(--ink)] transition hover:border-[var(--rose)] hover:text-[var(--rose)]"
        >
          Basket ({cartCount})
        </button>
      </div>

      <div className="mt-8 -mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0">
        {filters.map((filter) => {
          const isActive = filter === activeFilter;

          return (
            <button
              key={filter}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActiveFilter(filter)}
              className={`shrink-0 border-b px-1 py-2 font-sans text-sm font-semibold transition ${
                isActive
                  ? "border-[var(--ink)] text-[var(--ink)]"
                  : "border-transparent text-[var(--muted)] hover:border-[var(--sage)] hover:text-[var(--ink)]"
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visibleProducts.map((product) => (
          <article
            key={product.id}
            className="product-card overflow-hidden bg-transparent pt-5"
          >
            <ProductPlaceholder
              name={product.name}
              category={product.category}
              className="aspect-[4/5]"
            />
            <div className="pb-2 pt-5">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-[var(--sage)]">
                {product.category}
              </p>
              <h3 className="mt-2 text-2xl leading-tight text-[var(--ink)]">{product.name}</h3>
              <p className="mt-3 font-sans text-sm leading-6 text-[var(--muted)]">
                {product.description}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                <div>
                  <p className="font-sans text-lg font-semibold text-[var(--ink)]">
                    {formatPrice(product.price)}
                  </p>
                  <span className="font-sans text-xs font-semibold text-[var(--rose)]">
                    {product.availability}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => addToCart(product.id)}
                  disabled={product.availability === "Sold out"}
                  className="border-b border-[var(--rose)] pb-1 font-sans text-sm font-semibold text-[var(--rose)] transition hover:text-[#95495b] disabled:cursor-not-allowed disabled:border-[var(--muted)] disabled:text-[var(--muted)]"
                >
                  {product.availability === "Sold out" ? "Sold out" : "Add"}
                </button>
                <Link
                  href={`/shop/${product.id}`}
                  className="border-b border-[var(--ink)] pb-1 font-sans text-sm font-semibold text-[var(--ink)] transition hover:border-[var(--sage)] hover:text-[var(--sage)]"
                >
                  View listing
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {cartOpen ? (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Shopping basket">
          <button
            type="button"
            aria-label="Close basket"
            onClick={() => {
              setCartOpen(false);
            }}
            className="absolute inset-0 bg-[rgba(51,39,34,0.35)] backdrop-blur-sm"
          />
          <aside className="relative flex h-full min-h-0 w-full max-w-md flex-col overflow-hidden bg-[var(--paper)] shadow-2xl">
            <div className="shrink-0 flex items-center justify-between border-b border-[var(--border)] px-6 py-5">
              <div>
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[var(--rose)]">
                  Your basket
                </p>
                <p className="mt-1 text-2xl text-[var(--ink)]">
                  {cartCount} item{cartCount === 1 ? "" : "s"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCartOpen(false);
                }}
                className="grid size-10 place-items-center rounded-full border border-[var(--border)] font-sans text-lg text-[var(--ink)] transition hover:bg-white"
                aria-label="Close basket"
              >
                ×
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="grid min-h-0 flex-1 place-items-center px-8 text-center">
                <div>
                  <p className="text-3xl text-[var(--ink)]">Your basket is waiting.</p>
                  <p className="mt-3 font-sans text-sm leading-6 text-[var(--muted)]">
                    Add a handmade favourite, then complete your secure checkout.
                  </p>
                </div>
              </div>
            ) : (
              <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
                <div className="space-y-5">
                  {cartItems.map((item) => (
                    <article key={item.productId} className="flex gap-4">
                      <ProductPlaceholder
                        name={item.product.name}
                        category={item.product.category}
                        compact
                        className="size-20 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-lg leading-tight text-[var(--ink)]">{item.product.name}</p>
                        <p className="mt-1 font-sans text-sm font-semibold text-[var(--rose)]">
                          {formatPrice(item.product.price)}
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-[var(--border)] bg-white">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="grid size-8 place-items-center font-sans text-lg text-[var(--ink)]"
                              aria-label={`Remove one ${item.product.name}`}
                            >
                              −
                            </button>
                            <span className="grid min-w-8 place-items-center font-sans text-sm font-semibold text-[var(--ink)]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="grid size-8 place-items-center font-sans text-lg text-[var(--ink)]"
                              aria-label={`Add one ${item.product.name}`}
                            >
                              +
                            </button>
                          </div>
                          <p className="font-sans text-sm font-semibold text-[var(--ink)]">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            <div className="shrink-0 border-t border-[var(--border)] bg-white/60 px-6 py-5">
              <div className="flex items-center justify-between font-sans text-sm text-[var(--muted)]">
                <span>Subtotal</span>
                <span className="text-lg font-semibold text-[var(--ink)]">{formatPrice(cartTotal)}</span>
              </div>
              {cartItems.length > 0 ? (
                <Link
                  href="/checkout"
                  className="mt-5 inline-flex w-full justify-center rounded-full bg-[var(--ink)] px-5 py-3 font-sans text-sm font-semibold text-white transition hover:bg-[var(--rose)]"
                >
                  Continue to Checkout
                </Link>
              ) : null}
              {cartItems.length === 0 ? (
                <button
                  type="button"
                  disabled
                  className="mt-5 w-full rounded-full bg-[#ded3c9] px-5 py-3 font-sans text-sm font-semibold text-[#8b7b70]"
                >
                  Add an item to continue
                </button>
              ) : null}
            </div>
          </aside>
        </div>
      ) : null}
    </section>
  );
}
