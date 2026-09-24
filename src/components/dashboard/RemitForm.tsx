"use client";

import { useEffect, useState } from "react";
import { sendRemitAction } from "@/lib/actions/remit";
import { FormError, FormSuccess, useNfForm } from "@/components/ui/AuthForm";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { formatNgn, formatForeign } from "@/lib/format";
import clsx from "clsx";

const CORRIDORS = [
  { code: "GBP", label: "United Kingdom", flag: "🇬🇧" },
  { code: "USD", label: "United States", flag: "🇺🇸" },
  { code: "EUR", label: "European Union", flag: "🇪🇺" },
  { code: "CAD", label: "Canada", flag: "🇨🇦" },
];

const FEE_PCT = 1.5;

export function RemitForm() {
  const [state, formAction] = useNfForm(sendRemitAction);
  const [corridor, setCorridor] = useState("GBP");
  const [amount, setAmount] = useState("100");
  const [rate, setRate] = useState<number | null>(null);
  const [loadingRate, setLoadingRate] = useState(false);

  async function fetchQuote(code: string) {
    setLoadingRate(true);
    try {
      const res = await fetch(`/api/quote?corridor=${code}`);
      const data = await res.json();
      setRate(data.rate);
    } finally {
      setLoadingRate(false);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => fetchQuote(corridor), 0);
    const id = setInterval(() => fetchQuote(corridor), 20000);
    return () => {
      clearTimeout(timeout);
      clearInterval(id);
    };
  }, [corridor]);

  const sourceAmount = Number(amount) || 0;
  const gross = rate ? sourceAmount * rate : 0;
  const fee = Math.round(gross * (FEE_PCT / 100));
  const net = Math.round(gross - fee);

  return (
    <form action={formAction} className="h-fit rounded-xl border border-nf-border bg-nf-surface/50 p-5">
      <h3 className="text-sm font-semibold text-white">Send international transfer</h3>
      <p className="mt-1 text-xs text-neutral-500">USDC settles on the backend; recipient gets Naira.</p>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {CORRIDORS.map((c) => (
          <button
            type="button"
            key={c.code}
            onClick={() => setCorridor(c.code)}
            className={clsx(
              "rounded-lg border px-2 py-2 text-center text-xs font-medium transition",
              corridor === c.code ? "border-nf-green bg-nf-green/10 text-nf-green" : "border-nf-border text-neutral-400 hover:border-neutral-600"
            )}
          >
            <span className="block text-base">{c.flag}</span>
            {c.code}
          </button>
        ))}
      </div>
      <input type="hidden" name="corridor" value={corridor} />
      <input type="hidden" name="lockedRate" value={rate ?? ""} />

      <label className="mt-4 block">
        <span className="text-sm font-medium text-neutral-300">You send ({corridor})</span>
        <input
          name="sourceAmount"
          type="number"
          min={1}
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="mt-1.5 w-full rounded-md border border-nf-border bg-neutral-950 px-3 py-2.5 text-sm text-white focus:border-nf-green focus:outline-none focus:ring-1 focus:ring-nf-green"
        />
      </label>

      <label className="mt-4 block">
        <span className="text-sm font-medium text-neutral-300">Recipient phone (NairaFlow)</span>
        <input
          name="recipientPhone"
          placeholder="08012345678"
          required
          className="mt-1.5 w-full rounded-md border border-nf-border bg-neutral-950 px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-nf-green focus:outline-none focus:ring-1 focus:ring-nf-green"
        />
      </label>

      <div className="mt-4 space-y-1.5 rounded-lg border border-nf-border bg-neutral-950/60 p-3 text-xs text-neutral-400">
        <div className="flex justify-between">
          <span>Live rate</span>
          <span className="text-white">{rate ? `1 ${corridor} = ${formatNgn(rate)}` : loadingRate ? "Loading..." : "—"}</span>
        </div>
        <div className="flex justify-between">
          <span>You send</span>
          <span className="text-white">{formatForeign(sourceAmount, corridor)}</span>
        </div>
        <div className="flex justify-between">
          <span>FX spread ({FEE_PCT}%)</span>
          <span className="text-white">-{formatNgn(fee)}</span>
        </div>
        <div className="flex justify-between border-t border-nf-border pt-1.5 font-semibold">
          <span className="text-neutral-300">Recipient gets</span>
          <span className="text-nf-green">{formatNgn(net)}</span>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <FormError state={state} />
        <FormSuccess state={state} />
      </div>

      <SubmitButton className="mt-4 w-full" pendingText="Locking rate & sending...">
        Lock rate & send
      </SubmitButton>
    </form>
  );
}
