import { createHash } from "node:crypto";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { User } from "@/app/models/user";
import { connectToDatabase, isDatabaseConfigured } from "@/lib/mongodb";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const token = typeof body?.token === "string" ? body.token : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const confirmPassword = typeof body?.confirmPassword === "string" ? body.confirmPassword : "";

  if (!/^[a-f0-9]{64}$/.test(token)) return NextResponse.json({ error: "This reset link is invalid. Please request a new one." }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ error: "Your password must be at least 8 characters." }, { status: 400 });
  if (password !== confirmPassword) return NextResponse.json({ error: "Your passwords do not match." }, { status: 400 });

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Accounts are not available yet: the store database is not configured." }, { status: 503 });
  }

  try {
    await connectToDatabase();
  } catch {
    return NextResponse.json({ error: "Password reset is temporarily unavailable. Please try again later." }, { status: 503 });
  }

  // Matching on the hash and clearing it in one update makes each link single-use.
  const result = await User.updateOne(
    { passwordResetTokenHash: createHash("sha256").update(token).digest("hex"), passwordResetExpires: { $gt: new Date() } },
    { passwordHash: await bcrypt.hash(password, 12), $unset: { passwordResetTokenHash: 1, passwordResetExpires: 1 } },
  );

  if (result.modifiedCount === 0) return NextResponse.json({ error: "This reset link has expired or was already used. Please request a new one." }, { status: 400 });

  return NextResponse.json({ reset: true });
}
