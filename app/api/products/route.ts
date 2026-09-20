import { NextResponse } from "next/server";
import { Product } from "@/app/models/product";
import { connectToDatabase } from "@/lib/mongodb";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const category = new URL(request.url).searchParams.get("category")?.trim();
    const filter = category ? { category } : {};
    const products = await Product.find(filter).select("-_id").lean();

    return NextResponse.json({ products });
  } catch {
    return NextResponse.json(
      { error: "Unable to load products right now." },
      { status: 500 },
    );
  }
}
