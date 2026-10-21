"use client";

import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import { usePathname } from "next/navigation";
import { RevealObserver } from "./reveal-observer";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function StorefrontChrome({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdminRoute) {
    return children;
  }

  return (
    <ReactLenis root options={{ autoRaf: true, anchors: true }}>
      <a href="#content" className="btn sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50">
        Skip to content
      </a>
      <SiteHeader />
      <div id="content" tabIndex={-1} className="outline-none">
        {children}
      </div>
      <SiteFooter />
      <RevealObserver />
    </ReactLenis>
  );
}
