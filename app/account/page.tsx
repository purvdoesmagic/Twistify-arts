import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Order } from "@/app/models/order";
import { connectToDatabase } from "@/lib/mongodb";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account");

  await connectToDatabase();
  const orders = await Order.find({ userId: session.user.id }).select("razorpayOrderId status createdAt").sort({ createdAt: -1 }).lean();

  return <main className="min-h-screen bg-[var(--paper)] px-5 py-12 sm:px-8"><div className="mx-auto max-w-3xl"><Link href="/" className="font-sans text-sm font-semibold text-[var(--rose)]">← Continue shopping</Link><section className="mt-6 rounded-[2rem] border border-[var(--border)] bg-white/80 p-6 sm:p-8"><p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rose)]">Your account</p><h1 className="mt-3 text-4xl text-[var(--ink)]">Hello, {session.user.name ?? "there"}.</h1><p className="mt-3 font-sans text-sm text-[var(--muted)]">{session.user.email}</p></section><section className="mt-6 rounded-[2rem] border border-[var(--border)] bg-white/80 p-6 sm:p-8"><h2 className="text-2xl text-[var(--ink)]">Your orders</h2>{orders.length === 0 ? <p className="mt-3 font-sans text-sm text-[var(--muted)]">You have not placed an order yet.</p> : <div className="mt-5 grid gap-3">{orders.map((order) => <article key={order.razorpayOrderId} className="rounded-xl bg-[#f8eee7] p-4 font-sans text-sm text-[var(--muted)]"><p className="font-semibold text-[var(--ink)]">Order {order.razorpayOrderId}</p><p className="mt-1">{new Date(order.createdAt).toLocaleDateString("en-IN")} · {order.status}</p></article>)}</div>}</section></div></main>;
}
