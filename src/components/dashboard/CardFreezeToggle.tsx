"use client";

import { toggleCardFreezeAction } from "@/lib/actions/card";
import { FormError, FormSuccess, useNfForm } from "@/components/ui/AuthForm";
import { SubmitButton } from "@/components/ui/SubmitButton";
import type { Card } from "@/lib/types";

export function CardFreezeToggle({ status }: { status: Card["status"] }) {
  const [state, formAction] = useNfForm(toggleCardFreezeAction);
  const frozen = status === "frozen";

  return (
    <form action={formAction} className="mt-4 space-y-2">
      <FormError state={state} />
      <FormSuccess state={state} />
      <SubmitButton
        className={
          frozen
            ? "w-full"
            : "w-full bg-red-500/15! text-red-300! hover:bg-red-500/25!"
        }
        pendingText="Updating..."
      >
        {frozen ? "Unfreeze card" : "Freeze card"}
      </SubmitButton>
    </form>
  );
}
