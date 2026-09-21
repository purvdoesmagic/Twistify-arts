"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "./cart-provider";
import type { Product } from "../data/products";

type CatalogProps = {
  products: Product[];
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

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
    <section id="catalog" className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
      <div className="rounded-2xl border border-[#efd9a9] bg-[#fff5df] px-4 py-3 font-sans text-sm leading-6 text-[#72573d]">
        Demo catalogue: images and prices are temporary placeholders until Shraddha confirms them.
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
          className="inline-flex w-fit items-center gap-3 rounded-full bg-[var(--ink)] px-5 py-3 font-sans text-sm font-semibold text-white transition hover:bg-[var(--rose)]"
        >
          Basket
          <span className="grid size-6 place-items-center rounded-full bg-white/20 text-xs">
            {cartCount}
          </span>
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
              className={`shrink-0 rounded-full px-4 py-2 font-sans text-sm font-semibold transition ${
                isActive
                  ? "bg-[var(--ink)] text-white"
                  : "border border-[var(--border)] bg-white/70 text-[var(--muted)] hover:border-[var(--sage)] hover:text-[var(--ink)]"
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
            className="overflow-hidden rounded-[1.6rem] border border-[var(--border)] bg-white shadow-[0_12px_26px_rgba(84,51,44,0.06)] transition hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(84,51,44,0.13)]"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-[#f7eee6]">
              <Image
                src={product.image}
                alt={product.imageAlt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
              <span className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 font-sans text-[0.64rem] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                Temporary image
              </span>
            </div>
            <div className="p-5">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-[var(--sage)]">
                {product.category}
              </p>
              <h3 className="mt-2 text-2xl leading-tight text-[var(--ink)]">{product.name}</h3>
              <p className="mt-3 font-sans text-sm leading-6 text-[var(--muted)]">
                {product.description}
              </p>
              <div className="mt-5 flex items-center justify-between gap-2">
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
                  className="rounded-full bg-[var(--rose)] px-4 py-2.5 font-sans text-sm font-semibold text-white transition hover:bg-[#95495b]"
                >
                  {product.availability === "Sold out" ? "Sold out" : "Add"}
                </button>
                <Link
                  href={`/shop/${product.id}`}
                  className="rounded-full border border-[var(--border)] px-4 py-2.5 font-sans text-sm font-semibold text-[var(--ink)] transition hover:border-[var(--sage)]"
                >
                  View
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
                      <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-[#f4e8dd]">
                        <Image src={item.product.image} alt="" fill sizes="80px" className="object-cover" />
                      </div>
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
