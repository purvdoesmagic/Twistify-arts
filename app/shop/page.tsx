import type { Metadata } from "next";
import Image from "next/image";
import { ArtCredits } from "../components/art-credits";
import { Catalog } from "../components/catalog";
import { credits, plates } from "@/app/data/art";
import { formatPrice } from "@/app/lib/format";
import { getProducts } from "@/app/lib/products";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse handmade crochet, woolen, floral, and festive creations from Twistify Arts.",
};

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const { category } = await searchParams;
  const products = await getProducts();
  const collections = new Set(products.map((product) => product.category)).size;
  const lowest = products.length ? Math.min(...products.map((product) => product.price)) : 0;

  return (
    <main className="min-h-screen">
      <section className="px-5 pt-10 sm:px-8 lg:pt-16" aria-labelledby="shop-heading">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <h1 id="shop-heading" data-rise className="text-[length:var(--step-display)] uppercase leading-[0.9] lg:col-span-7">
            The whole collection
          </h1>
          <p data-rise style={{ "--i": 1 } as React.CSSProperties} className="max-w-[38ch] text-[length:var(--step-lead)] leading-snug lg:col-span-5">
            {products.length} pieces in {collections} collections, from {formatPrice(lowest)}, each crocheted by Shraddha Doshi. Pieces are shown as drawings until photographs are ready.
          </p>
        </div>
        <ul className="mt-12 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {plates.map((plate, index) => (
            <li key={plate.src} data-reveal style={{ "--i": index } as React.CSSProperties}>
              <figure>
                <div className="relative aspect-[4/5] overflow-hidden bg-[var(--blush)]">
                  <Image src={plate.src} alt={plate.alt} fill priority={index < 2} sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
                </div>
                <figcaption className="mt-3 text-[length:var(--step-small)] text-[var(--muted)]">{plate.caption}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>
      <Catalog
        key={typeof category === "string" ? category : "all"}
        products={products}
        initialCategory={typeof category === "string" ? category : undefined}
      />
      <ArtCredits credits={credits.slice(0, plates.length)} />
    </main>
  );
}
