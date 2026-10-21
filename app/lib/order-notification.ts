import type { DeliveryDetails } from "@/app/lib/razorpay";
import { formatCountry, formatPhone, formatPrice } from "@/app/lib/format";

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

type EmailResult = { sent: boolean; reason?: string };

export function escapeHtml(value: string) {
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

function itemsHtml(order: PaidOrder) {
  return order.items
    .map(
      (item) =>
        `<li>${item.quantity} × ${escapeHtml(item.name)} — ${formatPrice(item.price * item.quantity)}</li>`,
    )
    .join("");
}

function deliveryHtml(delivery: DeliveryDetails) {
  return `
    <p>
      ${escapeHtml(delivery.fullName)}<br />
      ${escapeHtml(formatPhone(delivery.country, delivery.phone))}<br />
      ${escapeHtml(delivery.address)}<br />
      ${escapeHtml(delivery.city)}, ${escapeHtml(delivery.state)} ${escapeHtml(delivery.postalCode)}<br />
      ${escapeHtml(formatCountry(delivery.country))}
    </p>
  `;
}

export async function sendEmail(to: string, subject: string, html: string): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return { sent: false, reason: "Email notifications are not configured." };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.ORDER_NOTIFICATION_FROM ?? "Twistify Arts <onboarding@resend.dev>",
        to: [to],
        subject,
        html,
      }),
    });

    if (!response.ok) {
      console.error("Unable to send email", await response.text());
      return { sent: false, reason: "Email delivery failed." };
    }

    return { sent: true };
  } catch (error) {
    console.error("Unable to send email", error);
    return { sent: false, reason: "Email delivery failed." };
  }
}

export async function sendPaidOrderNotification(order: PaidOrder) {
  const recipient = process.env.ORDER_NOTIFICATION_EMAIL;

  if (!recipient) {
    return { sent: false, reason: "Email notifications are not configured." };
  }

  return sendEmail(
    recipient,
    `New paid Twistify Arts order — ${formatPrice(order.amount / 100)}`,
    `
      <h1>New paid order</h1>
      <p><strong>Razorpay order:</strong> ${escapeHtml(order.orderId)}</p>
      <p><strong>Payment:</strong> ${escapeHtml(order.paymentId)}</p>
      <h2>Items</h2>
      <ul>${itemsHtml(order)}</ul>
      <p><strong>Total paid:</strong> ${formatPrice(order.amount / 100)}</p>
      <h2>Delivery details</h2>
      ${deliveryHtml(order.delivery)}
    `,
  );
}

// Resend only delivers to arbitrary customers once ORDER_NOTIFICATION_FROM uses a verified domain.
export async function sendCustomerOrderConfirmation(
  order: PaidOrder,
  customer: { email: string; name: string; orderReference: string },
) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const orderLink = siteUrl
    ? `<p><a href="${escapeHtml(`${siteUrl}/order/confirmation?orderId=${customer.orderReference}`)}">View your order</a></p>`
    : "";

  return sendEmail(
    customer.email,
    "Your Twistify Arts order is confirmed",
    `
      <h1>Thank you, ${escapeHtml(customer.name)}!</h1>
      <p>Your handmade order is confirmed. We'll keep you updated as it is made and shipped.</p>
      <p><strong>Order reference:</strong> ${escapeHtml(customer.orderReference)}</p>
      <h2>Your items</h2>
      <ul>${itemsHtml(order)}</ul>
      <p><strong>Total paid:</strong> ${formatPrice(order.amount / 100)}</p>
      <h2>Delivering to</h2>
      ${deliveryHtml(order.delivery)}
      ${orderLink}
      <p>With love,<br />Twistify Arts</p>
    `,
  );
}
