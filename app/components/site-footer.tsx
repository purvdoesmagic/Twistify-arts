"use client";

import Image from "next/image";
import Link from "next/link";

const linkClass = "text-[var(--muted)] transition-colors hover:text-[var(--rose-deep)]";
const headingClass = "text-xs font-bold uppercase tracking-[0.16em] text-[var(--rose-deep)]";

export function SiteFooter() {
  return (
    <footer className="site-footer border-t border-[var(--border)]">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 lg:px-12 lg:py-16">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <Image src="/twistify-arts-mark.svg" alt="" width={40} height={40} className="size-10" />
              <p className="text-2xl tracking-tight text-[var(--ink)]">Twistify Arts</p>
            </div>
            <p className="mt-4 max-w-sm font-sans text-sm leading-7 text-[var(--muted)]">
              Handmade crochet and woolen crafts by Shraddha Doshi, made for gifting, celebrations, and joyful corners at home.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 font-sans text-[11px] font-bold uppercase tracking-[0.14em]">
              <span className="rounded-full border border-[var(--sage)] bg-[rgba(135,169,107,0.12)] px-3 py-1 text-[#5E7A48]">Handmade</span>
              <span className="rounded-full border border-[var(--border)] bg-white/60 px-3 py-1 text-[var(--muted)]">Small batch</span>
            </div>
          </div>

          <nav className="grid content-start gap-3 font-sans text-sm md:col-span-4" aria-label="Footer shop navigation">
            <p className={headingClass}>Explore</p>
            <Link className={linkClass} href="/shop">Shop all creations</Link>
            <Link className={linkClass} href="/about">About the studio</Link>
            <Link className={linkClass} href="/contact">Contact us</Link>
            <Link className={linkClass} href="/account">Account</Link>
          </nav>

          <nav className="grid content-start gap-3 font-sans text-sm md:col-span-3" aria-labelledby="footer-policies-heading">
            <p id="footer-policies-heading" className={headingClass}>Policies</p>
            <Link className={linkClass} href="/policies/shipping">Shipping</Link>
            <Link className={linkClass} href="/policies/refunds">Refunds & returns</Link>
            <Link className={linkClass} href="/policies/privacy">Privacy</Link>
            <Link className={linkClass} href="/policies/terms">Terms</Link>
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-[var(--border)] pt-8 font-sans text-xs text-[var(--muted)] md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Twistify Arts. Handmade with care. Prices in INR (₹).</p>
          <p className="rounded-md border border-[var(--border)] bg-[var(--paper)] px-3 py-1">Payments secured by Razorpay</p>
        </div>
      </div>
    </footer>
  );
}
