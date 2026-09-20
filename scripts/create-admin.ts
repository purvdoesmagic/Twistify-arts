import bcrypt from "bcrypt";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function createAdmin() {
  const name = process.env.ADMIN_NAME?.trim();
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !email || !password || password.length < 12) {
    throw new Error("Set ADMIN_NAME, ADMIN_EMAIL, and an ADMIN_PASSWORD of at least 12 characters.");
  }

  const [{ User }, { connectToDatabase }] = await Promise.all([import("../app/models/user"), import("../lib/mongodb")]);
  await connectToDatabase();
  if (await User.exists({ email })) {
    throw new Error("That email already belongs to an existing account. Use a different admin email.");
  }

  await User.create({ name, email, passwordHash: await bcrypt.hash(password, 12), role: "admin" });
  console.log("Admin account is ready.");
}

createAdmin().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Unable to create the admin account.");
  process.exitCode = 1;
});
