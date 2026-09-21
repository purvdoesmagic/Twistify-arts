import Link from "next/link";

type InfoPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
};

export function InfoPage({ eyebrow, title, intro, children }: InfoPageProps) {
  return (
    <main className="min-h-screen bg-[var(--paper)] px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="font-sans text-sm font-semibold text-[var(--rose)]">
          ← Back home
        </Link>
        <header className="mt-8 max-w-3xl">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.24em] text-[var(--rose)]">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-5xl leading-tight tracking-[-0.04em] text-[var(--ink)] sm:text-6xl">
            {title}
          </h1>
          <p className="mt-5 font-sans text-base leading-7 text-[var(--muted)] sm:text-lg">
            {intro}
          </p>
        </header>
        <div className="mt-10 grid gap-5">{children}</div>
      </div>
    </main>
  );
}

export function InfoSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[1.6rem] border border-[var(--border)] bg-white/80 p-6 shadow-[0_12px_26px_rgba(84,51,44,0.05)] sm:p-8">
      <h2 className="text-2xl text-[var(--ink)]">{title}</h2>
      <div className="mt-3 space-y-3 font-sans text-sm leading-7 text-[var(--muted)]">{children}</div>
    </section>
  );
}

export function PolicyLinks() {
  return (
    <nav className="flex flex-wrap gap-x-5 gap-y-2 font-sans text-sm font-semibold text-[var(--rose)]" aria-label="Policy navigation">
      <Link href="/policies/shipping">Shipping</Link>
      <Link href="/policies/refunds">Refunds & returns</Link>
      <Link href="/policies/privacy">Privacy</Link>
      <Link href="/policies/terms">Terms</Link>
    </nav>
  );
}
