"use client";

import Link from "next/link";
import { signupAction } from "@/lib/actions/auth";
import { FormError, useNfForm } from "@/components/ui/AuthForm";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Logo } from "@/components/ui/Logo";

export default function SignupPage() {
  const [state, formAction] = useNfForm(signupAction);

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex justify-center">
          <Logo />
        </Link>
        <div className="rounded-2xl border border-nf-border bg-nf-surface/60 p-8">
          <h1 className="text-xl font-bold text-white">Open your NairaWallet</h1>
          <p className="mt-1 text-sm text-neutral-400">
            NIN-based KYC. No existing bank account required.
          </p>

          <form action={formAction} className="mt-6 space-y-4">
            <Field label="Full name" name="fullName" placeholder="Adaeze Okafor" autoComplete="name" />
            <Field label="Email" name="email" type="email" placeholder="you@example.com" autoComplete="email" />
            <Field
              label="Phone number"
              name="phone"
              placeholder="08012345678"
              autoComplete="tel"
              inputMode="numeric"
            />
            <Field
              label="NIN (National Identification Number)"
              name="nin"
              placeholder="11-digit NIN"
              inputMode="numeric"
              maxLength={11}
            />
            <Field label="Password" name="password" type="password" autoComplete="new-password" />

            <FormError state={state} />

            <SubmitButton className="w-full" pendingText="Creating account...">
              Create account
            </SubmitButton>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-400">
            Already have a wallet?{" "}
            <Link href="/login" className="font-medium text-nf-green hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  autoComplete,
  inputMode,
  maxLength,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "numeric" | "text";
  maxLength?: number;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-neutral-300">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        required
        className="mt-1.5 w-full rounded-md border border-nf-border bg-neutral-950 px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-nf-green focus:outline-none focus:ring-1 focus:ring-nf-green"
      />
    </label>
  );
}
