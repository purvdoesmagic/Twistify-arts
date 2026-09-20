import { NextResponse } from "next/server";
import { Product } from "@/app/models/product";
import { connectToDatabase } from "@/lib/mongodb";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const product = await Product.findOne({ id }).select("-_id").lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch {
    return NextResponse.json(
      { error: "Unable to load this product right now." },
      { status: 500 },
    );
  }
}
