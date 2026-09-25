import type { Transaction } from "@/lib/types";
import { formatNgn, formatDate, formatForeign } from "@/lib/format";
import clsx from "clsx";

const TYPE_LABELS: Record<Transaction["type"], string> = {
  fund: "Wallet funding",
  p2p_send: "Sent to",
  p2p_receive: "Received from",
  remit_send: "Remittance sent",
  remit_receive: "Remittance received",
  agent_cash_in: "Agent cash-in",
  agent_cash_out: "Agent cash-out",
  card_fund: "NairaCard funded",
  card_spend: "NairaCard purchase (simulated)",
};

const CREDIT_TYPES: Transaction["type"][] = ["fund", "p2p_receive", "remit_receive", "agent_cash_in"];

export function TransactionList({ transactions, emptyText }: { transactions: Transaction[]; emptyText?: string }) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-nf-border p-10 text-center text-sm text-neutral-500">
        {emptyText ?? "No transactions yet."}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-nf-border">
      <ul className="divide-y divide-nf-border">
        {transactions.map((t) => {
          const credit = CREDIT_TYPES.includes(t.type);
          return (
            <li key={t.id} className="flex items-center justify-between gap-4 bg-nf-surface/30 px-5 py-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {TYPE_LABELS[t.type]}
                  {t.counterpartyName ? ` ${t.counterpartyName}` : ""}
                  {t.merchant ? ` at ${t.merchant}` : ""}
                </p>
                <p className="mt-0.5 truncate text-xs text-neutral-500">
                  {t.method ? `${t.method} · ` : ""}
                  {formatDate(t.createdAt)}
                  {t.sourceAmount && t.sourceCurrency && t.fxRate
                    ? ` · ${formatForeign(t.sourceAmount, t.sourceCurrency)} @ ${t.fxRate.toFixed(2)}`
                    : ""}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className={clsx("text-sm font-semibold", credit ? "text-nf-green" : "text-white")}>
                  {credit ? "+" : "-"}
                  {t.type === "card_spend" && t.sourceAmount && t.sourceCurrency
                    ? formatForeign(t.sourceAmount, t.sourceCurrency)
                    : formatNgn(t.amountNgn)}
                </p>
                <p
                  className={clsx(
                    "mt-0.5 text-[11px] capitalize",
                    t.status === "completed" && "text-neutral-500",
                    t.status === "pending" && "text-nf-gold",
                    t.status === "locked" && "text-blue-400"
                  )}
                >
                  {t.status}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
