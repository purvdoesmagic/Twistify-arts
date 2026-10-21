"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { useCart } from "./cart-provider";

const navLinks = [
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
  const basketLabel = isHydrated ? `Basket (${cartCount})` : "Basket";
  const isActive = (href: string) => pathname.startsWith(href);
  const closeMenu = () => setMenuOpen(false);
  const linkClass = "sweep-link inline-flex min-h-11 items-center";

  return (
    <header className="sticky top-0 z-40 bg-[var(--paper)]" onKeyDown={(event) => event.key === "Escape" && closeMenu()}>
      <div className="flex h-[4.5rem] w-full items-center justify-between gap-6 px-5 sm:px-8">
        <Link href="/" className="font-serif text-[length:var(--step-lead)] uppercase leading-none tracking-tight text-[var(--ink)]">
          Twistify Arts
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {navLinks.map(([href, label]) => (
            <Link key={href} href={href} aria-current={isActive(href) ? "page" : undefined} className={linkClass}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <div className="hidden items-center gap-5 md:flex">
            {isAuthenticated ? (
              <>
                <Link className={linkClass} href="/account" aria-current={isActive("/account") ? "page" : undefined}>
                  Account
                </Link>
                <button type="button" onClick={() => void signOut({ callbackUrl: "/" })} className="min-h-11 text-[var(--muted)] transition-colors hover:text-[var(--ink)]">
                  Sign out
                </button>
              </>
            ) : (
              <Link className={linkClass} href="/login" aria-current={isActive("/login") ? "page" : undefined}>
                Sign in
              </Link>
            )}
          </div>
          <Link href="/cart" className="btn min-h-11 px-4 py-2" aria-label={basketLabel}>
            {basketLabel}
          </Link>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-site-navigation"
            onClick={() => setMenuOpen((open) => !open)}
            className="min-h-11 bg-[var(--blush)] px-3 text-[length:var(--step-small)] text-[var(--ink)] md:hidden"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav id="mobile-site-navigation" className="bg-[var(--cream)] px-5 py-4 shadow-[var(--shadow-soft)] sm:px-8 md:hidden" aria-label="Mobile navigation">
          <div className="grid gap-1 text-[length:var(--step-lead)]">
            {navLinks.map(([href, label]) => (
              <Link key={href} href={href} onClick={closeMenu} aria-current={isActive(href) ? "page" : undefined} className="py-3">
                {label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link className="py-3" href="/account" onClick={closeMenu}>
                  Account
                </Link>
                <button type="button" onClick={() => void signOut({ callbackUrl: "/" })} className="py-3 text-left">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link className="py-3" href="/login" onClick={closeMenu}>
                  Sign in
                </Link>
                <Link className="py-3" href="/signup" onClick={closeMenu}>
                  Create an account
                </Link>
              </>
            )}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
