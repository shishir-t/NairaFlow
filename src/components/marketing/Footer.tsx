import { Logo } from "@/components/ui/Logo";

export function MarketingFooter() {
  return (
    <footer className="mx-auto max-w-6xl px-6 py-16 text-center">
      <Logo className="justify-center" />
      <p className="mt-3 text-neutral-400">Banking 40 million people the system forgot.</p>
      <p className="mt-4 text-sm text-neutral-500">
        hello@nairaflow.io &nbsp;•&nbsp; nairaflow.io
      </p>
      <p className="mx-auto mt-6 max-w-md text-xs text-neutral-600">
        Financials and projections available in data room upon request. This deck is confidential.
      </p>
    </footer>
  );
}
