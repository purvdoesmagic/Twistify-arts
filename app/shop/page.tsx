import type { Metadata } from "next";
import { Catalog } from "../components/catalog";
import { Product } from "../models/product";
import { connectToDatabase } from "@/lib/mongodb";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse handmade crochet, woolen, floral, and festive creations from Twistify Arts.",
};

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  await connectToDatabase();
  const products = await Product.find().select("-_id").lean();

  return (
    <main className="min-h-screen bg-[var(--paper)]">
      <section className="mx-auto w-full max-w-7xl px-5 pb-2 pt-12 sm:px-8 sm:pt-16 lg:px-10">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.24em] text-[var(--rose)]">
          Shop Twistify Arts
        </p>
        <h1 className="mt-4 max-w-3xl text-5xl leading-tight tracking-[-0.04em] text-[var(--ink)] sm:text-6xl">
          Handmade details for every little occasion.
        </h1>
        <p className="mt-5 max-w-2xl font-sans text-base leading-7 text-[var(--muted)] sm:text-lg">
          Browse flower garlands, floral accessories, glowing lamps, festive decor, and thoughtful handmade gifts.
        </p>
      </section>
      <Catalog products={products} />
    </main>
  );
}
