import { NextResponse } from "next/server";
import { getRazorpayWebhookSecret, verifyRazorpayWebhook } from "@/app/lib/razorpay";
import { markOrderPaid } from "@/app/lib/paid-orders";

export const runtime = "nodejs";

type WebhookEvent = {
  event?: unknown;
  payload?: {
    payment?: { entity?: { id?: unknown; order_id?: unknown } };
  };
};

// Razorpay retries a webhook until it gets a 2xx, so return 5xx only for failures worth retrying.
export async function POST(request: Request) {
  const secret = getRazorpayWebhookSecret();

  if (!secret) {
    return NextResponse.json({ error: "Webhook is not configured." }, { status: 503 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";

  if (!verifyRazorpayWebhook(rawBody, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  let event: WebhookEvent;

  try {
    event = JSON.parse(rawBody) as WebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  if (event.event !== "payment.captured" && event.event !== "order.paid") {
    return NextResponse.json({ received: true });
  }

  const payment = event.payload?.payment?.entity;

  if (typeof payment?.id !== "string" || typeof payment.order_id !== "string") {
    return NextResponse.json({ error: "Payment details missing." }, { status: 400 });
  }

  try {
    const result = await markOrderPaid(payment.order_id, payment.id);

    if (!result.ok && result.reason === "unavailable") {
      return NextResponse.json({ error: "Payments are not configured." }, { status: 503 });
    }

    // not_found: the payment belongs to an order this store did not create (e.g. a payment link).
    return NextResponse.json({ received: true, processed: result.ok });
  } catch (error) {
    console.error("Razorpay webhook processing failed", error);
    return NextResponse.json({ error: "Processing failed." }, { status: 500 });
  }
}
