// Shared by the basket (client) and the order API (server), so the basket never holds an order checkout would reject.
export const MAX_PER_PIECE = 10;
export const MAX_PIECES = 20;

type Line = { productId: string; quantity: number };

export function addLine<T extends Line>(cart: T[], productId: string): T[] {
  const existing = cart.find((line) => line.productId === productId);

  if (existing) {
    return cart.map((line) => (line === existing ? { ...line, quantity: Math.min(line.quantity + 1, MAX_PER_PIECE) } : line));
  }

  return cart.length >= MAX_PIECES ? cart : [...cart, { productId, quantity: 1 } as T];
}

export function setLineQuantity<T extends Line>(cart: T[], productId: string, quantity: number): T[] {
  if (quantity === 0) {
    return cart.filter((line) => line.productId !== productId);
  }

  return cart.map((line) => (line.productId === productId ? { ...line, quantity: Math.min(quantity, MAX_PER_PIECE) } : line));
}
