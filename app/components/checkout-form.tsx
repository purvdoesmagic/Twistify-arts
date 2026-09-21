"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import type { CountryCode } from "libphonenumber-js";
import type { Product } from "../data/products";
import { useCart } from "./cart-provider";

type CheckoutFormProps = {
  products: Product[];
  razorpayEnabled: boolean;
};

type DeliveryDetails = {
  fullName: string;
  country: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
};

const emptyDeliveryDetails: DeliveryDetails = {
  fullName: "",
  country: "IN",
  phone: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
};

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
const callingCodeCountries = getCountries().sort((firstCountry, secondCountry) =>
  (regionNames.of(firstCountry) ?? firstCountry).localeCompare(
    regionNames.of(secondCountry) ?? secondCountry,
  ),
);

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
  prefill?: { name: string; contact: string };
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

export function CheckoutForm({ products, razorpayEnabled }: CheckoutFormProps) {
  const router = useRouter();
  const { cart, isHydrated, clearCart, removeFromCart } = useCart();
  const [isRazorpayLoading, setIsRazorpayLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [deliveryDetails, setDeliveryDetails] = useState(emptyDeliveryDetails);
  const [deliveryError, setDeliveryError] = useState<string | null>(null);

  const cartItems = cart.flatMap((line) => {
    const product = products.find((item) => item.id === line.productId);

    return product ? [{ ...line, product }] : [];
  });
  const missingItems = cart.filter(
    (line) => !products.some((product) => product.id === line.productId),
  );
  const soldOutItems = cartItems.filter((item) => item.product.availability === "Sold out");
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const updateDeliveryDetail = (field: keyof DeliveryDetails, value: string) => {
    setDeliveryDetails((currentDetails) => ({ ...currentDetails, [field]: value }));
    setDeliveryError(null);
  };

  const deliveryDetailsAreComplete = () => {
    const { fullName, country, phone, address, city, state, postalCode } = deliveryDetails;

    if (!fullName.trim() || !country || !phone.trim() || !address.trim() || !city.trim() || !state.trim()) {
      return "Please complete all delivery details.";
    }

    if (!/^\d{6,15}$/.test(phone.trim())) {
      return "Please enter a valid phone number.";
    }

    if (!/^\d{6}$/.test(postalCode.trim())) {
      return "Please enter a valid 6-digit PIN code.";
    }

    return null;
  };

  const startRazorpayCheckout = async () => {
    if (!razorpayEnabled || !isHydrated || cartItems.length === 0 || missingItems.length > 0 || soldOutItems.length > 0) {
      return;
    }

    const invalidDeliveryDetails = deliveryDetailsAreComplete();

    if (invalidDeliveryDetails) {
      setDeliveryError(invalidDeliveryDetails);
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
        body: JSON.stringify({ delivery: deliveryDetails, items: cart }),
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
        name: "Twistify Arts",
        description: "Handmade craft order",
        order_id: order.orderId,
        prefill: {
          name: deliveryDetails.fullName.trim(),
          contact: `+${getCountryCallingCode(deliveryDetails.country as CountryCode)}${deliveryDetails.phone.trim()}`,
        },
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
              orderId?: string;
              error?: string;
            };

            if (!verifyResponse.ok || !verification.verified || !verification.orderId) {
              throw new Error(verification.error ?? "Payment verification failed.");
            }

            clearCart();
            router.replace(`/order/confirmation?orderId=${encodeURIComponent(verification.orderId)}`);
          } catch (error) {
            setPaymentStatus(
              error instanceof Error
                ? error.message
                : "Payment verification failed. Please try again.",
            );
            setIsRazorpayLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            if (!paymentCompleted) {
              setPaymentStatus(
                "Razorpay was closed before payment. Open this site in Chrome or Edge and try again.",
              );
            }
            setIsRazorpayLoading(false);
          },
        },
      });

      checkout.open();
    } catch (error) {
      setPaymentStatus(
        error instanceof Error ? error.message : "Unable to start Razorpay checkout.",
      );
      setIsRazorpayLoading(false);
    }
  };

  if (!isHydrated) {
    return (
      <main className="min-h-screen bg-[var(--paper)] px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <p className="font-sans text-sm text-[var(--muted)]" aria-live="polite">
            Loading your checkout...
          </p>
        </div>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[var(--paper)] px-5 py-12 sm:px-8 sm:py-16">
        <div className="info-section mx-auto max-w-3xl rounded-[1.5rem] border border-[var(--border)] bg-white/80 px-6 py-12 text-center sm:px-10">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rose)]">
            Checkout
          </p>
          <h1 className="mt-3 text-4xl text-[var(--ink)]">Your basket is empty.</h1>
          <p className="mx-auto mt-3 max-w-md font-sans text-sm leading-6 text-[var(--muted)]">
            Add a handmade favourite before continuing to checkout.
          </p>
          <Link
            href="/shop"
            className="mt-7 inline-flex rounded-full bg-[var(--rose)] px-6 py-3 font-sans text-sm font-semibold text-white transition hover:bg-[#95495b]"
          >
            Explore the shop
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--paper)] px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <Link href="/cart" className="font-sans text-sm font-semibold text-[var(--rose)]">
          ← Edit your basket
        </Link>
        <div className="mt-6">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rose)]">
            Secure checkout
          </p>
          <h1 className="mt-3 text-5xl tracking-[-0.04em] text-[var(--ink)]">Complete your order</h1>
          <p className="mt-3 max-w-2xl font-sans text-sm leading-6 text-[var(--muted)]">
            Share your delivery details, then pay securely through Razorpay.
          </p>
        </div>

        {missingItems.length > 0 || soldOutItems.length > 0 ? (
          <section className="mt-8 rounded-2xl border border-[#efd9a9] bg-[#fff5df] px-4 py-4 font-sans text-sm leading-6 text-[#72573d]">
            <p>Remove unavailable items from your basket before payment.</p>
            <div className="mt-3 grid gap-2">
              {missingItems.map((item) => (
                <div key={item.productId} className="flex flex-wrap items-center justify-between gap-3">
                  <span>Product {item.productId} is no longer available.</span>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.productId)}
                    className="font-semibold text-[var(--rose)] underline underline-offset-2"
                  >
                    Remove item
                  </button>
                </div>
              ))}
              {soldOutItems.map((item) => (
                <div key={item.productId} className="flex flex-wrap items-center justify-between gap-3">
                  <span>{item.product.name} is sold out.</span>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.productId)}
                    className="font-semibold text-[var(--rose)] underline underline-offset-2"
                  >
                    Remove item
                  </button>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_21rem] lg:items-start">
          <section className="info-section rounded-[1.5rem] border border-[var(--border)] bg-white/80 p-6 sm:p-8">
            <h2 className="text-2xl text-[var(--ink)]">Delivery details</h2>
            <p className="mt-2 font-sans text-sm leading-6 text-[var(--muted)]">
              These details are included in the paid-order email.
            </p>
            <div className="mt-6 space-y-4">
              <label className="grid gap-1.5 font-sans text-sm font-semibold text-[var(--muted)]">
                Full name
                <input
                  value={deliveryDetails.fullName}
                  onChange={(event) => updateDeliveryDetail("fullName", event.target.value)}
                  autoComplete="name"
                  maxLength={80}
                  className="rounded-xl border border-[var(--border)] bg-white px-3 py-3 text-sm font-normal text-[var(--ink)] outline-none focus:border-[var(--rose)]"
                />
              </label>
              <label className="grid gap-1.5 font-sans text-sm font-semibold text-[var(--muted)]">
                Phone number
                <div className="flex rounded-xl border border-[var(--border)] bg-white focus-within:border-[var(--rose)]">
                  <select
                    value={deliveryDetails.country}
                    onChange={(event) => updateDeliveryDetail("country", event.target.value)}
                    aria-label="Country calling code"
                    className="max-w-40 border-r border-[var(--border)] bg-transparent px-2 py-3 text-sm font-normal text-[var(--muted)] outline-none"
                  >
                    {callingCodeCountries.map((country) => (
                      <option key={country} value={country}>
                        {regionNames.of(country)} +{getCountryCallingCode(country)}
                      </option>
                    ))}
                  </select>
                  <input
                    value={deliveryDetails.phone}
                    onChange={(event) =>
                      updateDeliveryDetail(
                        "phone",
                        event.target.value.replace(/\D/g, "").slice(0, 15),
                      )
                    }
                    autoComplete="tel"
                    inputMode="numeric"
                    maxLength={15}
                    placeholder="Phone number"
                    className="min-w-0 flex-1 rounded-r-xl bg-transparent px-3 py-3 text-sm font-normal text-[var(--ink)] outline-none"
                  />
                </div>
              </label>
              <label className="grid gap-1.5 font-sans text-sm font-semibold text-[var(--muted)]">
                Full address
                <textarea
                  value={deliveryDetails.address}
                  onChange={(event) => updateDeliveryDetail("address", event.target.value)}
                  autoComplete="street-address"
                  maxLength={240}
                  rows={3}
                  className="resize-none rounded-xl border border-[var(--border)] bg-white px-3 py-3 text-sm font-normal text-[var(--ink)] outline-none focus:border-[var(--rose)]"
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="grid gap-1.5 font-sans text-sm font-semibold text-[var(--muted)]">
                  City
                  <input
                    value={deliveryDetails.city}
                    onChange={(event) => updateDeliveryDetail("city", event.target.value)}
                    autoComplete="address-level2"
                    maxLength={80}
                    className="rounded-xl border border-[var(--border)] bg-white px-3 py-3 text-sm font-normal text-[var(--ink)] outline-none focus:border-[var(--rose)]"
                  />
                </label>
                <label className="grid gap-1.5 font-sans text-sm font-semibold text-[var(--muted)]">
                  State
                  <input
                    value={deliveryDetails.state}
                    onChange={(event) => updateDeliveryDetail("state", event.target.value)}
                    autoComplete="address-level1"
                    maxLength={80}
                    className="rounded-xl border border-[var(--border)] bg-white px-3 py-3 text-sm font-normal text-[var(--ink)] outline-none focus:border-[var(--rose)]"
                  />
                </label>
              </div>
              <label className="grid gap-1.5 font-sans text-sm font-semibold text-[var(--muted)]">
                PIN code
                <input
                  value={deliveryDetails.postalCode}
                  onChange={(event) =>
                    updateDeliveryDetail(
                      "postalCode",
                      event.target.value.replace(/\D/g, "").slice(0, 6),
                    )
                  }
                  autoComplete="postal-code"
                  inputMode="numeric"
                  maxLength={6}
                  className="rounded-xl border border-[var(--border)] bg-white px-3 py-3 text-sm font-normal text-[var(--ink)] outline-none focus:border-[var(--rose)]"
                />
              </label>
              {deliveryError ? (
                <p className="rounded-xl bg-[#f8eee7] px-3 py-2 font-sans text-sm leading-5 text-[var(--rose)]" role="alert">
                  {deliveryError}
                </p>
              ) : null}
            </div>
          </section>

          <aside className="info-section rounded-[1.5rem] border border-[var(--border)] bg-white/80 p-5 sm:p-6">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rose)]">
              Order summary
            </p>
            <div className="mt-5 space-y-4">
              {cartItems.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-[#f4e8dd]">
                    <Image src={item.product.image} alt="" fill sizes="64px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-sans text-sm font-semibold text-[var(--ink)]">{item.product.name}</p>
                    <p className="mt-1 font-sans text-xs text-[var(--muted)]">
                      {item.quantity} × {formatPrice(item.product.price)}
                    </p>
                  </div>
                  <p className="font-sans text-sm font-semibold text-[var(--ink)]">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-[var(--border)] pt-4 font-sans text-sm text-[var(--muted)]">
              <span>{cartCount} item{cartCount === 1 ? "" : "s"}</span>
              <span className="text-2xl font-semibold text-[var(--ink)]">{formatPrice(cartTotal)}</span>
            </div>
            {razorpayEnabled ? (
              <p className="mt-3 font-sans text-xs leading-5 text-[var(--muted)]">
                Test Razorpay in a full browser such as Chrome or Edge, not the VS Code preview.
              </p>
            ) : null}
            {paymentStatus ? (
              <p className="mt-3 rounded-xl bg-[#f8eee7] px-3 py-2 font-sans text-sm leading-5 text-[var(--muted)]" role="status">
                {paymentStatus}
              </p>
            ) : null}
            {razorpayEnabled ? (
              <button
                type="button"
                onClick={() => void startRazorpayCheckout()}
                disabled={isRazorpayLoading || missingItems.length > 0 || soldOutItems.length > 0}
                className="mt-5 w-full rounded-full bg-[var(--ink)] px-5 py-3 font-sans text-sm font-semibold text-white transition hover:bg-[var(--rose)] disabled:cursor-not-allowed disabled:bg-[#91817a]"
              >
                {isRazorpayLoading ? "Opening Razorpay…" : "Pay securely with Razorpay"}
              </button>
            ) : (
              <p className="mt-5 rounded-2xl bg-[#f8eee7] px-4 py-3 font-sans text-sm leading-6 text-[var(--muted)]">
                Online payments are temporarily unavailable.
              </p>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
