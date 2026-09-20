import { normalizeOrderStatuses } from "@/app/models/order";

export type AdminOrderRecord = {
  _id: { toString(): string };
  userId: { toString(): string };
  items: Array<{ productId: string; name: string; price: number; quantity: number }>;
  delivery: {
    fullName: string;
    country: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
  };
  razorpayOrderId: string;
  razorpayPaymentId: string;
  amount: number;
  status?: string;
  paymentStatus?: string;
  fulfillmentStatus?: string;
  createdAt: Date | string;
};

export type AdminOrderCustomer = { name?: string; email?: string } | null;

export function serializeAdminOrder(order: AdminOrderRecord, customer: AdminOrderCustomer) {
  const statuses = normalizeOrderStatuses(order.status, order.paymentStatus, order.fulfillmentStatus);

  return {
    id: order._id.toString(),
    orderId: order.razorpayOrderId,
    customer: customer
      ? { name: customer.name ?? order.delivery.fullName, email: customer.email ?? null }
      : { name: order.delivery.fullName, email: null },
    createdAt: new Date(order.createdAt).toISOString(),
    items: order.items,
    amount: order.amount / 100,
    paymentStatus: statuses.paymentStatus,
    fulfillmentStatus: statuses.fulfillmentStatus,
    razorpayOrderId: order.razorpayOrderId,
    razorpayPaymentId: order.razorpayPaymentId,
    delivery: order.delivery,
  };
}