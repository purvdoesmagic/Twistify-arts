import type { Metadata } from "next";
import { CartPage } from "@/app/components/cart-page";
import { getProducts } from "@/app/lib/products";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your handmade Twistify Arts creations before checkout.",
};

export const dynamic = "force-dynamic";

export default async function CartRoute() {
  const products = await getProducts();

  return <CartPage products={products} />;
}
