"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { addLine, MAX_PER_PIECE, MAX_PIECES, setLineQuantity } from "@/app/lib/cart-limits";

export const CART_STORAGE_KEY = "twistify-arts-cart";

export type CartLine = {
  productId: string;
  quantity: number;
};

type CartContextValue = {
  cart: CartLine[];
  isHydrated: boolean;
  cartCount: number;
  addToCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function isCartLine(value: unknown): value is CartLine {
  if (!value || typeof value !== "object") {
    return false;
  }

  const line = value as Partial<CartLine>;
  return (
    typeof line.productId === "string" &&
    line.productId.trim().length > 0 &&
    typeof line.quantity === "number" &&
    Number.isInteger(line.quantity) &&
    line.quantity > 0
  );
}

function readStoredCart(): CartLine[] {
  try {
    const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);

    if (!storedCart) {
      return [];
    }

    const parsedCart: unknown = JSON.parse(storedCart);
    return Array.isArray(parsedCart)
      ? parsedCart.filter(isCartLine).slice(0, MAX_PIECES).map((line) => ({ ...line, quantity: Math.min(line.quantity, MAX_PER_PIECE) }))
      : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setCart(readStoredCart());
      setHasHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
    }
  }, [cart, hasHydrated]);

  const addToCart = (productId: string) => {
    if (!productId.trim()) {
      return;
    }

    setCart((currentCart) => addLine(currentCart, productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (!Number.isInteger(quantity) || quantity < 0) {
      return;
    }

    setCart((currentCart) => setLineQuantity(currentCart, productId, quantity));
  };

  const removeFromCart = (productId: string) => {
    setCart((currentCart) => currentCart.filter((line) => line.productId !== productId));
  };

  const value: CartContextValue = {
    cart,
    isHydrated: hasHydrated,
    cartCount: cart.reduce((sum, line) => sum + line.quantity, 0),
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart: () => setCart([]),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
