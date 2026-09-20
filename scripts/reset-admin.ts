import bcrypt from "bcrypt";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function resetAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password || password.length < 12) {
    throw new Error("Set ADMIN_EMAIL and an ADMIN_PASSWORD of at least 12 characters.");
  }

  const [{ User }, { connectToDatabase }] = await Promise.all([import("../app/models/user"), import("../lib/mongodb")]);
  await connectToDatabase();

  const admin = await User.findOne({ email }).select("role").lean();
  if (!admin) {
    throw new Error("No account exists for ADMIN_EMAIL. Refusing to create a new user.");
  }

  if (admin.role !== "admin") {
    throw new Error("The account for ADMIN_EMAIL is not an admin. Refusing to change its password.");
  }

  const result = await User.updateOne(
    { email, role: "admin" },
    { $set: { passwordHash: await bcrypt.hash(password, 12) } },
  );
  if (result.modifiedCount !== 1) {
    throw new Error("No admin account was modified. Refusing to report a successful password reset.");
  }

  console.log("Admin password reset successfully.");
}

resetAdmin().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Unable to reset the admin password.");
  process.exitCode = 1;
});