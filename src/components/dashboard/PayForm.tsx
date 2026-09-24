"use client";

import { useState } from "react";
import { sendPayAction } from "@/lib/actions/pay";
import { FormError, FormSuccess, useNfForm } from "@/components/ui/AuthForm";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { QrScanner } from "@/components/dashboard/QrScanner";

export function PayForm() {
  const [state, formAction] = useNfForm(sendPayAction);
  const [recipientPhone, setRecipientPhone] = useState("");
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannedName, setScannedName] = useState<string | null>(null);

  return (
    <form action={formAction} className="rounded-xl border border-nf-border bg-nf-surface/50 p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-white">Send money</h3>
          <p className="mt-1 text-xs text-neutral-500">Recipient must already have a NairaFlow wallet.</p>
        </div>
        {!scannerOpen && (
          <button
            type="button"
            onClick={() => setScannerOpen(true)}
            className="shrink-0 rounded-md border border-nf-border px-3 py-2 text-xs font-medium text-neutral-300 transition hover:border-nf-green/50 hover:text-nf-green"
          >
            Scan to pay
          </button>
        )}
      </div>

      {scannerOpen && (
        <div className="mt-4">
          <QrScanner
            onScan={(phone, name) => {
              setRecipientPhone(phone);
              setScannedName(name ?? null);
              setScannerOpen(false);
            }}
            onClose={() => setScannerOpen(false)}
          />
        </div>
      )}

      <label className="mt-4 block">
        <span className="text-sm font-medium text-neutral-300">Recipient phone number</span>
        <input
          name="recipientPhone"
          placeholder="08012345678"
          required
          value={recipientPhone}
          onChange={(e) => {
            setRecipientPhone(e.target.value);
            setScannedName(null);
          }}
          className="mt-1.5 w-full rounded-md border border-nf-border bg-neutral-950 px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-nf-green focus:outline-none focus:ring-1 focus:ring-nf-green"
        />
        {scannedName && (
          <span className="mt-1 block text-xs text-nf-green">Scanned: {scannedName}</span>
        )}
      </label>

      <label className="mt-4 block">
        <span className="text-sm font-medium text-neutral-300">Amount (₦)</span>
        <input
          name="amount"
          type="number"
          min={50}
          step={50}
          placeholder="5000"
          required
          className="mt-1.5 w-full rounded-md border border-nf-border bg-neutral-950 px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-nf-green focus:outline-none focus:ring-1 focus:ring-nf-green"
        />
      </label>

      <label className="mt-4 block">
        <span className="text-sm font-medium text-neutral-300">Note (optional)</span>
        <input
          name="note"
          placeholder="For market goods"
          maxLength={140}
          className="mt-1.5 w-full rounded-md border border-nf-border bg-neutral-950 px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-nf-green focus:outline-none focus:ring-1 focus:ring-nf-green"
        />
      </label>

      <p className="mt-3 text-[11px] text-neutral-500">Flat ₦50 fee applies on transfers above ₦5,000.</p>

      <div className="mt-4 space-y-2">
        <FormError state={state} />
        <FormSuccess state={state} />
      </div>

      <SubmitButton className="mt-4 w-full" pendingText="Sending...">
        Send now
      </SubmitButton>
    </form>
  );
}
