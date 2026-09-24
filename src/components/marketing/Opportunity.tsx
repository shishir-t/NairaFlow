import { SectionHeading } from "@/components/marketing/Problem";

const africaStats = [
  { value: "$65B", label: "Africa fintech market by 2030 (McKinsey)" },
  { value: "40%", label: "Projected CAGR of Africa mobile payments" },
  { value: "1.4B", label: "Africa population by 2030 — 60% under 25" },
  { value: "800M", label: "Mobile subscribers in Africa by 2027 (GSMA)" },
];

const nigeriaStats = [
  { value: "220M people", label: "Largest population in Africa; #1 economy by PPP" },
  { value: "$26B remittances", label: "Sent home annually — 4th largest globally" },
  { value: "53% smartphone penetration", label: "Up from 25% in 2017; growing 8% YoY" },
  { value: "OPay, PalmPay", label: "Proof of product-market fit — OPay hit $2B valuation" },
];

export function Opportunity() {
  return (
    <section id="market" className="border-b border-nf-border">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading
          eyebrow="The Opportunity"
          title="Africa is the world's fastest-growing fintech market"
        />
        <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {africaStats.map((s) => (
            <div key={s.label} className="rounded-xl border border-nf-border bg-nf-surface/60 p-5">
              <div className="text-2xl font-bold text-nf-gold">{s.value}</div>
              <div className="mt-2 text-xs text-neutral-400">{s.label}</div>
            </div>
          ))}
        </div>

        <h3 className="mt-16 text-xl font-semibold text-white">Nigeria specifically</h3>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {nigeriaStats.map((s) => (
            <div key={s.label} className="flex items-start gap-4 rounded-xl border border-nf-border bg-nf-surface/40 p-5">
              <div className="h-2 w-2 shrink-0 translate-y-2 rounded-full bg-nf-green" />
              <div>
                <div className="font-semibold text-white">{s.value}</div>
                <div className="text-sm text-neutral-400">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
