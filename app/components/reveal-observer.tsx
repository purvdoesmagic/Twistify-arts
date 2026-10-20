"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Reveals [data-reveal] elements once as they enter the viewport. Never replays and never leaves content hidden.
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)");

    if (!("IntersectionObserver" in window)) {
      targets.forEach((element) => element.classList.add("is-in"));
      return;
    }

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
    targets.forEach((element) => observer.observe(element));

    // Safety net: anything on screen but still hidden after a moment is shown.
    const timer = window.setTimeout(() => {
      targets.forEach((element) => {
        const box = element.getBoundingClientRect();
        if (box.top < window.innerHeight && box.bottom > 0) element.classList.add("is-in");
      });
    }, 2500);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [pathname]);

  return null;
}
