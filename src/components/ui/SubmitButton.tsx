"use client";

import { useFormStatus } from "react-dom";
import clsx from "clsx";

export function SubmitButton({
  children,
  className,
  pendingText = "Please wait...",
}: {
  children: React.ReactNode;
  className?: string;
  pendingText?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={clsx(
        "rounded-md bg-nf-green px-4 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-nf-green/90 disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
    >
      {pending ? pendingText : children}
    </button>
  );
}
