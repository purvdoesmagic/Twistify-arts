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
        <header className="flex flex-col gap-4 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="mt-3 text-[var(--ink)] text-[length:var(--step-head)] leading-none">Orders</h1>
            <p className="mt-2 font-sans text-sm text-[var(--muted)]">Signed in as {session.user.email}.</p>
          </div>
          <Link href="/" className="font-sans text-sm font-semibold text-[var(--rose-deep)]">← Back to the store</Link>
        </header>
        <OrdersManager />
      </div>
    </main>
  );
}
