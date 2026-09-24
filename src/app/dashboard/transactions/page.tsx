import { getCurrentUser } from "@/lib/auth";
import { readDb } from "@/lib/db";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { TransactionList } from "@/components/dashboard/TransactionList";

export default async function TransactionsPage() {
  const user = await getCurrentUser();
  const db = await readDb();
  const transactions = db.transactions.filter((t) => t.userId === user?.id);

  return (
    <div>
      <PageHeader title="Transactions" description="Full history across NairaWallet, NairaPay, NairaRemit, and agent network." />
      <TransactionList transactions={transactions} />
    </div>
  );
}
