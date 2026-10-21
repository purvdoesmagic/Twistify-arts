"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Reveals [data-reveal] elements once as they enter the viewport. Never replays and never leaves content hidden.
// Elements added later (filtered catalog cards, client-rendered sections) are picked up by the MutationObserver.
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const pending = () => document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)");

    if (!("IntersectionObserver" in window)) {
      pending().forEach((element) => element.classList.add("is-in"));
      return;
    }

    const seen = new WeakSet<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.1 },
    );
    const watch = () =>
      pending().forEach((element) => {
        if (seen.has(element)) return;
        seen.add(element);
        observer.observe(element);
      });
    watch();

    const mutations = new MutationObserver(watch);
    mutations.observe(document.body, { childList: true, subtree: true });

    // Safety net: anything on screen but still hidden after a moment is shown.
    const timer = window.setTimeout(() => {
      pending().forEach((element) => {
        const box = element.getBoundingClientRect();
        if (box.top < window.innerHeight && box.bottom > 0) element.classList.add("is-in");
      });
    }, 2500);

    return () => {
      observer.disconnect();
      mutations.disconnect();
      window.clearTimeout(timer);
    };
  }, [pathname]);

  return null;
}
