import { getCurrentUser } from "@/lib/auth";
import { readDb } from "@/lib/db";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { TransactionList } from "@/components/dashboard/TransactionList";
import { RemitForm } from "@/components/dashboard/RemitForm";

export default async function RemitPage() {
  const user = await getCurrentUser();
  const db = await readDb();
  const transactions = db.transactions
    .filter((t) => t.userId === user?.id && (t.type === "remit_send" || t.type === "remit_receive"))
    .slice(0, 20);

  return (
    <div>
      <PageHeader
        title="NairaRemit"
        description="Send from the UK, US, EU, or Canada to Nigeria — FX rate locked the moment you send."
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px]">
        <div>
          <h2 className="mb-4 text-lg font-semibold text-white">Remittance history</h2>
          <TransactionList transactions={transactions} emptyText="No international transfers yet." />
        </div>

        <RemitForm />
      </div>
    </div>
  );
}
