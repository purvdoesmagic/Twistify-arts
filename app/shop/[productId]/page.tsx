import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/app/components/add-to-cart-button";
import { ArtCredits } from "@/app/components/art-credits";
import { ProductPlaceholder } from "@/app/components/product-placeholder";
import { credits, plates } from "@/app/data/art";
import { getProduct, getProducts } from "@/app/lib/products";
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

  const related = (await getProducts(product.category)).filter((item) => item.id !== product.id).slice(0, 4);
  const schemaAvailability = {
    "In stock": "https://schema.org/InStock",
    "Made to order": "https://schema.org/PreOrder",
    "Sold out": "https://schema.org/OutOfStock",
  }[product.availability];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    category: product.category,
    brand: { "@type": "Brand", name: "Twistify Arts" },
    offers: { "@type": "Offer", price: product.price, priceCurrency: "INR", availability: schemaAvailability },
  };

  return (
    <main className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <nav aria-label="Breadcrumb" className="px-5 pt-4 text-(length:--step-small) text-(--muted) sm:px-8">
        <ol className="flex flex-wrap items-center gap-x-2">
          <li><Link href="/shop" className="text-link">Shop</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href={`/shop?category=${encodeURIComponent(product.category)}#catalog`} className="text-link">{product.category}</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-(--ink)">{product.name}</li>
        </ol>
      </nav>
      <section className="grid items-start gap-10 px-5 pt-6 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:pt-10">
        <div>
          <h1 data-rise className="text-(length:--step-display) uppercase leading-[0.9]">{product.name}</h1>
          <p data-rise style={{ "--i": 1 } as React.CSSProperties} className="mt-6 text-(length:--step-lead) leading-snug">
            Crocheted by hand by Shraddha Doshi, from the{" "}
            <Link href={`/shop?category=${encodeURIComponent(product.category)}#catalog`} className="text-link">
              {product.category}
            </Link>{" "}
            collection.
          </p>
          <p data-rise style={{ "--i": 1 } as React.CSSProperties} className="mt-10 font-serif text-(length:--step-head) leading-none tabular-nums">
            {formatPrice(product.price)}
          </p>
          <p className="mt-3">{product.availability}</p>
          <p className="mt-8 max-w-[44ch]">{product.description}</p>
          <p className="mt-4 max-w-[44ch] text-(--muted)">
            Every piece is crocheted by hand, so colours and shapes vary a little. Shown as a drawing until photographs are ready.
          </p>
          <AddToCartButton productId={product.id} availability={product.availability} />
          <ul className="mt-8 max-w-[44ch] space-y-2 text-(length:--step-small) text-(--muted)">
            <li>Crocheted by hand by Shraddha Doshi</li>
            <li>
              {product.availability === "Made to order"
                ? "Made once you order, so it takes a little longer than a ready piece"
                : product.availability === "In stock"
                  ? "Ready now, packed after you order"
                  : "Currently sold out"}
            </li>
            <li>Secure payment through Razorpay, in rupees</li>
            <li>
              Want another colour or size? <Link href="/contact" className="text-link">Ask the studio</Link>
            </li>
          </ul>
          <div className="mt-8 max-w-[44ch] divide-y divide-(--border) border-y border-(--border)">
            {[
              ["Delivery", <>Charges and timing are confirmed at checkout and vary by address. Read the <Link key="s" href="/policies/shipping" className="text-link">shipping policy</Link>.</>],
              ["Returns", <>Handmade pieces are covered by our <Link key="r" href="/policies/refunds" className="text-link">refund policy</Link>. Contact us first if something arrives wrong.</>],
              ["Handmade variation", "Colours, petal shapes and sizes vary a little from piece to piece. That is part of it."],
            ].map(([title, body]) => (
              <details key={String(title)} className="group py-1">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between">
                  {title}
                  <span aria-hidden="true" className="text-(--muted) transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="pb-3 text-(length:--step-small) text-(--muted)">{body}</p>
              </details>
            ))}
          </div>
        </div>
        <div className="lg:sticky lg:top-24">
          <ProductPlaceholder name={product.name} category={product.category} className="aspect-square w-full" />
        </div>
      </section>

      {related.length > 0 ? (
        <section className="mt-24 px-5 sm:px-8" aria-labelledby="related-heading">
          <h2 id="related-heading" data-reveal className="text-(length:--step-head)">More from this collection</h2>
          <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
            {related.map((item, index) => (
              <li key={item.id} data-reveal style={{ "--i": index } as React.CSSProperties}>
                <Link href={`/shop/${item.id}`} className="block">
                  <ProductPlaceholder name={item.name} category={item.category} className="aspect-4/5" />
                  <p className="mt-3 text-(length:--step-lead) leading-tight">{item.name}</p>
                  <p className="mt-1 text-(--muted)">{formatPrice(item.price)} · {item.availability}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-32 px-5 sm:px-8" aria-labelledby="flowers-heading">
        <div className="grid gap-6 lg:grid-cols-2">
          <h2 id="flowers-heading" data-reveal className="text-(length:--step-head)">The flowers behind the collection</h2>
          <p data-reveal className="max-w-[44ch]">
            Hibiscus, jasmine, marigold and sunflower, as painters and printmakers kept them: the same flowers Shraddha Doshi crochets in wool.
          </p>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {plates.map((plate, index) => (
            <li key={plate.src} data-reveal style={{ "--i": index } as React.CSSProperties}>
              <figure>
                <div className="relative aspect-4/5 overflow-hidden bg-(--blush)">
                  <Image src={plate.src} alt={plate.alt} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
                </div>
                <figcaption className="mt-3 text-(length:--step-small) text-(--muted)">{plate.caption}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>
      <ArtCredits credits={credits.slice(0, plates.length)} />
    </main>
  );
}
