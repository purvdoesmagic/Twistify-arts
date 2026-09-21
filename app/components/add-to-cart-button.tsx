"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "./cart-provider";

type AddToCartButtonProps = {
  productId: string;
  availability: string;
};

export function AddToCartButton({ productId, availability }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const isSoldOut = availability === "Sold out";

  if (isSoldOut) {
    return (
      <Link
        href="/shop"
        className="mt-7 inline-flex rounded-full bg-[var(--rose)] px-6 py-3 font-sans text-sm font-semibold text-white transition hover:bg-[#95495b]"
      >
        Explore other creations
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        addToCart(productId);
        setIsAdded(true);
      }}
      className="mt-7 inline-flex rounded-full bg-[var(--rose)] px-6 py-3 font-sans text-sm font-semibold text-white transition hover:bg-[#95495b]"
    >
      {isAdded ? "Added to basket" : "Add to basket"}
    </button>
  );
}
