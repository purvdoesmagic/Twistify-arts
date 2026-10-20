import Image from "next/image";
import Link from "next/link";
import { ArtCredits } from "./art-credits";
import { credits, plates } from "@/app/data/art";

type InfoPageProps = {
  title: string;
  intro: string;
  plate?: number;
  gallery?: boolean;
  children: React.ReactNode;
};

export function InfoPage({ title, intro, plate = 0, gallery = false, children }: InfoPageProps) {
  const picture = plates[plate] ?? plates[0];

  return (
    <main className="min-h-screen">
      <section className="grid items-center gap-10 px-5 pt-10 sm:px-8 lg:grid-cols-2 lg:pt-16">
        <div>
          <h1 data-rise className="max-w-[14ch] text-[length:var(--step-display)] uppercase leading-[0.9]">
            {title}
          </h1>
          <p data-rise style={{ "--i": 1 } as React.CSSProperties} className="mt-8 max-w-[40ch] text-[length:var(--step-lead)] leading-snug">
            {intro}
          </p>
        </div>
        <figure data-reveal>
          <div className="relative aspect-[4/3] overflow-hidden bg-[var(--blush)] lg:aspect-[5/4]">
            <Image src={picture.src} alt={picture.alt} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <figcaption className="mt-3 text-[length:var(--step-small)] text-[var(--muted)]">{picture.caption}</figcaption>
        </figure>
      </section>
      <div className="mt-32 space-y-24 px-5 sm:px-8">{children}</div>
      {gallery ? (
        <section className="mt-32 px-5 sm:px-8" aria-labelledby="gallery-heading">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
            <h2 id="gallery-heading" data-reveal className="text-[length:var(--step-head)]">The flowers behind the collection</h2>
            <p data-reveal className="max-w-[44ch]">Hibiscus, jasmine, marigold and sunflower, as painters and printmakers kept them: the same flowers crocheted here in wool.</p>
          </div>
          <ul className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {plates.map((item, index) => (
              <li key={item.src} data-reveal style={{ "--i": index } as React.CSSProperties}>
                <figure>
                  <div className="relative aspect-[4/5] overflow-hidden bg-[var(--blush)]">
                    <Image src={item.src} alt={item.alt} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
                  </div>
                  <figcaption className="mt-3 text-[length:var(--step-small)] text-[var(--muted)]">{item.caption}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <ArtCredits credits={gallery ? credits.slice(0, plates.length) : [credits[plates.indexOf(picture)]]} />
    </main>
  );
}

export function InfoSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section data-reveal className="grid gap-6 lg:grid-cols-2 lg:gap-10">
      <h2 className="text-[length:var(--step-head)]">{title}</h2>
      <div className="max-w-[60ch] space-y-4">{children}</div>
    </section>
  );
}

export function PolicyLinks() {
  return (
    <nav className="flex flex-wrap gap-x-6 gap-y-2 pt-2" aria-label="Policy navigation">
      <Link href="/policies/shipping" className="text-link">Shipping</Link>
      <Link href="/policies/refunds" className="text-link">Refunds & returns</Link>
      <Link href="/policies/privacy" className="text-link">Privacy</Link>
      <Link href="/policies/terms" className="text-link">Terms</Link>
    </nav>
  );
}
