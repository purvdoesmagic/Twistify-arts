import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AuthForm } from "@/app/components/auth-form";

type LoginPageProps = { searchParams: Promise<{ callbackUrl?: string }> };

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();
  const { callbackUrl } = await searchParams;
  const destination = callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//") ? callbackUrl : "/account";

  if (session?.user) redirect(destination);

  return <main className="min-h-screen bg-[var(--paper)] px-5 py-16 sm:px-8"><AuthForm mode="login" callbackUrl={destination} /></main>;
}
