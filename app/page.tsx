import Image from "next/image";
import Link from "next/link";
import { BudgetFinder } from "./components/budget-finder";
import { LampShowcase } from "./components/lamp-showcase";
import { LoopVideo } from "./components/loop-video";
import { SplitStage } from "./components/split-stage";
import { ArtCredits } from "./components/art-credits";
import { credits, plates } from "@/app/data/art";
import { getProducts } from "@/app/lib/products";
import { formatPrice } from "@/app/lib/format";

export const dynamic = "force-dynamic";

const dots = ["var(--sage)", "var(--rose)", "var(--ink)"];

const slip = [
  {
    stage: "Today",
    rows: [
      ["Choose your pieces", "up to 10 of each"],
      ["Pay through Razorpay", "in rupees"],
    ],
  },
  {
    stage: "While it is made",
    rows: [
      ["In-stock pieces packed", "ready now"],
      ["Made-to-order pieces crocheted", "by hand"],
    ],
  },
  {
    stage: "At your door",
    rows: [
      ["Delivery confirmed at checkout", "per address"],
      ["Follow it in your account", "any time"],
    ],
  },
];

const email = "twistifyarts@gmail.com";

export default async function Home() {
  const products = await getProducts();
  const prices = products.map((product) => product.price);
  const lowest = prices.length ? Math.min(...prices) : 0;
  const collections = [...new Set(products.map((product) => product.category))].map((name) => {
    const items = products.filter((product) => product.category === name);
    return { name, count: items.length, from: Math.min(...items.map((item) => item.price)) };
  });
  const lamps = products.filter((product) => product.category === "LED flower night lamps");

  return (
    <main id="top">
      <SplitStage plates={plates}>
        <section data-plate="0" className="flex flex-col justify-center pb-16 pt-10 sm:px-12 lg:min-h-[calc(100svh-6rem)] lg:px-16 lg:py-16">
          <h1 data-rise className="max-w-[12ch] text-[length:var(--step-display)] uppercase leading-[0.9]">
            Flowers that never wilt
          </h1>
          <p data-rise style={{ "--i": 1 } as React.CSSProperties} className="mt-10 max-w-[34ch] text-[length:var(--step-lead)] leading-snug">
            Garlands, lamps, torans and small gifts, crocheted in wool by Shraddha Doshi. From {formatPrice(lowest)}.
          </p>
          <div data-rise style={{ "--i": 2 } as React.CSSProperties} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link href="/shop" className="btn">
              Shop all {products.length} pieces
            </Link>
            <a href="#budget" className="text-link">
              Find one for your budget
            </a>
          </div>
        </section>

        <section data-plate="1" className="py-24 sm:px-12 lg:px-16 lg:py-40" aria-labelledby="lasting-heading">
          <h2 id="lasting-heading" data-reveal className="text-[length:var(--step-head)]">A garland that lasts</h2>
          <div className="mt-10 max-w-[42ch] space-y-5">
            <p data-reveal className="font-medium">
              A fresh jasmine garland is gone by evening. In Tamil Nadu and Kerala, jewellers have long shaped necklaces after jasmine buds; the one beside this text is from the nineteenth century.
            </p>
            <p data-reveal style={{ "--i": 1 } as React.CSSProperties}>
              Twistify Arts does the same with wool. Hibiscus, jasmine, marigold, lotus and sunflower are crocheted petal by petal, so the flower on your door or your mandir is still there after the festival.
            </p>
            <p data-reveal style={{ "--i": 2 } as React.CSSProperties}>
              Every piece is made by hand by Shraddha Doshi, so no two are quite alike. Some are ready to send; most are made once you order, and each listing says which.
            </p>
            <p data-reveal style={{ "--i": 3 } as React.CSSProperties}>
              Want a colour, a size or a phone model the shop does not list? <Link href="/contact" className="text-link">Ask before you order.</Link>
            </p>
          </div>
        </section>

        {products.length > 0 ? (
        <section id="budget" data-plate="2" className="scroll-mt-24 bg-[var(--cream)] px-5 py-24 sm:px-12 lg:px-16 lg:py-32" aria-labelledby="budget-heading">
          <h2 id="budget-heading" data-reveal className="text-[length:var(--step-head)]">A piece for every budget</h2>
          <p data-reveal style={{ "--i": 1 } as React.CSSProperties} className="mt-6 max-w-[40ch]">
            Slide to what you would like to spend and see every piece at or under it.
          </p>
          <div data-reveal style={{ "--i": 2 } as React.CSSProperties} className="mt-10 max-w-[34rem]">
            <BudgetFinder
              pieces={products.map(({ id, name, price, availability }) => ({ id, name, price, availability }))}
            />
          </div>
        </section>
        ) : null}

        <section data-plate="3" className="py-24 sm:px-12 lg:px-16 lg:py-40" aria-labelledby="collections-heading">
          <h2 id="collections-heading" data-reveal className="text-[length:var(--step-head)]">
            {collections.length} collections
          </h2>
          <ul className="mt-10 max-w-[34rem]">
            {collections.map((collection, index) => (
              <li key={collection.name} data-reveal style={{ "--i": index % 6 } as React.CSSProperties}>
                <Link
                  href={`/shop?category=${encodeURIComponent(collection.name)}#catalog`}
                  className="group flex min-h-11 items-center gap-3 py-1.5"
                >
                  <span className="size-4 shrink-0 rounded-full" style={{ background: dots[index % dots.length] }} aria-hidden="true" />
                  <span className="flex-1 transition-colors group-hover:text-[var(--rose-deep)]">{collection.name}</span>
                  <span className="text-[length:var(--step-small)] tabular-nums text-[var(--muted)]">
                    {collection.count} from {formatPrice(collection.from)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </SplitStage>

      <div className="mt-32 px-5 sm:px-8">
        <LampShowcase lamps={lamps} />
      </div>

      <section className="mt-32 bg-[var(--rose)] px-5 py-24 sm:px-8 lg:py-32" aria-labelledby="order-heading">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="order-heading" data-reveal className="text-[length:var(--step-head)]">From basket to doorstep</h2>
            <p data-reveal style={{ "--i": 1 } as React.CSSProperties} className="mt-6 max-w-[26ch] text-[length:var(--step-lead)] font-bold leading-snug">
              Ordering takes a few minutes. Making it is the slow part.
            </p>
          </div>
          <div data-reveal className="slip w-full max-w-[34rem] bg-[var(--cream)] pb-10 pt-8 text-[length:var(--step-small)] tabular-nums sm:text-[length:var(--step-body)] lg:col-span-5 lg:col-start-7">
            {slip.map((group) => (
              <div key={group.stage} className="px-6 pt-7 first:pt-0 sm:px-8">
                <p className="font-semibold">{group.stage}</p>
                {group.rows.map(([what, value]) => (
                  <p key={what} className="mt-2 flex items-end">
                    <span>{what}</span>
                    <span className="leader" aria-hidden="true" />
                    <span className="shrink-0 text-[var(--muted)]">{value}</span>
                  </p>
                ))}
              </div>
            ))}
            <p className="mt-8 flex min-h-11 flex-wrap items-center justify-between gap-x-4 bg-[var(--ink)] px-6 py-2 text-[var(--paper)] sm:px-8">
              <span>You hold a flower that never wilts</span>
              <span>from {formatPrice(lowest)}</span>
            </p>
          </div>
        </div>
      </section>

      <section className="grid items-center gap-16 px-5 py-40 sm:px-8 lg:grid-cols-2" aria-labelledby="letter-heading">
        <figure className="lg:order-last">
          <LoopVideo src="/art/crochet-hands.webm" poster="/art/crochet-hands-poster.jpg" className="aspect-[4/3] w-full object-cover saturate-[0.45]" />
          <figcaption className="mt-3 text-[length:var(--step-small)] text-[var(--muted)]">Crochet in progress: a hook drawing loops of wool, one at a time.</figcaption>
        </figure>
        <div className="mx-auto max-w-[32.5rem]">
          <Image src="/twistify-arts-mark.svg" alt="" width={44} height={44} className="size-11 rounded-full" />
          <h2 id="letter-heading" data-reveal className="mt-7 text-[length:var(--step-head)]">A note from the studio</h2>
          <div className="mt-8 space-y-5">
            <p data-reveal>
              Twistify Arts is Shraddha Doshi’s studio for crochet and woolen crafts: flowers, garlands, festival decor and small things to carry every day.
            </p>
            <p data-reveal style={{ "--i": 1 } as React.CSSProperties}>
              Each piece is made by hand, one at a time. Handmade work varies a little from piece to piece, and <mark className="bg-[#F2D3A6] text-[var(--ink)]">that is part of it.</mark>
            </p>
            <p data-reveal style={{ "--i": 2 } as React.CSSProperties}>
              If you need something the shop does not list, a colour, a size or a phone model, write and ask.
            </p>
          </div>
          <p className="mt-8 text-[length:var(--step-lead)] italic">Twistify Arts</p>
          <p className="text-[length:var(--step-small)] text-[var(--muted)]">Handmade by Shraddha Doshi</p>
        </div>
      </section>

      <section aria-labelledby="contact-heading" className="px-5 sm:px-8">
        <div className="flex min-h-[9.5rem] items-end gap-6 bg-[var(--sage)] px-6 pb-8 pt-6 sm:px-10">
          <h2 id="contact-heading" className="text-[length:var(--step-head)] leading-none">Write to the studio</h2>
          <Image
            src="/art/rangoli.jpg"
            alt="A flower and Swastik rangoli drawn in coloured powder on a doorstep"
            width={120}
            height={120}
            className="size-20 shrink-0 rounded-full object-cover sm:size-28"
          />
        </div>
        <a href={`mailto:${email}`} className="flex min-h-[9.5rem] items-end break-all bg-[var(--sage-light)] px-6 pb-8 pt-6 sm:px-10 text-[length:var(--step-head)] leading-none font-serif transition-colors hover:text-[var(--paper)]">
          {email}
        </a>
        <p className="flex min-h-[9.5rem] items-end bg-[var(--sage)] px-6 pb-8 pt-6 sm:px-10 font-serif text-[length:var(--step-head)] leading-none">
          Custom colours and sizes
        </p>
        <p className="flex min-h-[9.5rem] items-end bg-[var(--sage-light)] px-6 pb-8 pt-6 sm:px-10 font-serif text-[length:var(--step-head)] leading-none">
          Phone cases to your model
        </p>
        <a
          href={`mailto:${email}?subject=${encodeURIComponent("Hello from the Twistify Arts site")}`}
          className="group flex min-h-[9.5rem] items-end gap-6 bg-[var(--rose)] px-6 pb-8 pt-6 sm:px-10 font-serif text-[length:var(--step-head)] leading-none"
        >
          Say hello
          <span className="mb-1 grid size-14 place-items-center rounded-full bg-[var(--ink)] text-[var(--paper)] transition-transform group-hover:translate-x-2 sm:size-16" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </a>
      </section>

      <ArtCredits credits={credits} />
    </main>
  );
}
