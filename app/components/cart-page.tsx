"use client";

import Link from "next/link";
import type { Product } from "../data/products";
import { useCart } from "./cart-provider";
import { MAX_PER_PIECE } from "@/app/lib/cart-limits";
import { ProductPlaceholder } from "./product-placeholder";
import { formatPrice } from "@/app/lib/format";

type CartPageProps = {
  products: Product[];
};

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
      <main className="min-h-screen bg-(--paper) px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <p className="font-sans text-sm text-(--muted)" aria-live="polite">
            Loading your basket...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-(--paper) px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <Link href="/shop" className="font-sans text-sm font-semibold text-(--rose-deep)">
          ← Continue shopping
        </Link>
        <header className="mt-10 max-w-3xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="text-(--ink) text-(length:--step-head) leading-none">Cart</h1>
            <p className="font-sans text-sm text-(--muted)">
              {itemCount} item{itemCount === 1 ? "" : "s"}
            </p>
          </div>
          </header>

        {missingItems.length > 0 ? (
          <section className="mt-8 border border-[#efd9a9] bg-[#fff5df] px-4 py-4 font-sans text-sm leading-6 text-[#72573d]">
            <p>Some items in your basket are no longer available.</p>
            <div className="mt-3 grid gap-2">
              {missingItems.map((item) => (
                <div key={item.productId} className="flex flex-wrap items-center justify-between gap-3">
                  <span>Product {item.productId}</span>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.productId)}
                    className="font-semibold text-(--rose-deep) underline underline-offset-2"
                  >
                    Remove unavailable item
                  </button>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {cartItems.length === 0 ? (
          <section className="mt-8 bg-(--cream) px-6 py-12 text-center sm:px-10">
            <h2 className="text-3xl text-(--ink)">Your basket is waiting.</h2>
            <p className="mx-auto mt-3 max-w-md font-sans text-sm leading-6 text-(--muted)">
              Add a handmade favourite from the shop to begin your order.
            </p>
            <Link
              href="/shop"
              className="mt-7 inline-flex bg-(--rose-deep) px-6 py-3 font-sans text-sm font-semibold text-white transition hover:bg-(--ink)"
            >
              Explore the shop
            </Link>
          </section>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
            <section className="bg-(--cream) p-5 sm:p-6">
              <div className="grid gap-5">
                {cartItems.map((item) => (
                  <article
                    key={item.productId}
                    className="flex gap-4 pb-5 last:pb-0 sm:gap-5"
                  >
                    <ProductPlaceholder
                      name={item.product.name}
                      category={item.product.category}
                      compact
                      className="size-24 shrink-0 sm:size-28"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-2xl leading-tight text-(--ink)">{item.product.name}</p>
                          <p className="mt-1 font-sans text-sm text-(--muted)">{item.product.availability}</p>
                        </div>
                        <p className="font-sans text-base font-semibold text-(--ink)">
                          {formatPrice(item.product.price)}
                        </p>
                      </div>
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center border border-(--border) bg-white">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="grid size-11 place-items-center font-sans text-lg text-(--ink)"
                            aria-label={`Decrease ${item.product.name} quantity`}
                          >
                            −
                          </button>
                          <span className="grid min-w-9 place-items-center font-sans text-sm font-semibold text-(--ink)">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= MAX_PER_PIECE}
                              className="grid size-11 place-items-center disabled:opacity-40 font-sans text-lg text-(--ink)"
                            aria-label={`Increase ${item.product.name} quantity`}
                          >
                            +
                          </button>
                        </div>
                        <p className="font-sans text-sm font-semibold text-(--ink)">
                          Line subtotal: {formatPrice(item.product.price * item.quantity)}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.productId)}
                          className="font-sans text-sm font-semibold text-(--rose-deep) transition hover:text-(--ink)"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <aside className="bg-(--cream) p-5 sm:p-6">
              <h2 className="text-2xl text-(--ink)">Order summary</h2>
              <div className="mt-5 flex items-center justify-between font-sans text-sm text-(--muted)">
                <span>Total items</span>
                <span className="font-semibold text-(--ink)">{itemCount}</span>
              </div>
              <div className="mt-3 flex items-center justify-between pt-4">
                <span className="font-sans text-sm text-(--muted)">Subtotal</span>
                <span className="text-2xl font-semibold text-(--ink)">{formatPrice(cartTotal)}</span>
              </div>
              <Link
                href="/checkout"
                className="mt-6 inline-flex w-full justify-center bg-(--ink) px-5 py-3 font-sans text-sm font-semibold text-white transition hover:bg-(--rose-deep)"
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
