"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Logo } from "@/components/ui/Logo";
import { logoutAction } from "@/lib/actions/auth";

const links = [
  { href: "/dashboard", label: "Overview", icon: "◆" },
  { href: "/dashboard/wallet", label: "NairaWallet", icon: "₦" },
  { href: "/dashboard/pay", label: "NairaPay", icon: "→" },
  { href: "/dashboard/remit", label: "NairaRemit", icon: "✈" },
  { href: "/dashboard/agents", label: "Agent Network", icon: "◎" },
  { href: "/dashboard/transactions", label: "Transactions", icon: "≡" },
];

export function Sidebar({ fullName }: { fullName: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-nf-border bg-nf-surface/40 px-4 py-6">
      <Link href="/" className="px-2">
        <Logo />
      </Link>

      <nav className="mt-10 flex flex-1 flex-col gap-1">
        {links.map((l) => {
          const active = l.href === "/dashboard" ? pathname === l.href : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={clsx(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-nf-green/15 text-nf-green"
                  : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
              )}
            >
              <span className="w-4 text-center">{l.icon}</span>
              {l.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-nf-border pt-4">
        <p className="truncate px-3 text-xs text-neutral-500">Signed in as</p>
        <p className="truncate px-3 text-sm font-medium text-white">{fullName}</p>
        <form action={logoutAction} className="mt-3">
          <button
            type="submit"
            className="w-full rounded-md border border-nf-border px-3 py-2 text-sm text-neutral-300 transition hover:border-neutral-500 hover:text-white"
          >
            Log out
          </button>
        </form>
      </div>
    </aside>
  );
}
