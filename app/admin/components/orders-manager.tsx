"use client";

import { useEffect, useState } from "react";

const fulfillmentOptions = [
  ["pending", "Pending"],
  ["confirmed", "Confirmed"],
  ["processing", "Processing"],
  ["shipped", "Shipped"],
  ["delivered", "Delivered"],
  ["cancelled", "Cancelled"],
] as const;

type AdminOrder = {
  id: string;
  orderId: string;
  customer: { name: string; email: string | null };
  createdAt: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  amount: number;
  paymentStatus: string;
  fulfillmentStatus: (typeof fulfillmentOptions)[number][0];
  razorpayOrderId: string;
  razorpayPaymentId: string;
  delivery: {
    fullName: string;
    country: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
  };
};

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

function statusLabel(status: string) {
  return fulfillmentOptions.find(([value]) => value === status)?.[1] ?? status;
}

export function OrdersManager() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    async function loadOrders() {
      try {
        const response = await fetch("/api/admin/orders");
        const result = (await response.json()) as { orders?: AdminOrder[]; error?: string };

        if (!response.ok) {
          throw new Error(result.error ?? "Unable to load orders.");
        }

        if (isCurrent) {
          setOrders(result.orders ?? []);
        }
      } catch (loadError) {
        if (isCurrent) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load orders.");
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    void loadOrders();

    return () => {
      isCurrent = false;
    };
  }, []);

  async function updateFulfillmentStatus(orderId: string, fulfillmentStatus: AdminOrder["fulfillmentStatus"]) {
    setUpdatingOrderId(orderId);
    setError(null);

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fulfillmentStatus }),
      });
      const result = (await response.json()) as { order?: AdminOrder; error?: string };

      if (!response.ok || !result.order) {
        throw new Error(result.error ?? "Unable to update order status.");
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) => (order.id === orderId ? result.order! : order)),
      );
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update order status.");
    } finally {
      setUpdatingOrderId(null);
    }
  }

  if (isLoading) {
    return <p className="mt-8 font-sans text-sm text-[var(--muted)]">Loading orders…</p>;
  }

  if (error && orders.length === 0) {
    return <p className="mt-8 rounded-xl bg-[#f8eee7] px-4 py-3 font-sans text-sm text-[var(--rose)]" role="alert">{error}</p>;
  }

  if (orders.length === 0) {
    return <p className="mt-8 rounded-2xl border border-[var(--border)] bg-white/70 px-5 py-6 font-sans text-sm text-[var(--muted)]">No orders yet.</p>;
  }

  return (
    <div className="mt-8 space-y-5">
      {error ? <p className="rounded-xl bg-[#f8eee7] px-4 py-3 font-sans text-sm text-[var(--rose)]" role="alert">{error}</p> : null}
      {orders.map((order) => (
        <article key={order.id} className="rounded-2xl border border-[var(--border)] bg-white/80 p-5 shadow-[0_12px_26px_rgba(84,51,44,0.06)] sm:p-6">
          <div className="flex flex-col gap-4 border-b border-[var(--border)] pb-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-[var(--rose)]">Order {order.orderId}</p>
              <p className="mt-2 text-xl text-[var(--ink)]">{order.customer.name}</p>
              <p className="mt-1 font-sans text-sm text-[var(--muted)]">{order.customer.email ?? "Customer email unavailable"}</p>
              <p className="mt-1 font-sans text-xs text-[var(--muted)]">{formatDate(order.createdAt)}</p>
            </div>
            <div className="flex flex-col gap-2 lg:items-end">
              <p className="text-2xl font-semibold text-[var(--ink)]">{formatPrice(order.amount)}</p>
              <p className="font-sans text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Payment: {order.paymentStatus}</p>
              <label className="flex items-center gap-2 font-sans text-sm font-semibold text-[var(--muted)]">
                <span className="sr-only">Fulfillment status for {order.orderId}</span>
                <select
                  value={order.fulfillmentStatus}
                  disabled={updatingOrderId === order.id}
                  onChange={(event) => void updateFulfillmentStatus(order.id, event.target.value as AdminOrder["fulfillmentStatus"])}
                  className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm font-normal text-[var(--ink)] outline-none focus:border-[var(--rose)] disabled:opacity-60"
                >
                  {fulfillmentOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
                {updatingOrderId === order.id ? <span className="text-xs font-normal">Updating…</span> : null}
              </label>
              <p className="font-sans text-xs text-[var(--muted)]">Status: {statusLabel(order.fulfillmentStatus)}</p>
            </div>
          </div>

          <div className="grid gap-5 py-5 lg:grid-cols-[1fr_1fr]">
            <div>
              <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-[var(--sage)]">Products</h2>
              <ul className="mt-3 space-y-2 font-sans text-sm text-[var(--muted)]">
                {order.items.map((item) => <li key={item.name}>{item.quantity} × {item.name} <span className="text-[var(--ink)]">({formatPrice(item.price * item.quantity)})</span></li>)}
              </ul>
            </div>
            <div>
              <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-[var(--sage)]">Delivery</h2>
              <p className="mt-3 font-sans text-sm leading-6 text-[var(--muted)]">{order.delivery.fullName}<br />+{order.delivery.phone}<br />{order.delivery.address}<br />{order.delivery.city}, {order.delivery.state} {order.delivery.postalCode}</p>
            </div>
          </div>

          <div className="border-t border-[var(--border)] pt-4 font-sans text-xs leading-5 text-[var(--muted)]">
            <p>Razorpay order: {order.razorpayOrderId}</p>
            <p>Razorpay payment: {order.razorpayPaymentId}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
