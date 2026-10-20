"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "./cart-provider";
import { formatPrice } from "@/app/lib/format";

type Piece = { id: string; name: string; price: number; availability: string };

// The page's live thing: set a budget and see every real piece at or under it.
export function BudgetFinder({ pieces }: { pieces: Piece[] }) {
  const { addToCart } = useCart();
  const prices = pieces.map((piece) => piece.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const [budget, setBudget] = useState(Math.round((min + max) / 2 / 50) * 50);
  const [added, setAdded] = useState<string | null>(null);
  const matches = pieces
    .filter((piece) => piece.price <= budget && piece.availability !== "Sold out")
    .sort((a, b) => b.price - a.price);
  const shown = matches.slice(0, 8);

  return (
    <div>
      <label htmlFor="budget" className="flex items-baseline justify-between gap-4">
        <span>Your budget</span>
        <output htmlFor="budget" className="font-serif text-[length:var(--step-head)] leading-none tabular-nums">
          {formatPrice(budget)}
        </output>
      </label>
      <input
        id="budget"
        type="range"
        min={min}
        max={max}
        step={10}
        value={budget}
        onChange={(event) => setBudget(Number(event.target.value))}
        className="mt-4 h-11 w-full cursor-pointer"
      />
      <p className="mt-3 text-[var(--muted)]" aria-live="polite">
        {matches.length} {matches.length === 1 ? "piece" : "pieces"} at or under {formatPrice(budget)}
      </p>
      <ul className="mt-6">
        {shown.map((piece) => (
          <li key={piece.id} className="flex min-h-11 items-center gap-3 py-1">
            <Link href={`/shop/${piece.id}`} className="text-link min-w-0 flex-1 truncate">
              {piece.name}
            </Link>
            <span className="tabular-nums text-[var(--muted)]">{formatPrice(piece.price)}</span>
            <button
              type="button"
              onClick={() => {
                addToCart(piece.id);
                setAdded(piece.id);
              }}
              className="btn btn-quiet min-h-11 px-3 py-2"
              aria-label={`Add ${piece.name} to basket`}
            >
              {added === piece.id ? "Added" : "Add"}
            </button>
          </li>
        ))}
      </ul>
      {matches.length > shown.length ? (
        <Link href="/shop" className="text-link mt-4 inline-block">
          See all {matches.length} in the shop
        </Link>
      ) : null}
    </div>
  );
}
