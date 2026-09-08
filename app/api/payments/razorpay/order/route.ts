import { NextResponse } from "next/server";
import { products } from "@/app/data/products";
import {
  createOrderToken,
  getRazorpayConfig,
  readDeliveryDetails,
} from "@/app/lib/razorpay";

export const runtime = "nodejs";

type RequestedItem = {
  productId?: unknown;
  quantity?: unknown;
};

type RazorpayOrder = {
  id?: string;
  amount?: number;
  currency?: string;
};

export async function POST(request: Request) {
  const config = getRazorpayConfig();

  if (!config) {
    return NextResponse.json(
      { error: "Online payments are not enabled yet." },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => null);
  const requestedItems = body?.items;
  const delivery = readDeliveryDetails(body?.delivery);

  if (!Array.isArray(requestedItems) || requestedItems.length === 0) {
    return NextResponse.json({ error: "Your basket is empty." }, { status: 400 });
  }

  if (!delivery) {
    return NextResponse.json(
      { error: "Please enter complete delivery details before payment." },
      { status: 400 },
    );
  }

  const quantities = new Map<string, number>();

  for (const item of requestedItems as RequestedItem[]) {
    if (
      typeof item.productId !== "string" ||
      !Number.isInteger(item.quantity) ||
      typeof item.quantity !== "number" ||
      item.quantity < 1 ||
      item.quantity > 10
    ) {
      return NextResponse.json({ error: "One or more basket items are invalid." }, { status: 400 });
    }

    quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);
  }

  if (quantities.size > 20 || [...quantities.values()].some((quantity) => quantity > 10)) {
    return NextResponse.json({ error: "Please reduce the quantity and try again." }, { status: 400 });
  }

  const orderItems = [...quantities.entries()].map(([productId, quantity]) => ({
    product: products.find((item) => item.id === productId),
    quantity,
  }));

  if (orderItems.some((item) => !item.product)) {
    return NextResponse.json({ error: "Your basket contains an unavailable item." }, { status: 400 });
  }

  if (orderItems.some((item) => item.product?.availability === "Sold out")) {
    return NextResponse.json({ error: "One or more items in your basket are sold out." }, { status: 400 });
  }

  const amount = orderItems.reduce(
    (total, item) => total + item.product!.price * item.quantity * 100,
    0,
  );

  const basicAuth = Buffer.from(`${config.keyId}:${config.keySecret}`).toString("base64");
  const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount,
      currency: "INR",
      receipt: `twistify_${Date.now().toString(36)}`,
    }),
  });
  const order = (await razorpayResponse.json()) as RazorpayOrder;

  if (!razorpayResponse.ok || !order.id || !order.amount || !order.currency) {
    return NextResponse.json(
      { error: "Unable to start Razorpay checkout. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({
    keyId: config.keyId,
    orderId: order.id,
    orderToken: createOrderToken(
      {
        orderId: order.id,
        amount: order.amount,
        delivery,
        items: orderItems.map(({ product, quantity }) => ({
          name: product!.name,
          price: product!.price,
          quantity,
        })),
      },
      config.keySecret,
    ),
    amount: order.amount,
    currency: order.currency,
  });
}
