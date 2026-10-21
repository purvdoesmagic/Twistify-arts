import type { MetadataRoute } from "next";
import { getProducts } from "@/app/lib/products";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const pages = ["", "/shop", "/about", "/contact", "/faq", "/policies/shipping", "/policies/refunds", "/policies/privacy", "/policies/terms"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();

  return [
    ...pages.map((path) => ({ url: `${siteUrl}${path}` })),
    ...products.map((product) => ({ url: `${siteUrl}/shop/${product.id}` })),
  ];
}
