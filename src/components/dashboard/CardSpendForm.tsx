"use client";

import { useState } from "react";
import clsx from "clsx";
import { simulateCardSpendAction } from "@/lib/actions/card";
import { FormError, FormSuccess, useNfForm } from "@/components/ui/AuthForm";
import { SubmitButton } from "@/components/ui/SubmitButton";

const MERCHANTS = ["Amazon", "eBay", "Other"] as const;

export function CardSpendForm() {
  const [state, formAction] = useNfForm(simulateCardSpendAction);
  const [merchant, setMerchant] = useState<(typeof MERCHANTS)[number]>("Amazon");
  const [customMerchant, setCustomMerchant] = useState("");

  const effectiveMerchant = merchant === "Other" ? customMerchant : merchant;

  return (
    <form action={formAction} className="h-fit rounded-xl border border-nf-border bg-nf-surface/50 p-5">
      <h3 className="text-sm font-semibold text-white">Simulate a purchase</h3>
      <p className="mt-1 text-xs text-neutral-500">
        Demo only — this does not place a real order on any site. No live Amazon/eBay checkout is
        integrated.
      </p>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {MERCHANTS.map((m) => (
          <button
            type="button"
            key={m}
            onClick={() => setMerchant(m)}
            className={clsx(
              "rounded-lg border px-2 py-2 text-center text-xs font-medium transition",
              merchant === m ? "border-nf-green bg-nf-green/10 text-nf-green" : "border-nf-border text-neutral-400 hover:border-neutral-600"
            )}
          >
            {m}
          </button>
        ))}
      </div>

      {merchant === "Other" && (
        <label className="mt-3 block">
          <span className="text-sm font-medium text-neutral-300">Merchant name</span>
          <input
            value={customMerchant}
            onChange={(e) => setCustomMerchant(e.target.value)}
            placeholder="e.g. Etsy"
            className="mt-1.5 w-full rounded-md border border-nf-border bg-neutral-950 px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-nf-green focus:outline-none focus:ring-1 focus:ring-nf-green"
          />
        </label>
      )}
      <input type="hidden" name="merchant" value={effectiveMerchant} />

      <label className="mt-4 block">
        <span className="text-sm font-medium text-neutral-300">Amount (USD)</span>
        <input
          name="amountUsd"
          type="number"
          min={0.01}
          step="0.01"
          defaultValue="25.00"
          required
          className="mt-1.5 w-full rounded-md border border-nf-border bg-neutral-950 px-3 py-2.5 text-sm text-white focus:border-nf-green focus:outline-none focus:ring-1 focus:ring-nf-green"
        />
      </label>

      <div className="mt-4 space-y-2">
        <FormError state={state} />
        <FormSuccess state={state} />
      </div>

      <SubmitButton className="mt-4 w-full" pendingText="Simulating...">
        Simulate purchase
      </SubmitButton>
    </form>
  );
}
