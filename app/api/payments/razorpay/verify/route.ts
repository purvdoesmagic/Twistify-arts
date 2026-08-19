import { NextResponse } from "next/server";
import {
  getRazorpayConfig,
  readOrderToken,
  verifyRazorpayPayment,
} from "@/app/lib/razorpay";
import { sendPaidOrderNotification } from "@/app/lib/order-notification";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const config = getRazorpayConfig();

  if (!config) {
    return NextResponse.json(
      { error: "Online payments are not enabled yet." },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => null);

  if (
    typeof body?.paymentId !== "string" ||
    typeof body?.signature !== "string" ||
    typeof body?.orderToken !== "string"
  ) {
    return NextResponse.json({ error: "Payment response is incomplete." }, { status: 400 });
  }

  const order = readOrderToken(body.orderToken, config.keySecret);

  if (!order) {
    return NextResponse.json({ error: "Payment order could not be verified." }, { status: 400 });
  }

  const verified = verifyRazorpayPayment(
    order.orderId,
    body.paymentId,
    body.signature,
    config.keySecret,
  );

  if (!verified) {
    return NextResponse.json({ error: "Payment signature did not match." }, { status: 400 });
  }

  const notification = await sendPaidOrderNotification({
    amount: order.amount,
    delivery: order.delivery,
    items: order.items,
    orderId: order.orderId,
    paymentId: body.paymentId,
  });

  return NextResponse.json({
    verified: true,
    orderId: order.orderId,
    notificationSent: notification.sent,
  });
}
