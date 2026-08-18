"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "../data/products";

type CatalogProps = {
  products: Product[];
};

type CartLine = {
  productId: string;
  quantity: number;
};

type RazorpayOrderResponse = {
  keyId?: string;
  orderId?: string;
  orderToken?: string;
  amount?: number;
  currency?: string;
  error?: string;
};

type RazorpayPaymentResponse = {
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  theme: { color: string };
  handler: (response: RazorpayPaymentResponse) => void;
  modal?: {
    ondismiss: () => void;
  };
};

type RazorpayCheckout = {
  open: () => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayCheckout;
  }
}

const RAZORPAY_ENABLED = process.env.NEXT_PUBLIC_ENABLE_RAZORPAY === "true";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

const loadRazorpayCheckout = () =>
  new Promise<boolean>((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(Boolean(window.Razorpay));
    script.onerror = () => resolve(false);
    document.body.append(script);
  });

export function Catalog({ products }: CatalogProps) {
  const filters = ["All creations", ...new Set(products.map((product) => product.category))];
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [isRazorpayLoading, setIsRazorpayLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const visibleProducts =
    activeFilter === "All creations"
      ? products
      : products.filter((product) => product.category === activeFilter);
  const cartItems = cart.flatMap((line) => {
    const product = products.find((item) => item.id === line.productId);

    return product ? [{ ...line, product }] : [];
  });
  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const addToCart = (productId: string) => {
    setCart((currentCart) => {
      const existingLine = currentCart.find((line) => line.productId === productId);

      if (existingLine) {
        return currentCart.map((line) =>
          line.productId === productId
            ? { ...line, quantity: line.quantity + 1 }
            : line,
        );
      }

      return [...currentCart, { productId, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((currentCart) =>
      quantity <= 0
        ? currentCart.filter((line) => line.productId !== productId)
        : currentCart.map((line) =>
            line.productId === productId ? { ...line, quantity } : line,
          ),
    );
  };

  const startRazorpayCheckout = async () => {
    if (!RAZORPAY_ENABLED || cart.length === 0) {
      return;
    }

    setIsRazorpayLoading(true);
    setPaymentStatus(null);

    try {
      const checkoutLoaded = await loadRazorpayCheckout();

      if (!checkoutLoaded || !window.Razorpay) {
        throw new Error("Razorpay checkout could not be loaded. Please try again.");
      }

      const orderResponse = await fetch("/api/payments/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }),
      });
      const order = (await orderResponse.json()) as RazorpayOrderResponse;

      if (
        !orderResponse.ok ||
        !order.keyId ||
        !order.orderId ||
        !order.orderToken ||
        !order.amount ||
        !order.currency
      ) {
        throw new Error(order.error ?? "Unable to start Razorpay checkout.");
      }

      let paymentCompleted = false;
      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Wren & Loom",
        description: "Handmade craft order",
        order_id: order.orderId,
        theme: { color: "#ad5e70" },
        handler: async (response) => {
          paymentCompleted = true;
          setPaymentStatus("Verifying your payment…");

          try {
            const verifyResponse = await fetch("/api/payments/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                orderToken: order.orderToken,
              }),
            });
            const verification = (await verifyResponse.json()) as {
              verified?: boolean;
              error?: string;
            };

            if (!verifyResponse.ok || !verification.verified) {
              throw new Error(verification.error ?? "Payment verification failed.");
            }

            setCart([]);
            setPaymentStatus("Payment verified. We will confirm your order shortly.");
          } catch (error) {
            setPaymentStatus(
              error instanceof Error
                ? error.message
                : "Payment verification failed. Please try again.",
            );
          }
        },
        modal: {
          ondismiss: () => {
            if (!paymentCompleted) {
              setPaymentStatus(
                "Razorpay was closed before payment. Open this site in Chrome or Edge and try again.",
              );
            }
          },
        },
      });

      checkout.open();
    } catch (error) {
      setPaymentStatus(
        error instanceof Error ? error.message : "Unable to start Razorpay checkout.",
      );
    } finally {
      setIsRazorpayLoading(false);
    }
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
              <div className="mt-5 flex items-center justify-between gap-3">
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
                  className="rounded-full bg-[var(--rose)] px-4 py-2.5 font-sans text-sm font-semibold text-white transition hover:bg-[#95495b]"
                >
                  Add
                </button>
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
            onClick={() => setCartOpen(false)}
            className="absolute inset-0 bg-[rgba(51,39,34,0.35)] backdrop-blur-sm"
          />
          <aside className="relative flex h-full w-full max-w-md flex-col bg-[var(--paper)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-5">
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
                onClick={() => setCartOpen(false)}
                className="grid size-10 place-items-center rounded-full border border-[var(--border)] font-sans text-lg text-[var(--ink)] transition hover:bg-white"
                aria-label="Close basket"
              >
                ×
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="grid flex-1 place-items-center px-8 text-center">
                <div>
                  <p className="text-3xl text-[var(--ink)]">Your basket is waiting.</p>
                  <p className="mt-3 font-sans text-sm leading-6 text-[var(--muted)]">
                    Add a handmade favourite, then complete your secure checkout.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto px-6 py-5">
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

            <div className="border-t border-[var(--border)] bg-white/60 px-6 py-5">
              <div className="flex items-center justify-between font-sans text-sm text-[var(--muted)]">
                <span>Subtotal</span>
                <span className="text-lg font-semibold text-[var(--ink)]">{formatPrice(cartTotal)}</span>
              </div>
              <p className="mt-2 font-sans text-xs leading-5 text-[var(--muted)]">
                Delivery details are confirmed after your payment is verified.
              </p>
              {RAZORPAY_ENABLED ? (
                <p className="mt-2 font-sans text-xs leading-5 text-[var(--muted)]">
                  Test Razorpay in a full browser such as Chrome or Edge, not the VS Code preview.
                </p>
              ) : null}
              {paymentStatus ? (
                <p className="mt-3 rounded-xl bg-[#f8eee7] px-3 py-2 font-sans text-xs leading-5 text-[var(--muted)]" role="status">
                  {paymentStatus}
                </p>
              ) : null}
              {cartItems.length > 0 ? (
                <div className="mt-5 grid gap-3">
                  {RAZORPAY_ENABLED ? (
                    <button
                      type="button"
                      onClick={startRazorpayCheckout}
                      disabled={isRazorpayLoading}
                      className="rounded-full bg-[var(--ink)] px-5 py-3 font-sans text-sm font-semibold text-white transition hover:bg-[var(--rose)] disabled:cursor-not-allowed disabled:bg-[#91817a]"
                    >
                      {isRazorpayLoading ? "Opening Razorpay…" : "Pay securely with Razorpay"}
                    </button>
                  ) : (
                    <p className="rounded-2xl bg-[#f8eee7] px-4 py-3 font-sans text-sm leading-6 text-[var(--muted)]">
                      Online payments are temporarily unavailable.
                    </p>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  disabled
                  className="mt-5 w-full rounded-full bg-[#ded3c9] px-5 py-3 font-sans text-sm font-semibold text-[#8b7b70]"
                >
                  Add an item to continue
                </button>
              )}
            </div>
          </aside>
        </div>
      ) : null}
    </section>
  );
}
