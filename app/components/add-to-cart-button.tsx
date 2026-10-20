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
        className="btn mt-10"
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
      className="btn mt-10"
    >
      {isAdded ? "Added to basket" : "Add to basket"}
    </button>
  );
}
