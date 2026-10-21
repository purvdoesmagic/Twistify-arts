import { createHash, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { normalizePhone } from "@/app/lib/format";
import { escapeHtml, sendEmail } from "@/app/lib/order-notification";
import { User } from "@/app/models/user";
import { connectToDatabase, isDatabaseConfigured } from "@/lib/mongodb";

export const runtime = "nodejs";

const RESET_TTL_MS = 60 * 60 * 1000;
// Same reply whether or not the account exists, so this endpoint can't be used to probe for users.
const sentMessage = "If an account matches, we've emailed a link to reset your password.";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const identifier = typeof body?.identifier === "string" ? body.identifier.trim() : "";
  const email = identifier.includes("@") ? identifier.toLowerCase() : "";
  const phone = email ? null : normalizePhone(identifier);

  if (!email && !phone) return NextResponse.json({ error: "Please enter your email or phone number." }, { status: 400 });

  // Never build the link from the Host header in production: a spoofed host would mail out an attacker's link.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.NODE_ENV !== "production" ? new URL(request.url).origin : undefined);

  if (!isDatabaseConfigured() || !siteUrl || !process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "Password reset is not available yet. Please contact us for help." }, { status: 503 });
  }

  try {
    await connectToDatabase();
  } catch {
    return NextResponse.json({ error: "Password reset is temporarily unavailable. Please try again later." }, { status: 503 });
  }

  const user = await User.findOne(email ? { email } : { phone }).select("name email").lean();

  if (user) {
    const token = randomBytes(32).toString("hex");
    await User.updateOne(
      { _id: user._id },
      { passwordResetTokenHash: createHash("sha256").update(token).digest("hex"), passwordResetExpires: new Date(Date.now() + RESET_TTL_MS) },
    );

    const link = `${siteUrl}/reset-password?token=${token}`;
    await sendEmail(
      user.email,
      "Reset your Twistify Arts password",
      `<p>Hi ${escapeHtml(user.name)},</p>
       <p>We received a request to reset your password. This link works for one hour:</p>
       <p><a href="${link}">Reset my password</a></p>
       <p>If you didn't ask for this, you can ignore this email.</p>`,
    );
  }

  return NextResponse.json({ message: sentMessage });
}
