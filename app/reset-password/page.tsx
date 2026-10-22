import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PasswordResetForm } from "@/app/components/password-reset-form";

export const metadata: Metadata = { title: "Reset password" };

type ResetPasswordPageProps = { searchParams: Promise<{ token?: string }> };

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token } = await searchParams;
  if (!token) redirect("/forgot-password");

  return <main className="min-h-screen bg-(--paper) px-5 py-16 sm:px-8"><PasswordResetForm token={token} /></main>;
}
