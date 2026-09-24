"use client";

import { QRCodeSVG } from "qrcode.react";

export function ReceiveQr({ phone, name }: { phone: string; name: string }) {
  const payload = JSON.stringify({ app: "nairaflow", action: "pay", phone, name });

  return (
    <div className="rounded-xl border border-nf-border bg-nf-surface/50 p-5 text-center">
      <h3 className="text-sm font-semibold text-white">Get paid via QR</h3>
      <p className="mt-1 text-xs text-neutral-500">Let market traders scan to pay you instantly.</p>
      <div className="mx-auto mt-4 w-fit rounded-lg bg-white p-3">
        <QRCodeSVG value={payload} size={150} />
      </div>
      <p className="mt-3 text-sm font-medium text-white">{name}</p>
      <p className="text-xs text-neutral-500">{phone}</p>
    </div>
  );
}
