"use client";

import { useState } from "react";
import { fundWalletAction } from "@/lib/actions/wallet";
import { FormError, FormSuccess, useNfForm } from "@/components/ui/AuthForm";
import { SubmitButton } from "@/components/ui/SubmitButton";
import clsx from "clsx";

const methods = [
  { value: "bank_transfer", label: "Bank Transfer", desc: "Instant, via your linked bank account" },
  { value: "ussd", label: "USSD (*347#)", desc: "No internet required — works on any phone" },
  { value: "cash_agent", label: "Cash Agent", desc: "Deposit cash at any NairaFlow agent" },
];

export function FundWalletForm() {
  const [state, formAction] = useNfForm(fundWalletAction);
  const [method, setMethod] = useState("bank_transfer");

  return (
    <form action={formAction} className="rounded-xl border border-nf-border bg-nf-surface/50 p-5">
      <h3 className="text-sm font-semibold text-white">Fund your wallet</h3>

      <div className="mt-4 space-y-2">
        {methods.map((m) => (
          <label
            key={m.value}
            className={clsx(
              "flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 transition",
              method === m.value ? "border-nf-green bg-nf-green/10" : "border-nf-border hover:border-neutral-600"
            )}
          >
            <input
              type="radio"
              name="method"
              value={m.value}
              checked={method === m.value}
              onChange={() => setMethod(m.value)}
              className="mt-0.5 accent-nf-green"
            />
            <span>
              <span className="block text-sm font-medium text-white">{m.label}</span>
              <span className="block text-xs text-neutral-500">{m.desc}</span>
            </span>
          </label>
        ))}
      </div>

      <label className="mt-4 block">
        <span className="text-sm font-medium text-neutral-300">Amount (₦)</span>
        <input
          name="amount"
          type="number"
          min={100}
          step={100}
          placeholder="10000"
          required
          className="mt-1.5 w-full rounded-md border border-nf-border bg-neutral-950 px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-nf-green focus:outline-none focus:ring-1 focus:ring-nf-green"
        />
      </label>

      <div className="mt-4 space-y-2">
        <FormError state={state} />
        <FormSuccess state={state} />
      </div>

      <SubmitButton className="mt-4 w-full" pendingText="Processing...">
        Add money
      </SubmitButton>
    </form>
  );
}
