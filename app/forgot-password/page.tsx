import type { Metadata } from "next";
import { PasswordResetForm } from "@/app/components/password-reset-form";

export const metadata: Metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return <main className="min-h-screen bg-[var(--paper)] px-5 py-16 sm:px-8"><PasswordResetForm /></main>;
}
