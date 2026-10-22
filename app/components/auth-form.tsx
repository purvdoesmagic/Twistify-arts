"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { type ComponentProps, type FormEvent, useState } from "react";

type AuthFormProps = { mode: "login" | "signup" | "admin"; callbackUrl: string; unavailable?: boolean };

export const labelClass = "grid gap-1.5 font-sans text-sm font-semibold text-(--muted)";
export const inputClass = "border border-(--border) px-3 py-3 font-normal text-(--ink) outline-none focus:border-(--rose-deep)";

export function PasswordInput(props: Omit<ComponentProps<"input">, "type" | "className">) {
  const [visible, setVisible] = useState(false);

  return (
    <span className="relative grid">
      <input {...props} type={visible ? "text" : "password"} className={`${inputClass} pr-16`} />
      <button type="button" onClick={() => setVisible(!visible)} aria-label={visible ? "Hide password" : "Show password"} aria-pressed={visible} className="absolute inset-y-0 right-0 px-3 font-sans text-xs font-semibold uppercase tracking-wide text-(--muted) hover:text-(--rose-deep)">{visible ? "Hide" : "Show"}</button>
    </span>
  );
}

function safeCallbackUrl(value: string) {
  // Browsers read "/\evil.com" like "//evil.com", another site.
  return value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/\\") ? value : "/account";
}

export function AuthForm({ mode, callbackUrl, unavailable = false }: AuthFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
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
          body: JSON.stringify({ name, email, phone, password, confirmPassword }),
        });
        const result = (await response.json()) as { error?: string };

        if (!response.ok) throw new Error(result.error ?? "Unable to create your account.");
      }

      const result = await signIn("credentials", {
        identifier: email,
        password,
        portal: isAdmin ? "admin" : "customer",
        redirect: false,
      });

      if (result?.error) throw new Error(isAdmin ? "Invalid admin email or password." : "Invalid email, phone number or password.");

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
    <form onSubmit={submit} className="mx-auto w-full max-w-md bg-(--cream) p-6 sm:p-8">
      <h1 className="mt-3 text-(--ink) text-(length:--step-head) leading-none">{title}</h1>
      <p className="mt-3 font-sans text-sm leading-6 text-(--muted)">{subtitle}</p>
      <div className="mt-7 grid gap-4">
        {isSignup ? <label className={labelClass}>Name<input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" maxLength={80} required className={inputClass} /></label> : null}
        {isSignup
          ? <label className={labelClass}>Email<input value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" type="email" maxLength={254} required className={inputClass} /></label>
          : <label className={labelClass}>{isAdmin ? "Email" : "Email or phone number"}<input value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" type={isAdmin ? "email" : "text"} maxLength={254} required className={inputClass} /></label>}
        {isSignup ? <label className={labelClass}><span>Phone number <span className="font-normal">(optional, lets you sign in with it)</span></span><input value={phone} onChange={(event) => setPhone(event.target.value)} autoComplete="tel" type="tel" maxLength={20} placeholder="98765 43210" className={inputClass} /></label> : null}
        <label className={labelClass}>
          <span className="flex justify-between">Password{!isSignup ? <Link href="/forgot-password" className="font-normal text-(--rose-deep)">Forgot password?</Link> : null}</span>
          <PasswordInput value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={isSignup ? "new-password" : "current-password"} minLength={isSignup ? 8 : undefined} required />
        </label>
        {isSignup ? <label className={labelClass}>Confirm password<PasswordInput value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" minLength={8} required /></label> : null}
      </div>
      {unavailable ? <p role="status" className="mt-4 bg-[#fff5df] px-3 py-2 font-sans text-sm text-[#72573d]">Accounts are not available yet because the store database is not configured. You can still browse the shop.</p> : null}
      {error ? <p role="alert" className="mt-4 bg-[#FBF0E0] px-3 py-2 font-sans text-sm text-(--rose-deep)">{error}</p> : null}
      <button type="submit" disabled={isSubmitting || unavailable} className="mt-6 w-full bg-(--ink) px-5 py-3 font-sans text-sm font-semibold text-white transition hover:bg-(--rose-deep) disabled:cursor-not-allowed disabled:bg-[#91817a]">{isSubmitting ? "Please wait…" : isSignup ? "Create account" : "Sign in"}</button>
      {!isAdmin ? <p className="mt-5 text-center font-sans text-sm text-(--muted)">{isSignup ? "Already have an account?" : "New to Twistify Arts?"}{" "}<Link href={isSignup ? "/login" : "/signup"} className="font-semibold text-(--rose-deep)">{isSignup ? "Sign in" : "Create an account"}</Link></p> : null}
    </form>
  );
}
