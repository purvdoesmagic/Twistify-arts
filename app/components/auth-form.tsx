"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

type AuthFormProps = { mode: "login" | "signup" | "admin"; callbackUrl: string };

function safeCallbackUrl(value: string) {
  return value.startsWith("/") && !value.startsWith("//") ? value : "/account";
}

export function AuthForm({ mode, callbackUrl }: AuthFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSignup = mode === "signup";
  const isAdmin = mode === "admin";
  const destination = safeCallbackUrl(callbackUrl);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (isSignup) {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, confirmPassword }),
        });
        const result = (await response.json()) as { error?: string };

        if (!response.ok) throw new Error(result.error ?? "Unable to create your account.");
      }

      const result = await signIn("credentials", {
        email,
        password,
        portal: isAdmin ? "admin" : "customer",
        redirect: false,
      });

      if (result?.error) throw new Error(isAdmin ? "Invalid admin email or password." : "Invalid email or password.");

      router.replace(isAdmin ? "/admin" : destination);
      router.refresh();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const title = isSignup ? "Create your account" : isAdmin ? "Admin sign in" : "Welcome back";
  const subtitle = isSignup ? "Create an account to save your details and place an order." : isAdmin ? "Use your administrator account to continue." : "Sign in to place an order and view your account.";

  return (
    <form onSubmit={submit} className="mx-auto w-full max-w-md rounded-[2rem] border border-[var(--border)] bg-white/80 p-6 shadow-[0_18px_50px_rgba(84,51,44,0.12)] sm:p-8">
      <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rose)]">Twistify Arts</p>
      <h1 className="mt-3 text-4xl text-[var(--ink)]">{title}</h1>
      <p className="mt-3 font-sans text-sm leading-6 text-[var(--muted)]">{subtitle}</p>
      <div className="mt-7 grid gap-4">
        {isSignup ? <label className="grid gap-1.5 font-sans text-sm font-semibold text-[var(--muted)]">Name<input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" maxLength={80} required className="rounded-xl border border-[var(--border)] px-3 py-3 font-normal text-[var(--ink)] outline-none focus:border-[var(--rose)]" /></label> : null}
        <label className="grid gap-1.5 font-sans text-sm font-semibold text-[var(--muted)]">Email<input value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" type="email" maxLength={254} required className="rounded-xl border border-[var(--border)] px-3 py-3 font-normal text-[var(--ink)] outline-none focus:border-[var(--rose)]" /></label>
        <label className="grid gap-1.5 font-sans text-sm font-semibold text-[var(--muted)]">Password<input value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={isSignup ? "new-password" : "current-password"} type="password" minLength={isSignup ? 8 : undefined} required className="rounded-xl border border-[var(--border)] px-3 py-3 font-normal text-[var(--ink)] outline-none focus:border-[var(--rose)]" /></label>
        {isSignup ? <label className="grid gap-1.5 font-sans text-sm font-semibold text-[var(--muted)]">Confirm password<input value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" type="password" minLength={8} required className="rounded-xl border border-[var(--border)] px-3 py-3 font-normal text-[var(--ink)] outline-none focus:border-[var(--rose)]" /></label> : null}
      </div>
      {error ? <p role="alert" className="mt-4 rounded-xl bg-[#f8eee7] px-3 py-2 font-sans text-sm text-[var(--rose)]">{error}</p> : null}
      <button type="submit" disabled={isSubmitting} className="mt-6 w-full rounded-full bg-[var(--ink)] px-5 py-3 font-sans text-sm font-semibold text-white transition hover:bg-[var(--rose)] disabled:cursor-not-allowed disabled:bg-[#91817a]">{isSubmitting ? "Please wait…" : isSignup ? "Create account" : "Sign in"}</button>
      {!isAdmin ? <p className="mt-5 text-center font-sans text-sm text-[var(--muted)]">{isSignup ? "Already have an account?" : "New to Twistify Arts?"}{" "}<Link href={isSignup ? "/login" : "/signup"} className="font-semibold text-[var(--rose)]">{isSignup ? "Sign in" : "Create an account"}</Link></p> : null}
    </form>
  );
}
