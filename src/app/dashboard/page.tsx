import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { readDb } from "@/lib/db";
import { formatNgn } from "@/lib/format";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { TransactionList } from "@/components/dashboard/TransactionList";

export default async function DashboardOverview() {
  const user = await getCurrentUser();
  const db = await readDb();
  const wallet = db.wallets.find((w) => w.userId === user?.id);
  const transactions = db.transactions.filter((t) => t.userId === user?.id).slice(0, 6);

  const quickActions = [
    { href: "/dashboard/wallet", label: "Fund wallet", icon: "₦" },
    { href: "/dashboard/pay", label: "Send NairaPay", icon: "→" },
    { href: "/dashboard/remit", label: "International remit", icon: "✈" },
    { href: "/dashboard/card", label: "NairaCard", icon: "💳" },
    { href: "/dashboard/agents", label: "Find an agent", icon: "◎" },
  ];

  return (
    <div>
      <PageHeader title={`Welcome back, ${user?.fullName.split(" ")[0]}`} description="Here's what's happening with your wallet." />

      <div className="rounded-2xl border border-nf-border bg-gradient-to-br from-nf-green-dark/40 to-nf-surface p-8">
        <p className="text-sm text-neutral-300">NairaWallet balance</p>
        <p className="mt-2 text-4xl font-bold text-white">{formatNgn(wallet?.balanceNgn ?? 0)}</p>
        <p className="mt-1 text-xs text-neutral-400">
          Tier {user?.kycTier} KYC · NIN verified · Account {user?.phone}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {quickActions.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="flex flex-col items-center gap-2 rounded-xl border border-nf-border bg-nf-surface/50 px-3 py-5 text-center transition hover:border-nf-green/50 hover:bg-nf-green/5"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-nf-green/15 text-nf-green">
              {a.icon}
            </span>
            <span className="text-xs font-medium text-neutral-200">{a.label}</span>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Recent activity</h2>
          <Link href="/dashboard/transactions" className="text-sm text-nf-green hover:underline">
            View all
          </Link>
        </div>
        <TransactionList transactions={transactions} />
      </div>
    </div>
  );
}
