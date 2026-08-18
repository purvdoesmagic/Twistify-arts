import { createHmac, timingSafeEqual } from "node:crypto";

type RazorpayConfig = {
  keyId: string;
  keySecret: string;
};

type OrderTokenPayload = {
  orderId: string;
  amount: number;
};

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
      payload.amount <= 0
    ) {
      return null;
    }

    return payload;
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
