import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (session.user.role !== "admin") redirect("/");

  return <main className="min-h-screen bg-[var(--paper)] px-5 py-12 sm:px-8"><section className="mx-auto max-w-3xl rounded-[2rem] border border-[var(--border)] bg-white/80 p-6 sm:p-8"><p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rose)]">Twistify Arts</p><h1 className="mt-3 text-4xl text-[var(--ink)]">Admin area</h1><p className="mt-3 font-sans text-sm leading-6 text-[var(--muted)]">Signed in as {session.user.email}. Admin tools will be added in a later step.</p><Link href="/" className="mt-6 inline-block font-sans text-sm font-semibold text-[var(--rose)]">← Back to the store</Link></section></main>;
}
