import { NextResponse } from "next/server";
import { getProducts } from "@/app/lib/products";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const category = new URL(request.url).searchParams.get("category")?.trim();

  return NextResponse.json({ products: await getProducts(category || undefined) });
}
