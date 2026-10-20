import type { Metadata } from "next";
import Link from "next/link";
import { Types } from "mongoose";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { normalizeOrderStatuses, Order } from "@/app/models/order";
import { connectToDatabase } from "@/lib/mongodb";
import { formatCountry, formatPhone, formatPrice } from "@/app/lib/format";

export const metadata: Metadata = {
  title: "Order Confirmation",
  description: "Review your Twistify Arts order confirmation and delivery details.",
};

export const dynamic = "force-dynamic";

function MessageState({ title, message }: { title: string; message: string }) {
  return (
    <main className="min-h-screen bg-[var(--paper)] px-5 py-12 sm:px-8 sm:py-16">
      <section className="mx-auto max-w-2xl bg-[var(--cream)] px-6 py-12 text-center sm:px-10">
        <p className="font-sans text-[length:var(--step-small)] font-semibold text-[var(--rose-deep)]">
          Twistify Arts
        </p>
        <h1 className="mt-3 text-[var(--ink)] text-[length:var(--step-head)] leading-none">{title}</h1>
        <p className="mx-auto mt-4 max-w-md font-sans text-sm leading-6 text-[var(--muted)]">
          {message}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/shop"
            className="bg-[var(--rose-deep)] px-6 py-3 font-sans text-sm font-semibold text-white transition hover:bg-[var(--ink)]"
          >
            Continue shopping
          </Link>
          <Link
            href="/account"
            className="border border-[var(--border)] bg-white px-6 py-3 font-sans text-sm font-semibold text-[var(--ink)] transition hover:border-[var(--sage)]"
          >
            View account
          </Link>
        </div>
      </section>
    </main>
  );
}

type ConfirmationPageProps = {
  searchParams: Promise<{ orderId?: string | string[] }>;
};

type ConfirmationOrder = {
  _id: { toString(): string };
  items: Array<{ productId: string; name: string; price: number; quantity: number }>;
  delivery: {
    fullName: string;
    country: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
  };
  amount: number;
  status?: string;
  paymentStatus?: string;
  fulfillmentStatus?: string;
  createdAt: Date | string;
};

export default async function OrderConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/order/confirmation");
  }

  const params = await searchParams;
  const orderId = typeof params.orderId === "string" ? params.orderId : undefined;

  if (!orderId || !Types.ObjectId.isValid(orderId)) {
    return (
      <MessageState
        title="Order link is invalid."
        message="We need a valid order reference to show your confirmation. Your account still contains your saved orders."
      />
    );
  }

  await connectToDatabase();
  const order = (await Order.findOne({
    _id: new Types.ObjectId(orderId),
    userId: session.user.id,
  })
    .select("items delivery amount status paymentStatus fulfillmentStatus createdAt")
    .lean()) as ConfirmationOrder | null;

  if (!order) {
    return (
      <MessageState
        title="Order not found."
        message="This order could not be found in your account. Check your order history or continue shopping."
      />
    );
  }

  if (order.paymentStatus === "unpaid") {
    return (
      <MessageState
        title="Payment not received yet."
        message="We haven't received payment for this order. If you were charged, it will appear in your account within a few minutes."
      />
    );
  }

  const statuses = normalizeOrderStatuses(
    order.status,
    order.paymentStatus,
    order.fulfillmentStatus,
  );

  return (
    <main className="min-h-screen bg-[var(--paper)] px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-5xl">
            <section className="bg-[var(--ink)] px-6 py-10 text-white sm:px-10">
          <p className="font-sans text-[length:var(--step-small)] font-semibold text-[#F0B866]">
            Thank you for your order
          </p>
          <h1 className="mt-4 text-[length:var(--step-head)] leading-none">
            Your handmade order is confirmed.
          </h1>
          <p className="mt-4 max-w-2xl font-sans text-sm leading-6 text-[#F3E6D8]">
            We have saved your order and will keep you updated as it moves through fulfillment.
          </p>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
          <div className="grid gap-6">
            <section className="info-section bg-[var(--cream)] p-6 sm:p-8">
              <div className="flex flex-col gap-4 pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-sans text-[length:var(--step-small)] font-semibold text-[var(--rose-deep)]">
                    Order reference
                  </p>
                  <p className="mt-2 break-all font-sans text-sm font-semibold text-[var(--ink)]">
                    {order._id.toString()}
                  </p>
                  <p className="mt-2 font-sans text-sm text-[var(--muted)]">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      dateStyle: "long",
                    })}
                  </p>
                </div>
                <div className="grid gap-2 font-sans text-sm sm:text-right">
                  <p className="text-[var(--muted)]">
                    Payment: <span className="font-semibold text-[var(--ink)]">{statuses.paymentStatus}</span>
                  </p>
                  <p className="text-[var(--muted)]">
                    Fulfillment: <span className="font-semibold text-[var(--ink)]">{statuses.fulfillmentStatus}</span>
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-2xl text-[var(--ink)]">Your items</h2>
                <div className="mt-4 grid gap-4">
                  {order.items.map((item) => (
                    <article
                      key={item.productId}
                      className="flex items-start justify-between gap-4 pb-4 last:pb-0"
                    >
                      <div>
                        <p className="text-lg text-[var(--ink)]">{item.name}</p>
                        <p className="mt-1 font-sans text-sm text-[var(--muted)]">
                          {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                      <p className="shrink-0 font-sans text-sm font-semibold text-[var(--ink)]">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <section className="info-section bg-[var(--cream)] p-6 sm:p-8">
              <h2 className="text-2xl text-[var(--ink)]">Delivery details</h2>
              <div className="mt-4 font-sans text-sm leading-7 text-[var(--muted)]">
                <p className="font-semibold text-[var(--ink)]">{order.delivery.fullName}</p>
                <p>{formatPhone(order.delivery.country, order.delivery.phone)}</p>
                <p>{order.delivery.address}</p>
                <p>
                  {order.delivery.city}, {order.delivery.state} {order.delivery.postalCode}
                </p>
                <p>{formatCountry(order.delivery.country)}</p>
              </div>
            </section>
          </div>

          <aside className="info-section bg-[var(--cream)] p-6">
            <p className="font-sans text-[length:var(--step-small)] font-semibold text-[var(--rose-deep)]">
              Order total
            </p>
            <p className="mt-3 text-3xl font-semibold text-[var(--ink)]">{formatPrice(order.amount / 100)}</p>
            <p className="mt-2 font-sans text-sm leading-6 text-[var(--muted)]">
              Payment status and fulfillment status are updated separately as your order progresses.
            </p>
            <div className="mt-6 grid gap-3">
              <Link
                href="/shop"
                className="inline-flex justify-center bg-[var(--rose-deep)] px-5 py-3 font-sans text-sm font-semibold text-white transition hover:bg-[var(--ink)]"
              >
                Continue shopping
              </Link>
              <Link
                href="/account"
                className="inline-flex justify-center border border-[var(--border)] bg-white px-5 py-3 font-sans text-sm font-semibold text-[var(--ink)] transition hover:border-[var(--sage)]"
              >
                View my orders
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
