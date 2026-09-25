import { readDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { AgentList } from "@/components/dashboard/AgentList";

export default async function AgentsPage() {
  const user = await getCurrentUser();
  const db = await readDb();
  const wallet = db.wallets.find((w) => w.userId === user?.id);

  return (
    <div>
      <PageHeader
        title="Agent Network"
        description="Cash-in or cash-out at any NairaFlow agent in Lagos & Abuja. Agents earn 0.5% commission per transaction."
      />
      <AgentList agents={db.agents} balanceNgn={wallet?.balanceNgn ?? 0} />
    </div>
  );
}
