"use client";

import { useEffect, useState } from "react";
import { fundCardAction } from "@/lib/actions/card";
import { FormError, FormSuccess, useNfForm } from "@/components/ui/AuthForm";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { formatNgn, formatForeign } from "@/lib/format";

const FEE_PCT = 1.5;

export function FundCardForm() {
  const [state, formAction] = useNfForm(fundCardAction);
  const [amount, setAmount] = useState("50000");
  const [rate, setRate] = useState<number | null>(null);
  const [loadingRate, setLoadingRate] = useState(false);

  async function fetchQuote() {
    setLoadingRate(true);
    try {
      const res = await fetch("/api/quote?corridor=USD");
      const data = await res.json();
      setRate(data.rate);
    } finally {
      setLoadingRate(false);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => fetchQuote(), 0);
    const id = setInterval(() => fetchQuote(), 20000);
    return () => {
      clearTimeout(timeout);
      clearInterval(id);
    };
  }, []);

  const amountNgn = Number(amount) || 0;
  const grossUsd = rate ? amountNgn / rate : 0;
  const feeUsd = grossUsd * (FEE_PCT / 100);
  const netUsd = Math.round((grossUsd - feeUsd) * 100) / 100;

  return (
    <form action={formAction} className="h-fit rounded-xl border border-nf-border bg-nf-surface/50 p-5">
      <h3 className="text-sm font-semibold text-white">Fund NairaCard</h3>
      <p className="mt-1 text-xs text-neutral-500">Move Naira from your wallet into USD card balance.</p>

      <input type="hidden" name="lockedRate" value={rate ?? ""} />

      <label className="mt-4 block">
        <span className="text-sm font-medium text-neutral-300">Amount from wallet (₦)</span>
        <input
          name="amountNgn"
          type="number"
          min={1}
          step="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="mt-1.5 w-full rounded-md border border-nf-border bg-neutral-950 px-3 py-2.5 text-sm text-white focus:border-nf-green focus:outline-none focus:ring-1 focus:ring-nf-green"
        />
      </label>

      <div className="mt-4 space-y-1.5 rounded-lg border border-nf-border bg-neutral-950/60 p-3 text-xs text-neutral-400">
        <div className="flex justify-between">
          <span>Live rate</span>
          <span className="text-white">{rate ? `${formatNgn(rate)} = $1` : loadingRate ? "Loading..." : "—"}</span>
        </div>
        <div className="flex justify-between">
          <span>You send</span>
          <span className="text-white">{formatNgn(amountNgn)}</span>
        </div>
        <div className="flex justify-between">
          <span>FX spread ({FEE_PCT}%)</span>
          <span className="text-white">-{formatForeign(feeUsd, "USD")}</span>
        </div>
        <div className="flex justify-between border-t border-nf-border pt-1.5 font-semibold">
          <span className="text-neutral-300">Card gets</span>
          <span className="text-nf-green">{formatForeign(netUsd, "USD")}</span>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <FormError state={state} />
        <FormSuccess state={state} />
      </div>

      <SubmitButton className="mt-4 w-full" pendingText="Funding...">
        Fund card
      </SubmitButton>
    </form>
  );
}
