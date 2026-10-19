import type { DeliveryDetails } from "@/app/lib/razorpay";
import { fetchRazorpayPaymentDetails, getRazorpayConfig } from "@/app/lib/razorpay";
import {
  sendCustomerOrderConfirmation,
  sendPaidOrderNotification,
} from "@/app/lib/order-notification";
import { Order } from "@/app/models/order";
import { User } from "@/app/models/user";
import { connectToDatabase } from "@/lib/mongodb";

type PendingOrder = {
  _id: { toString(): string };
  userId: { toString(): string };
  items: Array<{ productId: string; name: string; price: number; quantity: number }>;
  delivery: DeliveryDetails;
  amount: number;
  paymentStatus?: string;
  razorpayPaymentId?: string;
};

export type MarkPaidResult =
  | { ok: true; orderId: string; userId: string; notificationSent: boolean }
  | { ok: false; reason: "not_found" | "not_verified" | "unavailable" };

// Confirms a payment with the Razorpay API and marks the matching pending order as paid.
// Called by both the browser verify route and the webhook, so it must be idempotent:
// only the call that flips the order to "paid" sends the notification emails.
export async function markOrderPaid(razorpayOrderId: string, paymentId: string): Promise<MarkPaidResult> {
  const config = getRazorpayConfig();

  if (!config) {
    return { ok: false, reason: "unavailable" };
  }

  await connectToDatabase();
  const order = (await Order.findOne({ razorpayOrderId })
    .select("userId items delivery amount paymentStatus razorpayPaymentId")
    .lean()) as PendingOrder | null;

  if (!order) {
    return { ok: false, reason: "not_found" };
  }

  if (order.paymentStatus === "paid" || order.paymentStatus === undefined) {
    return order.razorpayPaymentId === undefined || order.razorpayPaymentId === paymentId
      ? { ok: true, orderId: order._id.toString(), userId: order.userId.toString(), notificationSent: false }
      : { ok: false, reason: "not_verified" };
  }

  const expectedAmount = order.items.reduce(
    (total, item) => total + item.price * item.quantity * 100,
    0,
  );
  const paymentDetails = await fetchRazorpayPaymentDetails(config, razorpayOrderId, paymentId);

  if (
    !paymentDetails ||
    paymentDetails.order.id !== razorpayOrderId ||
    paymentDetails.payment.id !== paymentId ||
    paymentDetails.payment.orderId !== razorpayOrderId ||
    order.amount !== expectedAmount ||
    paymentDetails.order.amount !== expectedAmount ||
    paymentDetails.payment.amount !== expectedAmount ||
    paymentDetails.order.currency !== "INR" ||
    paymentDetails.payment.currency !== "INR" ||
    paymentDetails.payment.status !== "captured"
  ) {
    return { ok: false, reason: "not_verified" };
  }

  const updated = await Order.findOneAndUpdate(
    { _id: order._id, paymentStatus: { $ne: "paid" } },
    { $set: { paymentStatus: "paid", razorpayPaymentId: paymentId, paidAt: new Date() } },
    { new: true },
  )
    .select("_id")
    .lean();

  if (!updated) {
    // Another request (verify or webhook) marked it paid first.
    return { ok: true, orderId: order._id.toString(), userId: order.userId.toString(), notificationSent: false };
  }

  const paidOrder = {
    amount: order.amount,
    delivery: order.delivery,
    items: order.items,
    orderId: razorpayOrderId,
    paymentId,
  };
  const customer = await User.findById(order.userId).select("name email").lean();
  const [notification] = await Promise.all([
    sendPaidOrderNotification(paidOrder),
    customer?.email
      ? sendCustomerOrderConfirmation(paidOrder, {
          email: customer.email,
          name: customer.name ?? order.delivery.fullName,
          orderReference: order._id.toString(),
        })
      : Promise.resolve({ sent: false }),
  ]);

  return {
    ok: true,
    orderId: order._id.toString(),
    userId: order.userId.toString(),
    notificationSent: notification.sent,
  };
}
