"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "./cart-provider";
import { ProductPlaceholder } from "./product-placeholder";
import { formatPrice } from "@/app/lib/format";

type Lamp = { id: string; name: string; category: string; price: number; availability: string };

export function LampShowcase({ lamps }: { lamps: Lamp[] }) {
  const { addToCart } = useCart();
  const [index, setIndex] = useState(0);
  const [addedId, setAddedId] = useState<string | null>(null);
  const lamp = lamps[index];

  if (!lamp) return null;

  const isSoldOut = lamp.availability === "Sold out";

  return (
    <section className="grid min-h-[88svh] bg-[var(--cream)] lg:grid-cols-2" aria-labelledby="lamps-heading">
      <div className="flex items-center justify-center p-4 sm:p-10">
        <ProductPlaceholder key={lamp.id} name={lamp.name} category={lamp.category} className="aspect-square w-full max-w-[40rem]" />
      </div>
      <div className="flex flex-col justify-between gap-12 px-5 py-12 sm:px-10 lg:py-16">
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-[length:var(--step-lead)]" role="group" aria-label="Choose a lamp">
          {lamps.map((item, itemIndex) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={itemIndex === index}
              onClick={() => setIndex(itemIndex)}
              className="sweep-link min-h-11"
            >
              {item.name.replace(/ lamp$/i, "")}
            </button>
          ))}
        </div>
        <div data-reveal>
          <h2 id="lamps-heading" className="text-[length:var(--step-head)]">Wool flowers that glow</h2>
          <p className="mt-6 max-w-[34ch]">
            The {lamp.name.toLowerCase()} is a crocheted flower with a soft light inside, for a bedside or a quiet corner.
            {" "}{formatPrice(lamp.price)} · {lamp.availability.toLowerCase()}.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            disabled={isSoldOut}
            onClick={() => {
              addToCart(lamp.id);
              setAddedId(lamp.id);
            }}
            className="btn min-h-[4.5rem]"
          >
            {isSoldOut ? "Sold out" : addedId === lamp.id ? "Added to basket" : `Add to basket · ${formatPrice(lamp.price)}`}
          </button>
          <Link href={`/shop/${lamp.id}`} className="btn btn-quiet min-h-[4.5rem]">
            View the listing
          </Link>
        </div>
      </div>
    </section>
  );
}
