import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { readDb } from "@/lib/db";
import { formatNgn } from "@/lib/format";
import { PageHeader } from "@/components/dashboard/PageHeader";
import type { TransactionType } from "@/lib/types";

const TYPE_LABELS: Record<TransactionType, string> = {
  fund: "Wallet funding",
  p2p_send: "NairaPay (send)",
  p2p_receive: "NairaPay (receive)",
  remit_send: "NairaRemit (send)",
  remit_receive: "NairaRemit (receive)",
  agent_cash_in: "Agent cash-in",
  agent_cash_out: "Agent cash-out",
};

const TYPE_ORDER: TransactionType[] = [
  "fund",
  "p2p_send",
  "p2p_receive",
  "remit_send",
  "remit_receive",
  "agent_cash_in",
  "agent_cash_out",
];

function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-nf-border bg-nf-surface/50 p-5">
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
      {hint && <p className="mt-1 text-xs text-neutral-500">{hint}</p>}
    </div>
  );
}

export default async function AdminPage() {
  // NOTE: this page is only behind the same session check as every other
  // /dashboard/* route (see src/app/dashboard/layout.tsx). It is NOT
  // role-gated — see the README for why that matters before shipping this.
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const db = readDb();

  const totalWalletBalanceNgn = db.wallets.reduce((sum, w) => sum + w.balanceNgn, 0);
  const totalUsers = db.users.length;
  const totalAgents = db.agents.length;

  const volumeByType = new Map<TransactionType, { count: number; amountNgn: number }>();
  for (const type of TYPE_ORDER) volumeByType.set(type, { count: 0, amountNgn: 0 });
  for (const t of db.transactions) {
    const bucket = volumeByType.get(t.type) ?? { count: 0, amountNgn: 0 };
    bucket.count += 1;
    bucket.amountNgn += t.amountNgn;
    volumeByType.set(t.type, bucket);
  }

  const totalTransactionVolumeNgn = db.transactions.reduce((sum, t) => sum + t.amountNgn, 0);
  const totalFeesNgn = db.transactions.reduce((sum, t) => sum + (t.feeNgn ?? 0), 0);

  const cashIn = volumeByType.get("agent_cash_in") ?? { count: 0, amountNgn: 0 };
  const cashOut = volumeByType.get("agent_cash_out") ?? { count: 0, amountNgn: 0 };

  return (
    <div>
      <PageHeader
        title="Admin / Ops"
        description="Aggregate stats pulled directly from the data store. Internal use only."
      />

      <div className="mb-6 rounded-md border border-nf-gold/30 bg-nf-gold/10 px-4 py-3 text-sm text-nf-gold">
        This view has no role-based access control yet — any signed-in user can reach it. See README for the
        access-control work needed before this is safe to expose beyond admins.
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total wallet balance" value={formatNgn(totalWalletBalanceNgn)} hint={`${totalUsers} users`} />
        <StatCard label="Total transaction volume" value={formatNgn(totalTransactionVolumeNgn)} hint={`${db.transactions.length} transactions`} />
        <StatCard label="Total fees collected" value={formatNgn(totalFeesNgn)} />
        <StatCard label="Registered agents" value={String(totalAgents)} />
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-white">Volume by transaction type</h2>
        <div className="overflow-hidden rounded-xl border border-nf-border">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-nf-border bg-nf-surface/50 text-xs uppercase tracking-wide text-neutral-500">
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Count</th>
                <th className="px-5 py-3 font-medium">Volume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nf-border">
              {TYPE_ORDER.map((type) => {
                const bucket = volumeByType.get(type) ?? { count: 0, amountNgn: 0 };
                return (
                  <tr key={type} className="bg-nf-surface/30">
                    <td className="px-5 py-3 text-neutral-200">{TYPE_LABELS[type]}</td>
                    <td className="px-5 py-3 text-neutral-400">{bucket.count}</td>
                    <td className="px-5 py-3 font-medium text-white">{formatNgn(bucket.amountNgn)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-white">Agent network: cash-in vs cash-out</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatCard label="Cash-in volume" value={formatNgn(cashIn.amountNgn)} hint={`${cashIn.count} transactions`} />
          <StatCard label="Cash-out volume" value={formatNgn(cashOut.amountNgn)} hint={`${cashOut.count} transactions`} />
        </div>
      </div>
    </div>
  );
}
