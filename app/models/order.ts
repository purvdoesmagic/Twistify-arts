import { Schema, model, models } from "mongoose";

export const paymentStatuses = ["paid", "failed", "unpaid", "cancelled"] as const;
export type PaymentStatus = (typeof paymentStatuses)[number];

export const fulfillmentStatuses = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;
export type FulfillmentStatus = (typeof fulfillmentStatuses)[number];

export function normalizeOrderStatuses(
  legacyStatus: string | undefined,
  paymentStatus: string | undefined,
  fulfillmentStatus: string | undefined,
) {
  const legacyFulfillmentStatus =
    legacyStatus === "shipped"
      ? "shipped"
      : legacyStatus === "delivered"
        ? "delivered"
        : "pending";

  return {
    paymentStatus: (paymentStatus ?? "paid") as PaymentStatus,
    fulfillmentStatus: (fulfillmentStatus ?? legacyFulfillmentStatus) as FulfillmentStatus,
  };
}

const orderSchema = new Schema(
  {
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    delivery: {
      fullName: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      required: true,
      enum: ["paid", "shipped", "delivered"],
      default: "paid",
    },
    paymentStatus: {
      type: String,
      enum: paymentStatuses,
      default: "paid",
    },
    fulfillmentStatus: {
      type: String,
      enum: fulfillmentStatuses,
      default: "pending",
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true, versionKey: false },
);

export const Order = models.Order ?? model("Order", orderSchema);
