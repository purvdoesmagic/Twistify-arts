import { createHmac, timingSafeEqual } from "node:crypto";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import type { CountryCode } from "libphonenumber-js";

type RazorpayConfig = {
  keyId: string;
  keySecret: string;
};

type OrderTokenPayload = {
  orderId: string;
  amount: number;
  items: OrderTokenItem[];
  delivery: DeliveryDetails;
};

type OrderTokenItem = {
  name: string;
  price: number;
  quantity: number;
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
  const postalCode = details.postalCode?.trim();

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
    !postalCode ||
    !/^\d{6}$/.test(postalCode)
  ) {
    return null;
  }

  return { fullName, country, phone: phoneDigits, address, city, state, postalCode };
}

export function getRazorpayConfig(): RazorpayConfig | null {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const isEnabled = process.env.RAZORPAY_ENABLED === "true";
  const isTestMode = process.env.RAZORPAY_MODE === "test";

  if (!isEnabled || !isTestMode || !keyId || !keySecret) {
    return null;
  }

  return { keyId, keySecret };
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

export function createOrderToken(payload: OrderTokenPayload, secret: string) {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = sign(encodedPayload, secret);

  return `${encodedPayload}.${signature}`;
}

export function readOrderToken(token: string, secret: string): OrderTokenPayload | null {
  const [encodedPayload, receivedSignature, extraPart] = token.split(".");

  if (!encodedPayload || !receivedSignature || extraPart) {
    return null;
  }

  if (!signaturesMatch(sign(encodedPayload, secret), receivedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as OrderTokenPayload;

    if (
      typeof payload.orderId !== "string" ||
      !payload.orderId ||
      typeof payload.amount !== "number" ||
      !Number.isInteger(payload.amount) ||
      payload.amount <= 0 ||
      !Array.isArray(payload.items) ||
      payload.items.length === 0 ||
      !readDeliveryDetails(payload.delivery) ||
      payload.items.some(
        (item) =>
          typeof item?.name !== "string" ||
          !item.name ||
          typeof item?.price !== "number" ||
          !Number.isInteger(item.price) ||
          item.price <= 0 ||
          typeof item?.quantity !== "number" ||
          !Number.isInteger(item.quantity) ||
          item.quantity < 1,
      )
    ) {
      return null;
    }

    return {
      ...payload,
      delivery: readDeliveryDetails(payload.delivery)!,
    };
  } catch {
    return null;
  }
}

export function verifyRazorpayPayment(
  orderId: string,
  paymentId: string,
  receivedSignature: string,
  secret: string,
) {
  return signaturesMatch(sign(`${orderId}|${paymentId}`, secret), receivedSignature);
}
