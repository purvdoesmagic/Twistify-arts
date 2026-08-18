import { Catalog } from "./components/catalog";
import { products } from "./data/products";

const categories = [
  {
    name: "Flower garlands & malas",
    description: "Hibiscus, jasmine, leaves, and blooms for every celebration.",
    number: "01",
    tone: "from-[#f9d7da] via-[#fdf0e9] to-[#f7ddbd]",
  },
  {
    name: "Floral necklaces",
    description: "Wearable blooms, carefully shaped one petal at a time.",
    number: "02",
    tone: "from-[#f5ddec] via-[#f9f1f7] to-[#e4d9f0]",
  },
  {
    name: "LED flower night lamps",
    description: "Soft glowing lotus, sunflower, daisy, and blooming-duo lights.",
    number: "03",
    tone: "from-[#f8e4ae] via-[#fff5d8] to-[#f5d9ad]",
  },
  {
    name: "Pooja & festival décor",
    description: "Woolen rangoli, Shree, Swastik, and thoughtful festive details.",
    number: "04",
    tone: "from-[#f4d6c9] via-[#fff0e7] to-[#efc7ac]",
  },
  {
    name: "Keychains",
    description: "Little flowers, fruits, and novelty pieces to brighten everyday things.",
    number: "05",
    tone: "from-[#dcebd2] via-[#f5fae8] to-[#f4e7ac]",
  },
  {
    name: "Hair accessories",
    description: "Flower hairbands, playful animal bands, and handmade clips.",
    number: "06",
    tone: "from-[#dce8f4] via-[#edf5fb] to-[#e7dbf0]",
  },
  {
    name: "Flower bouquets",
    description: "Pipe-cleaner sunflowers, lavender, iris, tulips, and more.",
    number: "07",
    tone: "from-[#f8d9c6] via-[#fff0df] to-[#f7dfa5]",
  },
  {
    name: "Flower pot décor",
    description: "Everlasting arrangements that keep a corner feeling cheerful.",
    number: "08",
    tone: "from-[#d6e6d0] via-[#f1f6e9] to-[#f1e1bb]",
  },
  {
    name: "Home details",
    description: "Pen holders, curtain holders, torans, and wall-door hangings.",
    number: "09",
    tone: "from-[#eadbc8] via-[#fbf2e7] to-[#d9e6dc]",
  },
  {
    name: "Decorated phone cases",
    description: "A tiny dose of handmade character for the things you carry.",
    number: "10",
    tone: "from-[#eadcf0] via-[#f9eef3] to-[#f9dfcb]",
  },
];

