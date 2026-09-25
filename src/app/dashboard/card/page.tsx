import { getCurrentUser } from "@/lib/auth";
import { readDb } from "@/lib/db";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { TransactionList } from "@/components/dashboard/TransactionList";
import { CardDisplay } from "@/components/dashboard/CardDisplay";
import { CardFreezeToggle } from "@/components/dashboard/CardFreezeToggle";
import { FundCardForm } from "@/components/dashboard/FundCardForm";
import { CardSpendForm } from "@/components/dashboard/CardSpendForm";
import { IssueCardButton } from "@/components/dashboard/IssueCardButton";
import { formatForeign } from "@/lib/format";

export default async function CardPage() {
  const user = await getCurrentUser();
  const db = await readDb();
  const card = db.cards.find((c) => c.userId === user?.id);
  const transactions = db.transactions
    .filter((t) => t.userId === user?.id && (t.type === "card_fund" || t.type === "card_spend"))
    .slice(0, 20);

  return (
    <div>
      <PageHeader
        title="NairaCard"
        description="A simulated virtual USD card, funded from your NairaWallet, for spending on international sites like Amazon and eBay."
      />

      {!card ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-nf-border p-12 text-center">
          <p className="text-sm text-neutral-400">
            You don&apos;t have a NairaCard yet. Issue one to fund it from your wallet and start
            simulating international purchases.
          </p>
          <IssueCardButton />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px]">
          <div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-[280px_1fr] sm:items-start">
              <CardDisplay card={card} />
              <div className="rounded-xl border border-nf-border bg-nf-surface/50 p-5">
                <p className="text-sm text-neutral-400">Card balance</p>
                <p className="mt-1 text-3xl font-bold text-white">{formatForeign(card.balanceUsd, "USD")}</p>
                <p className="mt-1 text-xs text-neutral-500">
                  Status: <span className="capitalize">{card.status}</span>
                </p>
                <CardFreezeToggle status={card.status} />
              </div>
            </div>

            <h2 className="mb-4 mt-10 text-lg font-semibold text-white">Card activity</h2>
            <TransactionList transactions={transactions} emptyText="No card activity yet." />
          </div>

          <div className="space-y-6">
            <FundCardForm />
            <CardSpendForm />
          </div>
        </div>
      )}
    </div>
  );
}
