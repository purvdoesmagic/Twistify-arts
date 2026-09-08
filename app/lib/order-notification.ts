import type { DeliveryDetails } from "@/app/lib/razorpay";
import { getCountryCallingCode } from "libphonenumber-js";
import type { CountryCode } from "libphonenumber-js";

type PaidOrder = {
  amount: number;
  delivery: DeliveryDetails;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  orderId: string;
  paymentId: string;
};

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };

    return entities[character];
  });
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export async function sendPaidOrderNotification(order: PaidOrder) {
  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.ORDER_NOTIFICATION_EMAIL;

  if (!apiKey || !recipient) {
    return { sent: false, reason: "Email notifications are not configured." };
  }

  const items = order.items
    .map(
      (item) =>
        `<li>${item.quantity} × ${escapeHtml(item.name)} — ${formatPrice(item.price * item.quantity)}</li>`,
    )
    .join("");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.ORDER_NOTIFICATION_FROM ?? "Twistify Arts <onboarding@resend.dev>",
      to: [recipient],
      subject: `New paid Twistify Arts order — ${formatPrice(order.amount / 100)}`,
      html: `
        <h1>New paid order</h1>
        <p><strong>Razorpay order:</strong> ${order.orderId}</p>
        <p><strong>Payment:</strong> ${order.paymentId}</p>
        <h2>Items</h2>
        <ul>${items}</ul>
        <p><strong>Total paid:</strong> ${formatPrice(order.amount / 100)}</p>
        <h2>Delivery details</h2>
        <p>
          ${escapeHtml(order.delivery.fullName)}<br />
          +${getCountryCallingCode(order.delivery.country as CountryCode)}${escapeHtml(order.delivery.phone)}<br />
          ${escapeHtml(order.delivery.address)}<br />
          ${escapeHtml(order.delivery.city)}, ${escapeHtml(order.delivery.state)} ${escapeHtml(order.delivery.postalCode)}
        </p>
      `,
    }),
  });

  if (!response.ok) {
    console.error("Unable to send paid-order email", await response.text());
    return { sent: false, reason: "Email delivery failed." };
  }

  return { sent: true };
}
