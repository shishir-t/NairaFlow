"use client";

import { useActionState } from "react";
import type { FormState } from "@/lib/actions/state";

export function FormError({ state }: { state: FormState }) {
  if (!state?.error) return null;
  return (
    <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
      {state.error}
    </p>
  );
}

export function FormSuccess({ state }: { state: FormState }) {
  if (!state?.success) return null;
  return (
    <p className="rounded-md border border-nf-green/30 bg-nf-green/10 px-3 py-2 text-sm text-nf-green">
      {state.success}
    </p>
  );
}

export function useNfForm(
  action: (prev: FormState, formData: FormData) => Promise<FormState>
) {
  return useActionState(action, undefined);
}
