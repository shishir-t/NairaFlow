"use client";

import { useState } from "react";
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
  { href: "/dashboard/admin", label: "Admin / Ops", icon: "⚙" },
];

function SidebarLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="mt-10 flex flex-1 flex-col gap-1">
      {links.map((l) => {
        const active = l.href === "/dashboard" ? pathname === l.href : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            onClick={onNavigate}
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
  );
}

function SidebarFooter({ fullName }: { fullName: string }) {
  return (
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
  );
}

export function Sidebar({ fullName }: { fullName: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-nf-border bg-nf-surface/40 px-4 py-3 lg:hidden">
        <Link href="/" className="px-1">
          <Logo />
        </Link>
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-nf-border text-neutral-300 transition hover:border-neutral-500 hover:text-white"
        >
          {open ? (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6l-12 12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile slide-in drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0 flex w-64 max-w-[80vw] flex-col border-r border-nf-border bg-nf-surface px-4 py-6 shadow-xl">
            <Link href="/" className="px-2" onClick={() => setOpen(false)}>
              <Logo />
            </Link>
            <SidebarLinks pathname={pathname} onNavigate={() => setOpen(false)} />
            <SidebarFooter fullName={fullName} />
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden h-full w-64 shrink-0 flex-col border-r border-nf-border bg-nf-surface/40 px-4 py-6 lg:flex">
        <Link href="/" className="px-2">
          <Logo />
        </Link>
        <SidebarLinks pathname={pathname} />
        <SidebarFooter fullName={fullName} />
      </aside>
    </>
  );
}
