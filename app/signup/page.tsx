import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AuthForm } from "@/app/components/auth-form";
import { isDatabaseConfigured } from "@/lib/mongodb";

export default async function SignupPage() {
  if (await auth()) redirect("/account");

  return <main className="min-h-screen bg-(--paper) px-5 py-16 sm:px-8"><AuthForm mode="signup" unavailable={!isDatabaseConfigured()} callbackUrl="/account" /></main>;
}
