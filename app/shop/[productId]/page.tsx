import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/app/components/add-to-cart-button";
import { ArtCredits } from "@/app/components/art-credits";
import { ProductPlaceholder } from "@/app/components/product-placeholder";
import { credits, plates } from "@/app/data/art";
import { getProduct } from "@/app/lib/products";
import { formatPrice } from "@/app/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ productId: string }>;
}): Promise<Metadata> {
  const { productId } = await params;
  const product = await getProduct(productId);

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
  const product = await getProduct(productId);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <section className="grid items-center gap-10 px-5 pt-6 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:pt-10">
        <div>
          <h1 data-rise className="text-[length:var(--step-display)] uppercase leading-[0.9]">{product.name}</h1>
          <p data-rise style={{ "--i": 1 } as React.CSSProperties} className="mt-6 text-[length:var(--step-lead)] leading-snug">
            Crocheted by hand by Shraddha Doshi, from the{" "}
            <Link href={`/shop?category=${encodeURIComponent(product.category)}#catalog`} className="text-link">
              {product.category}
            </Link>{" "}
            collection.
          </p>
          <p data-rise style={{ "--i": 1 } as React.CSSProperties} className="mt-10 font-serif text-[length:var(--step-head)] leading-none tabular-nums">
            {formatPrice(product.price)}
          </p>
          <p className="mt-3">{product.availability}</p>
          <p className="mt-8 max-w-[44ch]">{product.description}</p>
          <p className="mt-4 max-w-[44ch] text-[var(--muted)]">
            Every piece is crocheted by hand, so colours and shapes vary a little. Shown as a drawing until photographs are ready.
          </p>
          <AddToCartButton productId={product.id} availability={product.availability} />
        </div>
        <ProductPlaceholder name={product.name} category={product.category} className="aspect-square w-full" />
      </section>

      <section className="mt-32 px-5 sm:px-8" aria-labelledby="flowers-heading">
        <div className="grid gap-6 lg:grid-cols-2">
          <h2 id="flowers-heading" data-reveal className="text-[length:var(--step-head)]">The flowers behind the collection</h2>
          <p data-reveal className="max-w-[44ch]">
            Hibiscus, jasmine, marigold and sunflower, as painters and printmakers kept them: the same flowers Shraddha Doshi crochets in wool.
          </p>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {plates.map((plate, index) => (
            <li key={plate.src} data-reveal style={{ "--i": index } as React.CSSProperties}>
              <figure>
                <div className="relative aspect-[4/5] overflow-hidden bg-[var(--blush)]">
                  <Image src={plate.src} alt={plate.alt} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
                </div>
                <figcaption className="mt-3 text-[length:var(--step-small)] text-[var(--muted)]">{plate.caption}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>
      <ArtCredits credits={credits.slice(0, plates.length)} />
    </main>
  );
}
