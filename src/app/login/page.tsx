"use client";

import Link from "next/link";
import { loginAction } from "@/lib/actions/auth";
import { FormError, useNfForm } from "@/components/ui/AuthForm";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Logo } from "@/components/ui/Logo";

export default function LoginPage() {
  const [state, formAction] = useNfForm(loginAction);

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex justify-center">
          <Logo />
        </Link>
        <div className="rounded-2xl border border-nf-border bg-nf-surface/60 p-8">
          <h1 className="text-xl font-bold text-white">Welcome back</h1>
          <p className="mt-1 text-sm text-neutral-400">Log in to your NairaFlow wallet.</p>

          <form action={formAction} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-neutral-300">Email or phone</span>
              <input
                name="identifier"
                placeholder="you@example.com or 08012345678"
                required
                className="mt-1.5 w-full rounded-md border border-nf-border bg-neutral-950 px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-nf-green focus:outline-none focus:ring-1 focus:ring-nf-green"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-neutral-300">Password</span>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1.5 w-full rounded-md border border-nf-border bg-neutral-950 px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-nf-green focus:outline-none focus:ring-1 focus:ring-nf-green"
              />
            </label>

            <FormError state={state} />

            <SubmitButton className="w-full" pendingText="Logging in...">
              Log in
            </SubmitButton>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-400">
            New to NairaFlow?{" "}
            <Link href="/signup" className="font-medium text-nf-green hover:underline">
              Open an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
