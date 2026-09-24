import { SectionHeading } from "@/components/marketing/Problem";

const revenue = [
  { pct: "55%", name: "FX Spread", desc: "1–2% margin on every international transfer. ~$26B annual Nigeria remittance flow." },
  { pct: "20%", name: "Agent Commissions", desc: "0.5% of cash-in/out volume via agent network. Agents share the fee; NairaFlow keeps a cut." },
  { pct: "15%", name: "Transaction Fees", desc: "Flat ₦50 per P2P transfer above ₦5,000. Institutional/merchant tier = 0.3% per transaction." },
  { pct: "10%", name: "Value-Added Services", desc: "Micro-loans (via partner), insurance products, and premium “NairaFlow Pro” subscription." },
];

const unitEconomics = [
  { label: "CAC (agent-led)", value: "~$4" },
  { label: "CAC (digital)", value: "~$1.20" },
  { label: "Avg. monthly txn vol.", value: "$180 / user" },
  { label: "LTV (3-yr)", value: "$48" },
  { label: "LTV : CAC", value: "12×" },
  { label: "Breakeven (unit)", value: "Month 3" },
];

export function BusinessModel() {
  return (
    <section className="border-b border-nf-border bg-nf-surface/30">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading eyebrow="Business Model" title="Multiple revenue streams — all unit-economics positive from Day 1" />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {revenue.map((r) => (
            <div key={r.name} className="flex gap-4 rounded-xl border border-nf-border bg-neutral-950/60 p-6">
              <div className="text-2xl font-bold text-nf-gold">{r.pct}</div>
              <div>
                <div className="font-semibold text-white">{r.name}</div>
                <div className="mt-1 text-sm text-neutral-400">{r.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <h3 className="mt-16 text-xl font-semibold text-white">Unit Economics</h3>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {unitEconomics.map((u) => (
            <div key={u.label} className="rounded-xl border border-nf-border bg-nf-surface/60 p-4 text-center">
              <div className="text-lg font-bold text-white">{u.value}</div>
              <div className="mt-1 text-xs text-neutral-400">{u.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
