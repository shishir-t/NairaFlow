import Link from "next/link";
import { SectionHeading } from "@/components/marketing/Problem";

const uses = [
  { pct: "40%", value: "₦2.24B", label: "Product & Engineering — full-stack team of 12" },
  { pct: "25%", value: "₦1.4B", label: "Regulatory & Compliance — CBN PSB, FCA, FinCEN" },
  { pct: "20%", value: "₦1.12B", label: "Agent Network — 500 agents in Lagos & Abuja" },
  { pct: "15%", value: "₦840M", label: "Marketing & Growth — user acquisition, diaspora" },
];

export function Ask() {
  return (
    <section id="ask" className="border-b border-nf-border bg-nf-surface/30">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading eyebrow="The Ask" title="₦5.6B Seed Round" />
        <p className="mt-2 text-sm text-neutral-400">Pre-money valuation: ₦22.4B  •  18-month runway</p>

        <h3 className="mt-12 text-lg font-semibold text-white">Use of Funds</h3>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {uses.map((u) => (
            <div key={u.label} className="flex items-center gap-4 rounded-xl border border-nf-border bg-neutral-950/60 p-5">
              <div className="text-xl font-bold text-nf-gold">{u.pct}</div>
              <div>
                <div className="font-semibold text-white">{u.value}</div>
                <div className="text-sm text-neutral-400">{u.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-nf-green/30 bg-nf-green/10 p-6 text-center text-sm text-neutral-200">
          18-month milestones: <strong className="text-white">50K active users</strong> •{" "}
          <strong className="text-white">200 agents live</strong> •{" "}
          <strong className="text-white">3 remittance corridors</strong> •{" "}
          <strong className="text-white">Series A-ready</strong>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/signup"
            className="inline-block rounded-md bg-nf-green px-8 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-nf-green/90"
          >
            Try the NairaFlow app
          </Link>
        </div>
      </div>
    </section>
  );
}
