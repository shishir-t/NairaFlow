"use client";

import { issueCardAction } from "@/lib/actions/card";
import { FormError, FormSuccess, useNfForm } from "@/components/ui/AuthForm";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function IssueCardButton() {
  const [state, formAction] = useNfForm(issueCardAction);

  return (
    <form action={formAction} className="w-full max-w-xs space-y-3">
      <FormError state={state} />
      <FormSuccess state={state} />
      <SubmitButton className="w-full" pendingText="Issuing...">
        Issue my NairaCard
      </SubmitButton>
    </form>
  );
}
