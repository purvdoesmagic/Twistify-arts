import { NextResponse } from "next/server";
import { getRazorpayConfig, verifyRazorpayPayment } from "@/app/lib/razorpay";
import { markOrderPaid } from "@/app/lib/paid-orders";
import { Order } from "@/app/models/order";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Please sign in to verify this payment." }, { status: 401 });
  }

  const config = getRazorpayConfig();

  if (!config) {
    return NextResponse.json(
      { error: "Online payments are not enabled yet." },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => null);

  if (
    typeof body?.orderId !== "string" ||
    typeof body?.paymentId !== "string" ||
    typeof body?.signature !== "string"
  ) {
    return NextResponse.json({ error: "Payment response is incomplete." }, { status: 400 });
  }

  await connectToDatabase();
  const ownsOrder = await Order.exists({ razorpayOrderId: body.orderId, userId: session.user.id });

  if (!ownsOrder) {
    return NextResponse.json({ error: "Payment order could not be verified." }, { status: 400 });
  }

  if (!verifyRazorpayPayment(body.orderId, body.paymentId, body.signature, config.keySecret)) {
    return NextResponse.json({ error: "Payment signature did not match." }, { status: 400 });
  }

  const result = await markOrderPaid(body.orderId, body.paymentId);

  if (!result.ok) {
    return NextResponse.json({ error: "Payment could not be verified." }, { status: 400 });
  }

  return NextResponse.json({
    verified: true,
    orderId: result.orderId,
    notificationSent: result.notificationSent,
  });
}
