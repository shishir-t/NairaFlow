import { getCurrentUser } from "@/lib/auth";
import { readDb } from "@/lib/db";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { TransactionList } from "@/components/dashboard/TransactionList";
import { PayForm } from "@/components/dashboard/PayForm";
import { ReceiveQr } from "@/components/dashboard/ReceiveQr";

export default async function PayPage() {
  const user = await getCurrentUser();
  const db = await readDb();
  const transactions = db.transactions
    .filter((t) => t.userId === user?.id && (t.type === "p2p_send" || t.type === "p2p_receive"))
    .slice(0, 20);

  return (
    <div>
      <PageHeader title="NairaPay" description="Send by phone number in seconds, or get paid via QR code." />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <h2 className="mb-4 text-lg font-semibold text-white">Recent transfers</h2>
          <TransactionList transactions={transactions} emptyText="No transfers yet. Send your first NairaPay payment." />
        </div>

        <div className="space-y-6">
          <PayForm />
          {user && <ReceiveQr phone={user.phone} name={user.fullName} />}
        </div>
      </div>
    </div>
  );
}