const values = [
  ["100% handmade", "Every piece begins with patient hands."],
  ["Small batches", "Limited stock keeps each creation special."],
  ["Made to order", "Some favourites are crafted especially for you."],
];

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <a href="#top" className="leading-none" aria-label="Wren and Loom home">
          <span className="block text-xl font-semibold tracking-tight text-[var(--ink)]">
            Wren <span className="text-[var(--rose)]">&amp;</span> Loom
          </span>
          <span className="mt-1 block font-sans text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
            Handmade by Shraddha
          </span>
        </a>

        <nav className="hidden items-center gap-7 font-sans text-sm font-medium text-[var(--muted)] md:flex">
          <a className="transition hover:text-[var(--rose)]" href="#collections">
            Collections
          </a>
          <a className="transition hover:text-[var(--rose)]" href="#story">
            Our story
          </a>
          <a className="transition hover:text-[var(--rose)]" href="#contact">
            Contact
          </a>
        </nav>

        <a
          href="#collections"
          className="rounded-full bg-[var(--ink)] px-4 py-2 font-sans text-xs font-semibold text-white transition hover:bg-[var(--rose)] sm:px-5 sm:text-sm"
        >
          Explore
        </a>
      </header>

      <main id="top">
        <section className="mx-auto grid w-full max-w-7xl gap-12 px-5 pb-20 pt-10 sm:px-8 sm:pb-24 sm:pt-14 lg:grid-cols-[1.06fr_0.94fr] lg:items-center lg:gap-16 lg:px-10 lg:pb-32">
          <div className="max-w-2xl">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.24em] text-[var(--rose)]">
              Handmade for homes, hearts &amp; holy days
            </p>
            <h1 className="mt-5 text-5xl leading-[0.96] tracking-[-0.045em] text-[var(--ink)] sm:text-6xl lg:text-7xl">
              Little works of warmth, made to be kept.
            </h1>
            <p className="mt-7 max-w-xl font-sans text-base leading-7 text-[var(--muted)] sm:text-lg sm:leading-8">
              From flower malas to glowing night lamps, Wren &amp; Loom brings
              joyful handmade details to gifting, festivals, pooja, and the
              corners you call home.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#collections"
                className="rounded-full bg-[var(--rose)] px-6 py-3 font-sans text-sm font-semibold text-white shadow-[0_10px_24px_rgba(173,94,112,0.25)] transition hover:-translate-y-0.5 hover:bg-[#95495b]"
              >
                Browse creations <span aria-hidden="true">→</span>
              </a>
              <a
                href="#story"
                className="rounded-full border border-[var(--border)] bg-white/60 px-6 py-3 font-sans text-sm font-semibold text-[var(--ink)] transition hover:border-[var(--sage)] hover:bg-white"
              >
                Meet the maker
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="rounded-[2.5rem] border border-white/90 bg-[#f3e5d5] p-5 shadow-[0_25px_70px_rgba(84,51,44,0.16)] sm:p-7">
              <div className="min-h-[25rem] rounded-[2rem] bg-[linear-gradient(145deg,#f8d8d4_0%,#fcebd8_46%,#dce8d6_100%)] p-6 sm:min-h-[31rem] sm:p-8">
                <div className="flex items-start justify-between font-sans">
                  <span className="rounded-full bg-white/70 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--rose)]">
                    Made in India
                  </span>
                  <span className="grid size-12 place-items-center rounded-full border border-white/80 bg-white/40 text-lg text-[var(--sage)]">
                    ✦
                  </span>
                </div>

                <div className="mt-20 rounded-[1.6rem] bg-white/75 p-6 shadow-[0_15px_35px_rgba(95,64,52,0.12)] backdrop-blur sm:mt-28 sm:p-8">
                  <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[var(--sage)]">
                    Every loop tells a story
                  </p>
                  <p className="mt-3 text-3xl leading-tight tracking-tight text-[var(--ink)] sm:text-4xl">
                    Crafted slowly. Gifted joyfully.
                  </p>
                  <div className="mt-6 flex gap-3">
                    <span className="h-2 w-16 rounded-full bg-[var(--rose)]" />
                    <span className="h-2 w-9 rounded-full bg-[#e6b950]" />
                    <span className="h-2 w-12 rounded-full bg-[var(--sage)]" />
                  </div>
                </div>
              </div>
            </div>
            <p className="absolute -bottom-4 -left-1 rounded-full border border-[var(--border)] bg-white px-4 py-2 font-sans text-xs font-medium text-[var(--muted)] shadow-sm sm:-left-6">
              100% handmade with love
            </p>
          </div>
        </section>

        <section id="collections" className="bg-white/65 py-20 sm:py-24">
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="max-w-2xl">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.24em] text-[var(--rose)]">
                Find your favourite
              </p>
              <h2 className="mt-4 text-4xl tracking-[-0.035em] text-[var(--ink)] sm:text-5xl">
                A handmade collection for every little occasion.
              </h2>
              <p className="mt-5 font-sans text-base leading-7 text-[var(--muted)]">
                The product photographs and individual listings will arrive in
                the next step. For now, this is the structure customers will use
                to browse your collections.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {categories.map((category) => (
                <a
                  key={category.number}
                  href="#catalog"
                  className="group rounded-[1.6rem] border border-[var(--border)] bg-white p-3 transition hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(84,51,44,0.12)]"
                >
                  <div
                    className={`relative aspect-[5/4] overflow-hidden rounded-[1.1rem] bg-gradient-to-br ${category.tone} p-4`}
                  >
                    <span className="font-sans text-xs font-semibold tracking-[0.18em] text-[var(--muted)]">
                      {category.number}
                    </span>
                    <span className="absolute bottom-4 right-4 grid size-12 place-items-center rounded-full border border-white/80 bg-white/45 text-xl text-white transition group-hover:scale-110">
                      ✦
                    </span>
                    <span className="absolute -right-6 -top-6 size-24 rounded-full border-[14px] border-white/30" />
                  </div>
                  <div className="px-2 pb-2 pt-4">
                    <h3 className="text-xl leading-tight text-[var(--ink)]">
                      {category.name}
                    </h3>
                    <p className="mt-2 font-sans text-sm leading-6 text-[var(--muted)]">
                      {category.description}
                    </p>
                    <span className="mt-4 inline-block font-sans text-sm font-semibold text-[var(--rose)]">
                      Explore <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <Catalog products={products} />

        <section id="story" className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16 lg:px-10">
          <div className="rounded-[2rem] bg-[var(--ink)] p-7 text-white sm:p-10">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.22em] text-[#f6c6d1]">
              Made by Shraddha Doshi
            </p>
            <p className="mt-5 text-4xl leading-tight tracking-[-0.035em] sm:text-5xl">
              Handmade pieces should feel as personal as the moments they mark.
            </p>
          </div>

          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.24em] text-[var(--sage)]">
              Why Wren &amp; Loom
            </p>
            <h2 className="mt-4 text-4xl tracking-[-0.035em] text-[var(--ink)] sm:text-5xl">
              Soft details, made with intention.
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {values.map(([title, description]) => (
                <article
                  key={title}
                  className="rounded-2xl border border-[var(--border)] bg-white/70 p-5"
                >
                  <h3 className="text-xl text-[var(--ink)]">{title}</h3>
                  <p className="mt-2 font-sans text-sm leading-6 text-[var(--muted)]">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="border-t border-[var(--border)] bg-white/70">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 py-10 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-10">
          <div>
            <p className="text-2xl text-[var(--ink)]">Wren &amp; Loom</p>
            <p className="mt-2 font-sans text-sm text-[var(--muted)]">
              Handmade crochet and woolen crafts by Shraddha Doshi.
            </p>
          </div>
          <p className="font-sans text-sm font-semibold text-[var(--rose)]">
            Secure checkout powered by Razorpay
          </p>
        </div>
      </footer>
    </div>
  );
}
