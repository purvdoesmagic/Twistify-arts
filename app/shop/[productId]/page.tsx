import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById, products } from "@/app/data/products";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

export function generateStaticParams() {
  return products.map((product) => ({ productId: product.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ productId: string }>;
}): Promise<Metadata> {
  const { productId } = await params;
  const product = getProductById(productId);

  return product
    ? { title: `${product.name} | Twistify Arts`, description: product.description }
    : { title: "Product not found | Twistify Arts" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const product = getProductById(productId);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[var(--paper)]">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <Link href="/" className="block" aria-label="Twistify Arts home">
          <Image
            src="/twistify-arts-logo.svg"
            alt="Twistify Arts"
            width={136}
            height={88}
            priority
            className="h-auto w-24 sm:w-28"
          />
        </Link>
        <Link
          href="/#catalog"
          className="rounded-full border border-[var(--border)] bg-white px-4 py-2 font-sans text-sm font-semibold text-[var(--ink)] transition hover:border-[var(--sage)]"
        >
          Back to shop
        </Link>
      </header>

      <section className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-10 sm:px-8 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:px-10">
        <div className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-white">
          <div className="relative aspect-square bg-[#f7eee6]">
            <Image src={product.image} alt={product.imageAlt} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 font-sans text-xs font-semibold text-[var(--muted)]">
              Temporary image
            </span>
          </div>
        </div>

        <div className="self-center">
          <Link href="/#catalog" className="font-sans text-sm font-semibold text-[var(--rose)]">
            ← All creations
          </Link>
          <p className="mt-7 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[var(--sage)]">
            {product.category}
          </p>
          <h1 className="mt-4 text-5xl leading-tight tracking-[-0.04em] text-[var(--ink)] sm:text-6xl">
            {product.name}
          </h1>
          <p className="mt-6 font-sans text-lg leading-8 text-[var(--muted)]">{product.description}</p>
          <p className="mt-8 text-3xl font-semibold text-[var(--ink)]">{formatPrice(product.price)}</p>
          <p className="mt-2 font-sans text-sm font-semibold text-[var(--rose)]">{product.availability}</p>
          <div className="mt-9 rounded-2xl border border-[var(--border)] bg-white/70 p-5 font-sans text-sm leading-6 text-[var(--muted)]">
            Each Twistify Arts piece is handmade. Colours and small details may vary beautifully from the temporary photo shown here.
          </div>
          <Link
            href="/#catalog"
            className="mt-7 inline-flex rounded-full bg-[var(--rose)] px-6 py-3 font-sans text-sm font-semibold text-white transition hover:bg-[#95495b]"
          >
            {product.availability === "Sold out" ? "Explore other creations" : "Add from the shop"}
          </Link>
        </div>
      </section>
    </main>
  );
}
