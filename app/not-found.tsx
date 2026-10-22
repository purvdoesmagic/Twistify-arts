import Image from "next/image";
import Link from "next/link";
import { plates } from "@/app/data/art";

export default function NotFound() {
  const sunflowers = plates[3];

  return (
    <main className="grid items-center gap-10 px-5 pt-10 sm:px-8 lg:grid-cols-2">
      <div>
        <h1 data-rise className="max-w-[12ch] text-(length:--step-display) uppercase leading-[0.9]">This page has wilted</h1>
        <p data-rise style={{ "--i": 1 } as React.CSSProperties} className="mt-8 max-w-[40ch] text-(length:--step-lead) leading-snug">
          The address may be wrong, or the piece may no longer be listed. The rest of the collection is still here.
        </p>
        <Link href="/shop" data-rise style={{ "--i": 2 } as React.CSSProperties} className="btn mt-10">
          Back to the shop
        </Link>
      </div>
      <figure data-reveal>
        <div className="relative aspect-4/5 overflow-hidden bg-(--blush)">
          <Image src={sunflowers.src} alt={sunflowers.alt} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
        <figcaption className="mt-3 text-(length:--step-small) text-(--muted)">{sunflowers.caption}, public domain, Art Institute of Chicago</figcaption>
      </figure>
    </main>
  );
}
