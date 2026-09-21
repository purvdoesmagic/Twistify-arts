import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { Product as ProductData } from "@/app/data/products";
import { CheckoutForm } from "@/app/components/checkout-form";
import { Product } from "@/app/models/product";
import { getRazorpayConfig } from "@/app/lib/razorpay";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Twistify Arts order with secure Razorpay checkout.",
};

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/checkout");
  }

  await connectToDatabase();
  const products = (await Product.find().select("-_id").lean()) as ProductData[];
  const razorpayEnabled = getRazorpayConfig() !== null;

  return <CheckoutForm products={products} razorpayEnabled={razorpayEnabled} />;
}
