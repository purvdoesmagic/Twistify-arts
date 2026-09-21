"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "../data/products";
import { useCart } from "./cart-provider";

type CartPageProps = {
  products: Product[];
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

export function CartPage({ products }: CartPageProps) {
  const { cart, isHydrated, updateQuantity, removeFromCart } = useCart();
  const cartItems = cart.flatMap((line) => {
    const product = products.find((item) => item.id === line.productId);

    return product ? [{ ...line, product }] : [];
  });
  const missingItems = cart.filter(
    (line) => !products.some((product) => product.id === line.productId),
  );
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  if (!isHydrated) {
    return (
      <main className="min-h-screen bg-[var(--paper)] px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <p className="font-sans text-sm text-[var(--muted)]" aria-live="polite">
            Loading your basket...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="section-band min-h-screen bg-[var(--paper)] px-5 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <Link href="/shop" className="font-sans text-sm font-semibold text-[var(--rose)]">
          ← Continue shopping
        </Link>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rose)]">
              Your basket
            </p>
            <h1 className="mt-3 text-5xl tracking-[-0.04em] text-[var(--ink)]">Cart</h1>
          </div>
          <p className="font-sans text-sm text-[var(--muted)]">
            {itemCount} item{itemCount === 1 ? "" : "s"}
          </p>
        </div>

        {missingItems.length > 0 ? (
          <section className="mt-8 rounded-2xl border border-[#efd9a9] bg-[#fff5df] px-4 py-4 font-sans text-sm leading-6 text-[#72573d]">
            <p>Some items in your basket are no longer available.</p>
            <div className="mt-3 grid gap-2">
              {missingItems.map((item) => (
                <div key={item.productId} className="flex flex-wrap items-center justify-between gap-3">
                  <span>Product {item.productId}</span>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.productId)}
                    className="font-semibold text-[var(--rose)] underline underline-offset-2"
                  >
                    Remove unavailable item
                  </button>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {cartItems.length === 0 ? (
          <section className="info-section mt-8 rounded-[1.5rem] border border-[var(--border)] bg-white/80 px-6 py-12 text-center sm:px-10">
            <h2 className="text-3xl text-[var(--ink)]">Your basket is waiting.</h2>
            <p className="mx-auto mt-3 max-w-md font-sans text-sm leading-6 text-[var(--muted)]">
              Add a handmade favourite from the shop to begin your order.
            </p>
            <Link
              href="/shop"
              className="mt-7 inline-flex rounded-full bg-[var(--rose)] px-6 py-3 font-sans text-sm font-semibold text-white transition hover:bg-[#95495b]"
            >
              Explore the shop
            </Link>
          </section>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
            <section className="info-section rounded-[1.5rem] border border-[var(--border)] bg-white/80 p-5 sm:p-6">
              <div className="grid gap-5">
                {cartItems.map((item) => (
                  <article
                    key={item.productId}
                    className="flex flex-col gap-4 border-b border-[var(--border)] pb-5 last:border-b-0 last:pb-0 sm:flex-row"
                  >
                    <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-2xl bg-[#f4e8dd] sm:size-28">
                      <Image
                        src={item.product.image}
                        alt={item.product.imageAlt}
                        fill
                        sizes="(max-width: 640px) 100vw, 112px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-2xl leading-tight text-[var(--ink)]">{item.product.name}</p>
                          <p className="mt-1 font-sans text-sm text-[var(--muted)]">{item.product.availability}</p>
                        </div>
                        <p className="font-sans text-base font-semibold text-[var(--ink)]">
                          {formatPrice(item.product.price)}
                        </p>
                      </div>
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center rounded-full border border-[var(--border)] bg-white">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="grid size-9 place-items-center font-sans text-lg text-[var(--ink)]"
                            aria-label={`Decrease ${item.product.name} quantity`}
                          >
                            −
                          </button>
                          <span className="grid min-w-9 place-items-center font-sans text-sm font-semibold text-[var(--ink)]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="grid size-9 place-items-center font-sans text-lg text-[var(--ink)]"
                            aria-label={`Increase ${item.product.name} quantity`}
                          >
                            +
                          </button>
                        </div>
                        <p className="font-sans text-sm font-semibold text-[var(--ink)]">
                          Line subtotal: {formatPrice(item.product.price * item.quantity)}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.productId)}
                          className="font-sans text-sm font-semibold text-[var(--rose)] transition hover:text-[var(--ink)]"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <aside className="info-section rounded-[1.5rem] border border-[var(--border)] bg-white/80 p-5 sm:p-6">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rose)]">
                Order summary
              </p>
              <div className="mt-5 flex items-center justify-between font-sans text-sm text-[var(--muted)]">
                <span>Total items</span>
                <span className="font-semibold text-[var(--ink)]">{itemCount}</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-[var(--border)] pt-4">
                <span className="font-sans text-sm text-[var(--muted)]">Subtotal</span>
                <span className="text-2xl font-semibold text-[var(--ink)]">{formatPrice(cartTotal)}</span>
              </div>
              <Link
                href="/checkout"
                className="mt-6 inline-flex w-full justify-center rounded-full bg-[var(--ink)] px-5 py-3 font-sans text-sm font-semibold text-white transition hover:bg-[var(--rose)]"
              >
                Continue to Checkout
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
