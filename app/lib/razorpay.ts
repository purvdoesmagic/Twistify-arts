import { createHmac, timingSafeEqual } from "node:crypto";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import type { CountryCode } from "libphonenumber-js";
import { isValidPostalCode } from "@/app/lib/delivery";

type RazorpayConfig = {
  keyId: string;
  keySecret: string;
};

type RazorpayOrderResponse = {
  id?: unknown;
  amount?: unknown;
  currency?: unknown;
};

type RazorpayPaymentResponse = {
  id?: unknown;
  order_id?: unknown;
  amount?: unknown;
  currency?: unknown;
  status?: unknown;
};

export type RazorpayPaymentDetails = {
  order: {
    id: string;
    amount: number;
    currency: string;
  };
  payment: {
    id: string;
    orderId: string;
    amount: number;
    currency: string;
    status: string;
  };
};

export type DeliveryDetails = {
  fullName: string;
  country: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
};

export function readDeliveryDetails(value: unknown): DeliveryDetails | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const details = value as Partial<DeliveryDetails>;
  const fullName = details.fullName?.trim();
  const country = details.country?.trim().toUpperCase();
  const phone = details.phone?.trim();
  const phoneDigits = phone?.replace(/\D/g, "");
  const address = details.address?.trim();
  const city = details.city?.trim();
  const state = details.state?.trim();
  const postalCode = (details.postalCode?.trim() ?? "").toUpperCase();

  if (
    !fullName ||
    fullName.length > 80 ||
    !country ||
    !getCountries().includes(country as CountryCode) ||
    !phoneDigits ||
    phoneDigits.length < 6 ||
    phoneDigits.length + getCountryCallingCode(country as CountryCode).length > 15 ||
    !address ||
    address.length > 240 ||
    !city ||
    city.length > 80 ||
    !state ||
    state.length > 80 ||
    !isValidPostalCode(country, postalCode)
  ) {
    return null;
  }

  return { fullName, country, phone: phoneDigits, address, city, state, postalCode };
}

export function getRazorpayConfig(): RazorpayConfig | null {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const isEnabled = process.env.RAZORPAY_ENABLED === "true";
  const mode = process.env.RAZORPAY_MODE;
  const validMode = mode === "test" || mode === "live";
  const expectedKeyPrefix = mode === "test" ? "rzp_test_" : mode === "live" ? "rzp_live_" : null;

  if (
    !isEnabled ||
    !validMode ||
    !expectedKeyPrefix ||
    !keyId ||
    !keySecret ||
    !keyId.startsWith(expectedKeyPrefix)
  ) {
    return null;
  }

  return { keyId, keySecret };
}

export async function fetchRazorpayPaymentDetails(
  config: RazorpayConfig,
  orderId: string,
  paymentId: string,
): Promise<RazorpayPaymentDetails | null> {
  try {
    const authorization = `Basic ${Buffer.from(`${config.keyId}:${config.keySecret}`).toString("base64")}`;
    const headers = { Authorization: authorization };
    const [orderResponse, paymentResponse] = await Promise.all([
      fetch(`https://api.razorpay.com/v1/orders/${encodeURIComponent(orderId)}`, { headers }),
      fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}`, { headers }),
    ]);

    if (!orderResponse.ok || !paymentResponse.ok) {
      return null;
    }

    const [order, payment] = (await Promise.all([
      orderResponse.json().catch(() => null),
      paymentResponse.json().catch(() => null),
    ])) as [RazorpayOrderResponse | null, RazorpayPaymentResponse | null];

    if (
      typeof order?.id !== "string" ||
      typeof order.amount !== "number" ||
      typeof order.currency !== "string" ||
      typeof payment?.id !== "string" ||
      typeof payment.order_id !== "string" ||
      typeof payment.amount !== "number" ||
      typeof payment.currency !== "string" ||
      typeof payment.status !== "string"
    ) {
      return null;
    }

    return {
      order: { id: order.id, amount: order.amount, currency: order.currency },
      payment: {
        id: payment.id,
        orderId: payment.order_id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
      },
    };
  } catch {
    return null;
  }
}

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("hex");
}

function signaturesMatch(expected: string, received: string) {
  const expectedBuffer = Buffer.from(expected, "hex");
  const receivedBuffer = Buffer.from(received, "hex");

  return (
    expectedBuffer.length === receivedBuffer.length &&
    timingSafeEqual(expectedBuffer, receivedBuffer)
  );
}

export function verifyRazorpayPayment(
  orderId: string,
  paymentId: string,
  receivedSignature: string,
  secret: string,
) {
  return signaturesMatch(sign(`${orderId}|${paymentId}`, secret), receivedSignature);
}

export function getRazorpayWebhookSecret() {
  return process.env.RAZORPAY_WEBHOOK_SECRET || null;
}

export function verifyRazorpayWebhook(rawBody: string, receivedSignature: string, secret: string) {
  return signaturesMatch(sign(rawBody, secret), receivedSignature);
}
