import type { Metadata } from "next";
import { Catalog } from "../components/catalog";
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

  return (
    <main className="min-h-screen bg-[var(--paper)]">
      <section className="mx-auto w-full max-w-7xl px-5 pt-12 sm:px-8 sm:pt-16 lg:px-12">
        <header className="max-w-3xl">
          <p className="mb-5 flex items-center gap-2.5 font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--rose-deep)]">
            <span className="h-px w-6 bg-[var(--rose)]" aria-hidden="true" />
            Twistify Arts · Crafted by Shraddha Doshi
          </p>
          <h1 className="text-5xl leading-tight tracking-[-0.04em] text-[var(--ink)] sm:text-6xl">
            Handmade details for every little occasion.
          </h1>
          <p className="mt-5 max-w-2xl font-sans text-base leading-7 text-[var(--muted)] sm:text-lg">
            Browse flower garlands, floral accessories, glowing lamps, festive decor, and thoughtful handmade gifts.
          </p>
          <div className="mt-8 h-px w-full bg-[var(--border)]" aria-hidden="true" />
        </header>
      </section>
      <Catalog
        key={typeof category === "string" ? category : "all"}
        products={products}
        initialCategory={typeof category === "string" ? category : undefined} />
    </main>
  );
}
