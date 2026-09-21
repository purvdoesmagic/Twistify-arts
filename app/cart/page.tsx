import type { Metadata } from "next";
import type { Product as ProductData } from "@/app/data/products";
import { CartPage } from "@/app/components/cart-page";
import { Product } from "@/app/models/product";
import { connectToDatabase } from "@/lib/mongodb";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your handmade Twistify Arts creations before checkout.",
};

export const dynamic = "force-dynamic";

export default async function CartRoute() {
  await connectToDatabase();
  const products = (await Product.find().select("-_id").lean()) as ProductData[];

  return <CartPage products={products} />;
}
