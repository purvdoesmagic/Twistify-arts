"use client";

import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-white/70">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr] lg:px-10">
        <div>
          <p className="text-2xl text-[var(--ink)]">Twistify Arts</p>
          <p className="mt-2 max-w-sm font-sans text-sm leading-6 text-[var(--muted)]">
            Handmade crochet and woolen crafts by Shraddha Doshi, made for gifting, celebrations, and joyful corners at home.
          </p>
        </div>

        <nav className="grid content-start gap-3 font-sans text-sm" aria-label="Footer shop navigation">
          <p className="font-semibold uppercase tracking-[0.16em] text-[var(--rose)]">Explore</p>
          <Link className="text-[var(--muted)] transition hover:text-[var(--rose)]" href="/shop">
            Shop
          </Link>
          <Link className="text-[var(--muted)] transition hover:text-[var(--rose)]" href="/about">
            About
          </Link>
          <Link className="text-[var(--muted)] transition hover:text-[var(--rose)]" href="/account">
            Account
          </Link>
        </nav>

        <nav className="grid content-start gap-3 font-sans text-sm" aria-labelledby="footer-policies-heading">
          <p id="footer-policies-heading" className="font-semibold uppercase tracking-[0.16em] text-[var(--rose)]">
            Policies
          </p>
          <Link className="text-[var(--muted)] transition hover:text-[var(--rose)]" href="/policies/shipping">
            Shipping
          </Link>
          <Link className="text-[var(--muted)] transition hover:text-[var(--rose)]" href="/policies/refunds">
            Refunds & returns
          </Link>
          <Link className="text-[var(--muted)] transition hover:text-[var(--rose)]" href="/policies/privacy">
            Privacy
          </Link>
          <Link className="text-[var(--muted)] transition hover:text-[var(--rose)]" href="/policies/terms">
            Terms
          </Link>
        </nav>
      </div>
      <div className="border-t border-[var(--border)] px-5 py-4 sm:px-8 lg:px-10">
        <p className="mx-auto max-w-7xl font-sans text-xs text-[var(--muted)]">
          © {new Date().getFullYear()} Twistify Arts. Handmade with care.
        </p>
      </div>
    </footer>
  );
}
