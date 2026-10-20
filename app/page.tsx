import Link from "next/link";
import { Catalog } from "./components/catalog";
import { ProductPlaceholder } from "./components/product-placeholder";
import { getProducts } from "@/app/lib/products";
import { formatPrice } from "@/app/lib/format";

export const dynamic = "force-dynamic";

const eyebrowClass = "font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--rose)]";

const promises = [
  ["In stock or made to order", "Availability is shown on every piece."],
  ["Gifting and festivals", "Garlands, lamps, torans, bouquets, and more."],
  ["Delivery confirmed at checkout", "Charges and timeline depend on your address."],
] as const;

export default async function Home() {
  const products = await getProducts();
  const featuredProducts = products.slice(0, 4);
  const collections = [...new Set(products.map((product) => product.category))].map((category) => ({
    name: category,
    count: products.filter((product) => product.category === category).length,
  }));
  const prices = products.map((product) => product.price);

  return (
    <main id="top">
      <section className="relative overflow-hidden">
        <svg
          className="yarn-thread pointer-events-none absolute -right-10 top-6 hidden h-auto w-[min(640px,55%)] opacity-60 md:block"
          viewBox="0 0 640 520"
          aria-hidden="true"
        >
          <path className="yarn-rose" d="M-10 420 C 120 300, 200 520, 300 380 S 470 120, 380 200 S 230 420, 400 300 S 600 60, 660 160" />
          <path className="yarn-sage" d="M-10 470 C 160 360, 240 540, 340 420 S 500 180, 420 250 S 290 450, 450 350 S 620 130, 670 210" />
        </svg>

        <div className="relative mx-auto grid w-full max-w-7xl items-start gap-12 px-5 pb-20 pt-12 sm:px-8 md:py-24 lg:grid-cols-12 lg:gap-16 lg:px-12">
          <div className="lg:col-span-8">
            <p className={`mb-6 flex items-center gap-2.5 ${eyebrowClass}`}>
              <span className="h-px w-6 bg-[var(--rose)]" aria-hidden="true" />
              Twistify Arts · Made by Shraddha Doshi
            </p>
            <h1 className="max-w-4xl text-5xl leading-[1.05] tracking-[-0.035em] text-balance text-[var(--ink)] sm:text-6xl lg:text-7xl">
              Handmade details for the moments people keep.
            </h1>
            <p className="mt-7 max-w-2xl font-sans text-base leading-7 text-[var(--muted)] sm:text-lg sm:leading-8">
              Crochet, woolen, floral, and festive creations for gifting, celebrations, pooja, and joyful corners at home.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6 font-sans text-sm">
              <Link
                href="/shop"
                className="inline-flex rounded-full bg-[var(--ink)] px-8 py-3.5 font-semibold text-[var(--paper)] shadow-sm transition-colors hover:bg-[var(--rose)]"
              >
                Shop all creations
              </Link>
              <a
                href="#maker"
                className="group inline-flex items-center gap-1.5 border-b border-[rgba(51,39,34,0.4)] pb-0.5 text-[var(--ink)] transition-colors hover:border-[var(--rose)] hover:text-[var(--rose)]"
              >
                A note from the maker
                <span className="text-xs transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          <aside className="rounded-2xl border border-[var(--border)] bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-8 lg:col-span-4">
            <div className="flex items-center justify-between border-b border-[rgba(234,216,202,0.6)] pb-4">
              <p className="font-sans text-[11px] font-bold uppercase tracking-widest text-[var(--sage)]">Studio catalogue</p>
              <p className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(116,138,112,0.1)] px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wider text-[var(--sage)]">
                <span className="size-1.5 rounded-full bg-[var(--sage)]" aria-hidden="true" />
                {products.length} pieces
              </p>
            </div>
            <p className="mt-6 text-lg italic leading-relaxed text-[var(--ink)]">
              “Small-batch pieces, with limited stock and made-to-order favourites.”
            </p>
            <ul className="mt-6 space-y-3 font-sans text-sm text-[var(--muted)]">
              <li className="flex items-center gap-3">
                <span className="size-1.5 rounded-full bg-[var(--sage)]" aria-hidden="true" />
                Handmade crochet & woolen crafts
              </li>
              {prices.length > 0 ? (
                <li className="flex items-center gap-3">
                  <span className="size-1.5 rounded-full bg-[var(--rose)]" aria-hidden="true" />
                  {formatPrice(Math.min(...prices))} to {formatPrice(Math.max(...prices))} gifting
                </li>
              ) : null}
              <li className="flex items-center gap-3">
                <span className="size-1.5 rounded-full bg-[var(--ink)]" aria-hidden="true" />
                {collections.length} collections to explore
              </li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-[rgba(252,248,243,0.6)] py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className={eyebrowClass}>From the studio</p>
              <h2 className="mt-2 text-3xl tracking-tight text-[var(--ink)] sm:text-4xl">A few pieces from the current catalogue</h2>
            </div>
            <Link
              href="/shop"
              className="self-start border-b border-[rgba(51,39,34,0.3)] pb-0.5 font-sans text-sm font-semibold text-[var(--ink)] transition-colors hover:border-[var(--rose)] hover:text-[var(--rose)] md:self-auto"
            >
              View the full catalogue ({products.length} creations) →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {featuredProducts.map((product) => (
              <article key={product.id} className="product-card">
                <Link href={`/shop/${product.id}`} className="block">
                  <ProductPlaceholder name={product.name} category={product.category} className="aspect-[4/5]" />
                </Link>
                <div className="flex flex-grow flex-col pt-4">
                  <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--sage)]">{product.category}</p>
                  <h3 className="mt-1 text-xl leading-snug text-[var(--ink)]">
                    <Link href={`/shop/${product.id}`} className="transition-colors hover:text-[var(--rose)]">
                      {product.name}
                    </Link>
                  </h3>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                    <p className="font-sans text-lg font-semibold text-[var(--ink)]">{formatPrice(product.price)}</p>
                    <span className="rounded-full bg-[var(--blush)] px-2.5 py-0.5 font-sans text-xs font-medium text-[var(--rose)]">
                      {product.availability}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 md:py-28 lg:px-12">
        <div className="grid items-start gap-12 lg:grid-cols-12">
          <div className="lg:sticky lg:top-36 lg:col-span-4">
            <p className={eyebrowClass}>Collections</p>
            <h2 className="mt-3 text-3xl tracking-tight text-[var(--ink)] sm:text-4xl">Find the right piece for pooja, home, or gifting.</h2>
            <p className="mt-4 font-sans text-sm leading-6 text-[var(--muted)]">
              Each collection is made around a celebration or a corner of home — pick one to see its pieces.
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-flex items-center gap-1.5 border-b border-[rgba(51,39,34,0.4)] pb-0.5 font-sans text-sm font-medium text-[var(--ink)] transition-colors hover:border-[var(--rose)] hover:text-[var(--rose)]"
            >
              Browse every collection <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="divide-y divide-[var(--border)] border-y border-[var(--border)] lg:col-span-8">
            {collections.map((collection) => (
              <Link
                key={collection.name}
                href={`/shop?category=${encodeURIComponent(collection.name)}#catalog`}
                className="group flex items-center justify-between gap-4 px-2 py-5 transition-colors hover:bg-[var(--cream)]"
              >
                <span className="flex items-center gap-4">
                  <span
                    className="grid size-8 shrink-0 place-items-center rounded-full bg-[#f6eee7] text-[var(--sage)] transition-colors group-hover:bg-[var(--ink)] group-hover:text-[var(--paper)]"
                    aria-hidden="true"
                  >
                    ✿
                  </span>
                  <span className="text-lg text-[var(--ink)] transition-colors group-hover:text-[var(--rose)]">{collection.name}</span>
                </span>
                <span className="flex shrink-0 items-center gap-3 font-sans text-xs text-[var(--muted)]">
                  {collection.count} {collection.count === 1 ? "creation" : "creations"}
                  <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="maker" className="scroll-mt-32 px-4 sm:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[var(--ink)] px-8 py-16 text-[var(--paper)] sm:px-16 sm:py-24">
          <div className="pointer-events-none absolute -bottom-20 -right-20 size-96 rounded-full border border-white/5" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-32 right-10 size-80 rounded-full border border-[rgba(173,94,112,0.15)]" aria-hidden="true" />
          <div className="relative max-w-3xl">
            <p className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-[#f4c7d2]">A note from the maker · Shraddha Doshi</p>
            <h2 className="mt-4 text-3xl leading-[1.18] tracking-tight sm:text-4xl">
              Twistify Arts is a collection of handmade crochet and woolen crafts, made for gifting, celebrations, and the corners you call home.
            </h2>
            <p className="mt-6 font-sans text-base leading-7 text-[rgba(246,238,231,0.8)]">
              Small variations from one piece to another are part of handmade work — each creation carries its own character.
            </p>
            <Link
              href="/about"
              className="mt-10 inline-flex items-center gap-2 border-b border-[rgba(255,250,246,0.4)] pb-0.5 font-sans text-sm transition-colors hover:border-[#f4c7d2] hover:text-[#f4c7d2]"
            >
              Read about Twistify Arts <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <Catalog products={products} />

      <section className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8 lg:px-12">
        <div className="grid gap-6 rounded-2xl border border-[#efd9a9] bg-[#fff5df] p-6 text-[#72573d] sm:p-8 md:grid-cols-3">
          {promises.map(([title, text]) => (
            <div key={title}>
              <h3 className="font-sans text-sm font-bold tracking-tight">{title}</h3>
              <p className="mt-1 font-sans text-xs leading-relaxed text-[rgba(114,87,61,0.9)]">{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-[var(--border)] bg-white/70 p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <h2 className="text-2xl text-[var(--ink)]">Questions or custom requests?</h2>
            <p className="mt-1 font-sans text-sm text-[var(--muted)]">Share your phone model for cases, or ask about colours. We reply by email.</p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 rounded-full bg-[var(--rose)] px-6 py-3 font-sans text-sm font-semibold text-white transition-colors hover:bg-[#95495b]"
          >
            Contact Twistify Arts
          </Link>
        </div>
      </section>
    </main>
  );
}
