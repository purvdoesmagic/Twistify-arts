import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AuthForm } from "@/app/components/auth-form";

export default async function AdminLoginPage() {
  const session = await auth();
  if (session?.user?.role === "admin") redirect("/admin");

  return <main className="min-h-screen bg-[var(--paper)] px-5 py-16 sm:px-8"><AuthForm mode="admin" callbackUrl="/admin" /></main>;
}
