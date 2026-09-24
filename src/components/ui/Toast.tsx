"use client";

import { useEffect, useState } from "react";

const TOAST_EVENT = "nf:toast";
const TOAST_DURATION_MS = 4500;

type ToastDetail = { message: string };

/**
 * Fire a transaction-success (or other) toast from anywhere on the dashboard.
 * This is the in-app stand-in for a real notification channel.
 */
export function showToast(message: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<ToastDetail>(TOAST_EVENT, { detail: { message } }));
  // TODO(notifications): wire to email/SMS provider here. Today this only
  // raises an in-app toast; a real deployment would also queue an email/SMS
  // via a provider (e.g. Termii/Africa's Talking for SMS, Postmark/SES for
  // email) keyed off the same successful Server Action.
}

type Toast = { id: number; message: string };

export function ToastHost() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    let nextId = 0;
    function handleToast(e: Event) {
      const detail = (e as CustomEvent<ToastDetail>).detail;
      if (!detail?.message) return;
      const id = nextId++;
      setToasts((prev) => [...prev, { id, message: detail.message }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, TOAST_DURATION_MS);
    }
    window.addEventListener(TOAST_EVENT, handleToast);
    return () => window.removeEventListener(TOAST_EVENT, handleToast);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-50 flex flex-col items-center gap-2 px-4 sm:top-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className="pointer-events-auto w-full max-w-sm rounded-md border border-nf-green/30 bg-neutral-900/95 px-4 py-3 text-sm font-medium text-nf-green shadow-lg backdrop-blur"
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
