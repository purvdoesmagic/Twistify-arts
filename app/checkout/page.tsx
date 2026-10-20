import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CheckoutForm } from "@/app/components/checkout-form";
import { getRazorpayConfig } from "@/app/lib/razorpay";
import { auth } from "@/auth";
import { getProducts } from "@/app/lib/products";

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

  const products = await getProducts();
  const razorpayEnabled = getRazorpayConfig() !== null;

  return <CheckoutForm products={products} razorpayEnabled={razorpayEnabled} />;
}
