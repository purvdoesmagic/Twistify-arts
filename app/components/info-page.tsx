import Link from "next/link";

type InfoPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
};

export function InfoPage({ eyebrow, title, intro, children }: InfoPageProps) {
  return (
    <main className="min-h-screen bg-[var(--paper)] px-5 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="font-sans text-sm font-semibold text-[var(--rose-deep)]">
          ← Back home
        </Link>
        <header className="info-page-heading relative mt-10 max-w-3xl">
          <p className="flex items-center gap-2.5 font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--rose-deep)]">
            <span className="h-px w-6 bg-[var(--rose)]" aria-hidden="true" />
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
    <section className="info-section rounded-2xl border border-[var(--border)] bg-white/80 p-6 shadow-[var(--shadow-soft)] sm:p-8">
      <h2 className="text-2xl text-[var(--ink)]">{title}</h2>
      <div className="mt-3 space-y-3 font-sans text-sm leading-7 text-[var(--muted)]">{children}</div>
    </section>
  );
}

export function PolicyLinks() {
  return (
    <nav className="flex flex-wrap gap-x-5 gap-y-2 font-sans text-sm font-semibold text-[var(--rose-deep)]" aria-label="Policy navigation">
      <Link href="/policies/shipping">Shipping</Link>
      <Link href="/policies/refunds">Refunds & returns</Link>
      <Link href="/policies/privacy">Privacy</Link>
      <Link href="/policies/terms">Terms</Link>
    </nav>
  );
}
