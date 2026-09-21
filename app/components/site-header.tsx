"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { useCart } from "./cart-provider";

export function SiteHeader() {
  const { status } = useSession();
  const { cartCount, isHydrated } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAuthenticated = status === "authenticated";
  const cartLabel = isHydrated ? `Cart (${cartCount})` : "Cart";

  return (
    <header className="border-b border-[var(--border)] bg-[var(--paper)]/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
        <Link href="/" className="shrink-0" aria-label="Twistify Arts home">
          <span className="block text-2xl leading-none text-[var(--ink)]">Twistify Arts</span>
          <span className="mt-1 block font-sans text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[var(--rose)]">
            Handmade with care
          </span>
        </Link>

        <nav className="hidden items-center gap-6 font-sans text-sm font-medium text-[var(--muted)] md:flex" aria-label="Main navigation">
          <Link className="transition hover:text-[var(--rose)]" href="/">
            Home
          </Link>
          <Link className="transition hover:text-[var(--rose)]" href="/shop">
            Shop
          </Link>
          <Link className="transition hover:text-[var(--rose)]" href="/about">
            About
          </Link>
        </nav>

        <div className="hidden items-center gap-3 font-sans text-sm md:flex">
          <Link className="font-semibold text-[var(--muted)] transition hover:text-[var(--rose)]" href="/cart" aria-label={cartLabel}>
            Cart{isHydrated ? <span className="ml-1 text-[var(--rose)]">({cartCount})</span> : null}
          </Link>
          {isAuthenticated ? (
            <>
              <Link className="font-semibold text-[var(--muted)] transition hover:text-[var(--rose)]" href="/account">
                Account
              </Link>
              <button
                type="button"
                onClick={() => void signOut({ callbackUrl: "/" })}
                className="font-semibold text-[var(--muted)] transition hover:text-[var(--rose)]"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link className="font-semibold text-[var(--muted)] transition hover:text-[var(--rose)]" href="/login">
                Sign in
              </Link>
              <Link className="rounded-full bg-[var(--ink)] px-4 py-2 font-semibold text-white transition hover:bg-[var(--rose)]" href="/signup">
                Create account
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/cart"
            aria-label={cartLabel}
            className="rounded-full border border-[var(--border)] px-3 py-2 font-sans text-sm font-semibold text-[var(--ink)]"
          >
            Cart{isHydrated ? ` (${cartCount})` : ""}
          </Link>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-site-navigation"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setMenuOpen((open) => !open)}
            className="grid size-10 place-items-center rounded-full border border-[var(--border)] font-sans text-lg text-[var(--ink)]"
          >
            {menuOpen ? "×" : "☰"}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav id="mobile-site-navigation" className="border-t border-[var(--border)] px-5 py-4 font-sans sm:px-8 md:hidden" aria-label="Mobile navigation">
          <div className="mx-auto grid max-w-7xl gap-1">
            <Link className="rounded-xl px-3 py-3 font-semibold text-[var(--ink)] hover:bg-white" href="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link className="rounded-xl px-3 py-3 font-semibold text-[var(--ink)] hover:bg-white" href="/shop" onClick={() => setMenuOpen(false)}>
              Shop
            </Link>
            <Link className="rounded-xl px-3 py-3 font-semibold text-[var(--ink)] hover:bg-white" href="/about" onClick={() => setMenuOpen(false)}>
              About
            </Link>
            {isAuthenticated ? (
              <>
                <Link className="rounded-xl px-3 py-3 font-semibold text-[var(--ink)] hover:bg-white" href="/account" onClick={() => setMenuOpen(false)}>
                  Account
                </Link>
                <button
                  type="button"
                  onClick={() => void signOut({ callbackUrl: "/" })}
                  className="rounded-xl px-3 py-3 text-left font-semibold text-[var(--ink)] hover:bg-white"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link className="rounded-xl px-3 py-3 font-semibold text-[var(--ink)] hover:bg-white" href="/login" onClick={() => setMenuOpen(false)}>
                  Sign in
                </Link>
                <Link className="rounded-xl px-3 py-3 font-semibold text-[var(--ink)] hover:bg-white" href="/signup" onClick={() => setMenuOpen(false)}>
                  Create account
                </Link>
              </>
            )}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
