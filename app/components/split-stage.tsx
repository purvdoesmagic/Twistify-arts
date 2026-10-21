"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type Plate = { src: string; alt: string; caption: string; source: string };

// The picture half holds still while the reading half scrolls; it changes to the plate of the section in view.
export function SplitStage({ plates, children }: { plates: Plate[]; children: React.ReactNode }) {
  const readingRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const sections = readingRef.current?.querySelectorAll<HTMLElement>("[data-plate]");
    if (!sections?.length || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setCurrent(Number(entry.target.getAttribute("data-plate")));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const plate = plates[current] ?? plates[0];

  return (
    <div className="grid gap-3 px-5 sm:px-8 lg:grid-cols-2">
      <div className="stage-plate sticky top-[4.75rem] order-first h-[46svh] overflow-hidden bg-[var(--blush)] lg:order-last lg:top-[5.25rem] lg:h-[calc(100svh-6rem)]">
        {/* next/image's fill check doesn't accept a sticky parent, so the plates sit in their own positioned layer. */}
        <div className="absolute inset-0">
          {plates.map((item, index) => (
            <Image
              key={item.src}
              src={item.src}
              alt={item.alt}
              fill
              priority={index === 0}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className={`object-cover ${index === current ? "is-current" : ""}`}
            />
          ))}
        </div>
        <p className="absolute inset-x-0 bottom-0 flex min-h-12 items-center justify-between gap-4 bg-[var(--paper)] px-4 py-2 text-[length:var(--step-small)] text-[var(--ink)]">
          <span>{plate.caption}</span>
          <span className="hidden shrink-0 text-[var(--muted)] sm:inline">{plate.source}</span>
        </p>
      </div>
      <div ref={readingRef} className="relative z-10 min-w-0 bg-[var(--paper)]">
        {children}
      </div>
    </div>
  );
}
