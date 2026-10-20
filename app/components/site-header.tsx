"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { useCart } from "./cart-provider";

const navLinks = [
  ["/", "Home"],
  ["/shop", "Shop"],
  ["/about", "About"],
  ["/contact", "Contact"],
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const { status } = useSession();
  const { cartCount, isHydrated } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAuthenticated = status === "authenticated";
  const cartLabel = isHydrated ? `Cart (${cartCount})` : "Cart";
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-40">
      <p className="flex items-center justify-center gap-2 border-b border-[var(--border)] bg-[var(--cream)] px-4 py-2 text-center font-sans text-xs font-medium tracking-wide text-[var(--muted)]">
        <span className="size-1.5 shrink-0 animate-pulse rounded-full bg-[var(--sage)]" aria-hidden="true" />
        <span>
          Handmade in small batches
          <span className="px-1.5 text-[var(--border)]" aria-hidden="true">·</span>
          In stock or made to order
          <span className="hidden sm:inline">
            <span className="px-1.5 text-[var(--border)]" aria-hidden="true">·</span>
            Secure Razorpay checkout
          </span>
        </span>
      </p>

      <div className="border-b border-[var(--border)] bg-[rgba(255,250,246,0.9)] backdrop-blur-md">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
          <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="Twistify Arts home">
            <Image src="/twistify-arts-mark.svg" alt="" width={40} height={40} priority className="size-10" />
            <span className="text-lg tracking-tight text-[var(--ink)] sm:text-xl">Twistify Arts</span>
          </Link>

          <nav className="hidden items-center gap-8 font-sans text-sm md:flex" aria-label="Main navigation">
            {navLinks.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                aria-current={isActive(href) ? "page" : undefined}
                className={
                  isActive(href)
                    ? "border-b-2 border-[var(--rose)] pb-1 font-semibold text-[var(--rose)]"
                    : "pb-1 text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
                }
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 font-sans text-sm">
            <Link
              href="/cart"
              aria-label={cartLabel}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2 font-semibold text-[var(--ink)] transition-colors hover:border-[var(--rose)]"
            >
              Cart
              {isHydrated ? (
                <span className="grid size-5 place-items-center rounded-full bg-[var(--rose)] text-[11px] font-bold text-white">
                  {cartCount}
                </span>
              ) : null}
            </Link>
            <div className="hidden items-center gap-4 md:flex">
              {isAuthenticated ? (
                <>
                  <Link className="font-semibold text-[var(--ink)] transition-colors hover:text-[var(--rose)]" href="/account">
                    Account
                  </Link>
                  <button
                    type="button"
                    onClick={() => void signOut({ callbackUrl: "/" })}
                    className="font-semibold text-[var(--muted)] transition-colors hover:text-[var(--rose)]"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link className="font-semibold text-[var(--ink)] transition-colors hover:text-[var(--rose)]" href="/login">
                    Sign in
                  </Link>
                  <Link className="rounded-full bg-[var(--ink)] px-4 py-2 font-semibold text-white transition-colors hover:bg-[var(--rose)]" href="/signup">
                    Create account
                  </Link>
                </>
              )}
            </div>
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-site-navigation"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              onClick={() => setMenuOpen((open) => !open)}
              className="grid size-10 place-items-center rounded-full border border-[var(--border)] bg-white text-lg text-[var(--ink)] md:hidden"
            >
              {menuOpen ? "×" : "☰"}
            </button>
          </div>
        </div>

        {menuOpen ? (
          <nav id="mobile-site-navigation" className="border-t border-[var(--border)] px-5 py-4 font-sans sm:px-8 md:hidden" aria-label="Mobile navigation">
            <div className="mx-auto grid max-w-7xl gap-1">
              {navLinks.map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMenu}
                  aria-current={isActive(href) ? "page" : undefined}
                  className={`rounded-xl px-3 py-3 font-semibold hover:bg-white ${isActive(href) ? "text-[var(--rose)]" : "text-[var(--ink)]"}`}
                >
                  {label}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <Link className="rounded-xl px-3 py-3 font-semibold text-[var(--ink)] hover:bg-white" href="/account" onClick={closeMenu}>
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
                  <Link className="rounded-xl px-3 py-3 font-semibold text-[var(--ink)] hover:bg-white" href="/login" onClick={closeMenu}>
                    Sign in
                  </Link>
                  <Link className="rounded-xl px-3 py-3 font-semibold text-[var(--ink)] hover:bg-white" href="/signup" onClick={closeMenu}>
                    Create account
                  </Link>
                </>
              )}
            </div>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
