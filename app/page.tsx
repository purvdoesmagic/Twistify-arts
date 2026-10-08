import Link from "next/link";
import { Catalog } from "./components/catalog";
import { ProductPlaceholder } from "./components/product-placeholder";
import { Product } from "@/app/models/product";
import { connectToDatabase } from "@/lib/mongodb";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

export default async function Home() {
  await connectToDatabase();
  const products = await Product.find().select("-_id").lean();
  const featuredProducts = products.slice(0, 4);
  const collections = [...new Set(products.map((product) => product.category))];

  return (
    <main id="top">
      <section className="studio-hero mx-auto grid w-full max-w-7xl gap-12 px-5 pb-20 pt-14 sm:px-8 sm:pb-28 sm:pt-20 lg:grid-cols-12 lg:gap-x-10 lg:px-10 lg:pb-36">
        <div className="lg:col-span-8">
          <p className="eyebrow">Twistify Arts · Made by Shraddha Doshi</p>
          <h1 className="mt-6 max-w-4xl text-5xl leading-[0.98] tracking-[-0.045em] text-[var(--ink)] sm:text-6xl lg:text-7xl">
            Handmade details for the moments people keep.
          </h1>
          <p className="mt-7 max-w-2xl font-sans text-base leading-7 text-[var(--muted)] sm:text-lg sm:leading-8">
            Crochet, woolen, floral, and festive creations for gifting, celebrations, pooja, and joyful corners at home.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4 font-sans text-sm font-semibold">
            <Link href="/shop" className="studio-link studio-link-primary">
              Shop all creations
            </Link>
            <a href="#maker" className="studio-link studio-link-quiet">
              A note from the maker
            </a>
          </div>
        </div>

        <aside className="studio-hero-note self-end border-t border-[var(--border)] pt-5 lg:col-span-4 lg:mb-2">
          <p className="eyebrow text-[var(--sage)]">Studio catalogue</p>
          <p className="mt-3 text-2xl leading-snug text-[var(--ink)]">
            Small-batch pieces, with limited stock and made-to-order favourites.
          </p>
        </aside>
      </section>

      <section className="border-y border-[var(--border)] bg-white/40 py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-5 border-b border-[var(--border)] pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow">From the studio</p>
              <h2 className="mt-3 text-4xl leading-tight tracking-[-0.035em] text-[var(--ink)] sm:text-5xl">
                A few pieces from the current catalogue.
              </h2>
            </div>
            <Link href="/shop" className="studio-link studio-link-quiet shrink-0">
              View the full catalogue
            </Link>
          </div>

          <p className="mt-5 max-w-2xl font-sans text-sm leading-6 text-[var(--muted)]">
            Original studio photography is being prepared. These designed listing placeholders are not product photographs.
          </p>

          <div className="mt-10 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <article key={product.id} className="featured-piece">
                <Link href={`/shop/${product.id}`} className="block">
                  <ProductPlaceholder
                    name={product.name}
                    category={product.category}
                    className="aspect-[4/5]"
                  />
                </Link>
                <div className="mt-4 border-t border-[var(--border)] pt-3">
                  <p className="font-sans text-xs font-semibold uppercase tracking-[0.13em] text-[var(--sage)]">
                    {product.category}
                  </p>
                  <div className="mt-2 flex items-start justify-between gap-3 sm:min-h-[2.75rem]">
                    <h3 className="text-xl leading-tight text-[var(--ink)]">
                      <Link href={`/shop/${product.id}`} className="transition hover:text-[var(--rose)]">
                        {product.name}
                      </Link>
                    </h3>
                    <p className="shrink-0 font-sans text-sm font-semibold text-[var(--ink)]">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                  <p className="mt-2 font-sans text-sm text-[var(--muted)]">{product.availability}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <div>
            <p className="eyebrow">Browse by collection</p>
            <h2 className="mt-3 text-4xl leading-tight tracking-[-0.035em] text-[var(--ink)] sm:text-5xl">
              Find the detail that fits the occasion.
            </h2>
          </div>
          <div className="collection-index border-y border-[var(--border)] py-4">
            {collections.map((collection) => (
              <p key={collection} className="border-b border-[rgba(234,216,202,0.72)] py-3 font-sans text-base text-[var(--ink)] last:border-b-0 sm:text-lg">
                {collection}
              </p>
            ))}
            <Link href="/shop" className="studio-link studio-link-quiet mt-5 inline-flex">
              Browse every collection
            </Link>
          </div>
        </div>
      </section>

      <section id="maker" className="maker-note border-y border-[var(--ink)] bg-[var(--ink)] text-[#fffaf6]">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-12 lg:gap-x-10 lg:px-10">
          <div className="lg:col-span-4">
            <p className="eyebrow text-[#f4c7d2]">A note from the maker</p>
            <p className="mt-4 font-sans text-sm leading-6 text-[#ead8ca]">Made by Shraddha Doshi</p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <h2 className="text-4xl leading-[1.08] tracking-[-0.035em] sm:text-5xl">
              Twistify Arts is a collection of handmade crochet and woolen crafts, made for gifting, celebrations, and the corners you call home.
            </h2>
            <Link href="/about" className="studio-link studio-link-light mt-9 inline-flex">
              Read about Twistify Arts
            </Link>
          </div>
        </div>
      </section>

      <Catalog products={products} />
    </main>
  );
}
