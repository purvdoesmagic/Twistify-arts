import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { OrdersManager } from "@/app/admin/components/orders-manager";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (session.user.role !== "admin") redirect("/");

  return (
    <main className="min-h-screen bg-[var(--paper)] px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-col gap-4 border-b border-[var(--border)] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rose)]">Twistify Arts</p>
            <h1 className="mt-3 text-4xl text-[var(--ink)]">Orders</h1>
            <p className="mt-2 font-sans text-sm text-[var(--muted)]">Signed in as {session.user.email}.</p>
          </div>
          <Link href="/" className="font-sans text-sm font-semibold text-[var(--rose)]">← Back to the store</Link>
        </header>
        <OrdersManager />
      </div>
    </main>
  );
}
