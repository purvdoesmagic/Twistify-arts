import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { formatPrice } from "@/app/lib/format";
import { normalizeOrderStatuses, Order } from "@/app/models/order";
import { connectToDatabase } from "@/lib/mongodb";

export const metadata: Metadata = {
  title: "Your account",
};

type AccountOrder = {
  _id: { toString(): string };
  items: Array<{ productId: string; name: string; quantity: number }>;
  amount: number;
  status?: string;
  paymentStatus?: string;
  fulfillmentStatus?: string;
  createdAt: Date | string;
};

const fulfillmentLabels: Record<string, string> = {
  pending: "Order received",
  confirmed: "Confirmed",
  processing: "Being handmade",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account");

  await connectToDatabase();
  const orders = (await Order.find({ userId: session.user.id, paymentStatus: { $ne: "unpaid" } })
    .select("items amount status paymentStatus fulfillmentStatus createdAt")
    .sort({ createdAt: -1 })
    .lean()) as AccountOrder[];

  return (
    <main className="min-h-screen bg-(--paper) px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link href="/shop" className="font-sans text-sm font-semibold text-(--rose-deep)">
          ← Continue shopping
        </Link>
        <section className="mt-6 bg-(--cream) p-6 sm:p-8">
          <p className="font-sans text-(length:--step-small) font-semibold text-(--rose-deep)">Your account</p>
          <h1 className="mt-3 text-(--ink) text-(length:--step-head) leading-none">Hello, {session.user.name ?? "there"}.</h1>
          <p className="mt-3 font-sans text-sm text-(--muted)">{session.user.email}</p>
        </section>
        <section className="mt-6 bg-(--cream) p-6 sm:p-8">
          <h2 className="text-2xl text-(--ink)">Your orders</h2>
          {orders.length === 0 ? (
            <p className="mt-3 font-sans text-sm text-(--muted)">
              You have not placed an order yet.{" "}
              <Link href="/shop" className="font-semibold text-(--rose-deep)">
                Explore the shop
              </Link>
            </p>
          ) : (
            <div className="mt-5 grid gap-3">
              {orders.map((order) => {
                const statuses = normalizeOrderStatuses(order.status, order.paymentStatus, order.fulfillmentStatus);
                const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

                return (
                  <Link
                    key={order._id.toString()}
                    href={`/order/confirmation?orderId=${order._id.toString()}`}
                    className="block border border-transparent bg-[#FBF0E0] p-4 font-sans text-sm text-(--muted) transition hover:border-(--border) hover:bg-white"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-semibold text-(--ink)">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                      </p>
                      <p className="font-semibold text-(--ink)">{formatPrice(order.amount / 100)}</p>
                    </div>
                    <p className="mt-1">
                      {order.items.map((item) => `${item.quantity} × ${item.name}`).join(", ")}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-(length:--step-small)">
                      <span className="bg-white px-2.5 py-1 font-semibold text-(--sage-deep)">
                        {fulfillmentLabels[statuses.fulfillmentStatus] ?? statuses.fulfillmentStatus}
                      </span>
                      <span>
                        {itemCount} item{itemCount === 1 ? "" : "s"} · View order →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
