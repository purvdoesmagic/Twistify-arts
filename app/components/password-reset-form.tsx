"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { inputClass, labelClass, PasswordInput } from "@/app/components/auth-form";

// Without a token it asks for the account; with one (from the emailed link) it sets the new password.
export function PasswordResetForm({ token }: { token?: string }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(token ? "/api/auth/reset-password" : "/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(token ? { token, password, confirmPassword } : { identifier }),
      });
      const result = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) throw new Error(result.error ?? "Please try again.");
      setDone(token ? "Your password has been updated. You can now sign in." : (result.message ?? "Check your email."));
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="mx-auto w-full max-w-md bg-[var(--cream)] p-6 sm:p-8">
      <h1 className="mt-3 text-[var(--ink)] text-[length:var(--step-head)] leading-none">{token ? "Choose a new password" : "Forgot your password?"}</h1>
      <p className="mt-3 font-sans text-sm leading-6 text-[var(--muted)]">{token ? "Enter a new password for your account." : "Enter your email or phone number and we'll email you a link to reset it."}</p>
      {done ? (
        <p role="status" className="mt-6 bg-[#eef6ea] px-3 py-2 font-sans text-sm text-[#3d5a32]">{done}</p>
      ) : (
        <>
          <div className="mt-7 grid gap-4">
            {token ? (
              <>
                <label className={labelClass}>New password<PasswordInput value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" minLength={8} required /></label>
                <label className={labelClass}>Confirm new password<PasswordInput value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" minLength={8} required /></label>
              </>
            ) : (
              <label className={labelClass}>Email or phone number<input value={identifier} onChange={(event) => setIdentifier(event.target.value)} autoComplete="username" maxLength={254} required className={inputClass} /></label>
            )}
          </div>
          {error ? <p role="alert" className="mt-4 bg-[#FBF0E0] px-3 py-2 font-sans text-sm text-[var(--rose-deep)]">{error}</p> : null}
          <button type="submit" disabled={isSubmitting} className="mt-6 w-full bg-[var(--ink)] px-5 py-3 font-sans text-sm font-semibold text-white transition hover:bg-[var(--rose-deep)] disabled:cursor-not-allowed disabled:bg-[#91817a]">{isSubmitting ? "Please wait…" : token ? "Update password" : "Email me a reset link"}</button>
        </>
      )}
      <p className="mt-5 text-center font-sans text-sm text-[var(--muted)]"><Link href="/login" className="font-semibold text-[var(--rose-deep)]">Back to sign in</Link></p>
    </form>
  );
}
