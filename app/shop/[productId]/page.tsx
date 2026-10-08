import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/app/components/add-to-cart-button";
import { ProductPlaceholder } from "@/app/components/product-placeholder";
import { Product } from "@/app/models/product";
import { connectToDatabase } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ productId: string }>;
}): Promise<Metadata> {
  const { productId } = await params;
  await connectToDatabase();
  const product = await Product.findOne({ id: productId }).select("-_id").lean();

  return product
    ? { title: product.name, description: product.description }
    : { title: "Product not found" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  await connectToDatabase();
  const product = await Product.findOne({ id: productId }).select("-_id").lean();

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[var(--paper)]">
      <section className="mx-auto grid w-full max-w-7xl gap-12 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-2 lg:gap-20 lg:px-10">
        <div className="product-detail-media border border-[var(--border)] bg-white p-3">
          <ProductPlaceholder
            name={product.name}
            category={product.category}
            className="aspect-square"
          />
        </div>

        <div className="self-center">
          <Link href="/shop" className="font-sans text-sm font-semibold text-[var(--rose)]">
            ← All creations
          </Link>
          <p className="mt-7 font-sans text-sm font-semibold text-[var(--sage)]">
            {product.category}
          </p>
          <h1 className="mt-4 text-5xl leading-tight tracking-[-0.04em] text-[var(--ink)] sm:text-6xl">
            {product.name}
          </h1>
          <p className="mt-6 font-sans text-lg leading-8 text-[var(--muted)]">{product.description}</p>
          <div className="mt-8 h-px w-full bg-[var(--border)]" aria-hidden="true" />
          <p className="mt-8 text-4xl font-semibold tracking-[-0.04em] text-[var(--ink)]">{formatPrice(product.price)}</p>
          <p className="mt-2 font-sans text-sm font-semibold text-[var(--rose)]">{product.availability}</p>
          <div className="mt-9 rounded-xl border border-[var(--border)] bg-white/70 p-5 font-sans text-sm leading-6 text-[var(--muted)]">
            Each Twistify Arts piece is handmade. Original studio photography is coming soon; this is a designed placeholder, not a product photograph.
          </div>
          <AddToCartButton productId={product.id} availability={product.availability} />
        </div>
      </section>
    </main>
  );
}
