import { getCurrentUser } from "@/lib/auth";
import { readDb } from "@/lib/db";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { TransactionList } from "@/components/dashboard/TransactionList";
import { formatNgn } from "@/lib/format";
import { FundWalletForm } from "@/components/dashboard/FundWalletForm";

export default async function WalletPage() {
  const user = await getCurrentUser();
  const db = await readDb();
  const wallet = db.wallets.find((w) => w.userId === user?.id);
  const transactions = db.transactions.filter((t) => t.userId === user?.id && t.type === "fund");

  return (
    <div>
      <PageHeader title="NairaWallet" description="Mobile-first banking — fund via bank transfer, USSD, or a cash agent." />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <h2 className="mb-4 text-lg font-semibold text-white">Funding history</h2>
          <TransactionList transactions={transactions} emptyText="No funding yet. Add money to your wallet to get started." />
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-nf-border bg-nf-surface/50 p-5 text-center">
            <p className="text-xs text-neutral-400">Current balance</p>
            <p className="mt-1 text-2xl font-bold text-white">{formatNgn(wallet?.balanceNgn ?? 0)}</p>
          </div>
          <FundWalletForm />
        </div>
      </div>
    </div>
  );
}
