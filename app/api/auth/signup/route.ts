import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { normalizePhone } from "@/app/lib/format";
import { User } from "@/app/models/user";
import { connectToDatabase, isDatabaseConfigured } from "@/lib/mongodb";

export const runtime = "nodejs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const rawPhone = typeof body?.phone === "string" ? body.phone.trim() : "";
  const phone = rawPhone ? normalizePhone(rawPhone) : undefined;
  const password = typeof body?.password === "string" ? body.password : "";
  const confirmPassword = typeof body?.confirmPassword === "string" ? body.confirmPassword : "";

  if (!name || name.length > 80) return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  if (!emailPattern.test(email) || email.length > 254) return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  if (phone === null) return NextResponse.json({ error: "Please enter a valid phone number, with the country code if outside India." }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ error: "Your password must be at least 8 characters." }, { status: 400 });
  if (password !== confirmPassword) return NextResponse.json({ error: "Your passwords do not match." }, { status: 400 });

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Accounts are not available yet: the store database is not configured." }, { status: 503 });
  }

  try {
    await connectToDatabase();
  } catch {
    return NextResponse.json({ error: "Accounts are temporarily unavailable. Please try again later." }, { status: 503 });
  }

  if (await User.exists({ email })) return NextResponse.json({ error: "An account already exists for this email." }, { status: 409 });
  if (phone && (await User.exists({ phone }))) return NextResponse.json({ error: "An account already exists for this phone number." }, { status: 409 });

  try {
    await User.create({ name, email, phone, passwordHash: await bcrypt.hash(password, 12), role: "customer" });
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === 11000) {
      return NextResponse.json({ error: "An account already exists for this email or phone number." }, { status: 409 });
    }

    return NextResponse.json({ error: "Unable to create your account. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ created: true }, { status: 201 });
}
