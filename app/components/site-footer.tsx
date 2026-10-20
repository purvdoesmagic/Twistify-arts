"use client";

import Link from "next/link";

const links = [
  ["/shop", "Shop"],
  ["/about", "About"],
  ["/contact", "Contact"],
  ["/policies/shipping", "Shipping"],
  ["/policies/refunds", "Refunds"],
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer px-5 pb-8 pt-[20svh] text-[length:var(--step-small)] sm:px-8">
      <div className="grid gap-2 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-6">
        <p className="text-[var(--muted)]">Handmade crochet by Shraddha Doshi</p>
        <nav className="flex flex-wrap gap-x-6 gap-y-1" aria-label="Footer navigation">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className="text-link inline-flex min-h-11 items-center">
              {label}
            </Link>
          ))}
        </nav>
        <p className="flex flex-wrap items-center gap-x-6 text-[var(--muted)] md:justify-end">
          <span>© {new Date().getFullYear()} Twistify Arts</span>
          <Link href="/policies/privacy" className="text-link inline-flex min-h-11 items-center text-[var(--ink)]">Privacy</Link>
          <Link href="/policies/terms" className="text-link inline-flex min-h-11 items-center text-[var(--ink)]">Terms</Link>
        </p>
      </div>
    </footer>
  );
}
