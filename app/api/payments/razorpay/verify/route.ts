import { NextResponse } from "next/server";
import {
  getRazorpayConfig,
  readOrderToken,
  verifyRazorpayPayment,
} from "@/app/lib/razorpay";
import { sendPaidOrderNotification } from "@/app/lib/order-notification";
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

  if (order.userId !== session.user.id) {
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

  await connectToDatabase();
  const existingOrder = await Order.findOne({
    $or: [{ razorpayOrderId: order.orderId }, { razorpayPaymentId: body.paymentId }],
  }).select("userId").lean();

  if (existingOrder && existingOrder.userId.toString() !== session.user.id) {
    return NextResponse.json({ error: "Payment order could not be verified." }, { status: 400 });
  }

  if (!existingOrder) {
    await Order.create({
      items: order.items,
      delivery: order.delivery,
      razorpayOrderId: order.orderId,
      razorpayPaymentId: body.paymentId,
      amount: order.amount,
      status: "paid",
      userId: session.user.id,
    });
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
