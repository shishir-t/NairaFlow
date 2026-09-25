import type { Card } from "@/lib/types";
import clsx from "clsx";

export function CardDisplay({ card }: { card: Card }) {
  const expiry = `${card.expiryMonth.toString().padStart(2, "0")}/${card.expiryYear.toString().slice(-2)}`;
  const frozen = card.status === "frozen";

  return (
    <div
      className={clsx(
        "relative aspect-[1.586/1] w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-nf-green-dark via-nf-green to-nf-gold p-6 text-neutral-950 shadow-xl",
        frozen && "grayscale"
      )}
    >
      <div className="absolute inset-0 bg-black/10" />
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-950/70">NairaCard</p>
          <span className="rounded-full border border-neutral-950/30 bg-neutral-950/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-neutral-950/80">
            USD Virtual
          </span>
        </div>

        <div>
          <p className="font-mono text-lg tracking-[0.25em] text-neutral-950 sm:text-xl">
            •••• •••• •••• {card.last4}
          </p>
        </div>

        <div className="flex items-end justify-between text-xs">
          <div>
            <p className="text-neutral-950/60">Cardholder</p>
            <p className="font-semibold">{card.cardholderName}</p>
          </div>
          <div className="text-right">
            <p className="text-neutral-950/60">Expires</p>
            <p className="font-semibold">{expiry}</p>
          </div>
        </div>
      </div>

      {frozen && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-950/50">
          <span className="rounded-md border border-white/40 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
            Frozen
          </span>
        </div>
      )}

      <div className="absolute bottom-2 left-0 w-full text-center">
        <span className="rounded-full bg-neutral-950/70 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-white/80">
          Simulated — not a real payment card
        </span>
      </div>
    </div>
  );
}
