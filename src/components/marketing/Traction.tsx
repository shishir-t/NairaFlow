import { SectionHeading } from "@/components/marketing/Problem";

const earlyStats = [
  { value: "2,400+", label: "Waitlist signups (8 weeks, zero paid ads)" },
  { value: "12", label: "Agent partnerships in Lagos & Abuja" },
  { value: "CBN Dialogue", label: "Ongoing licensing discussions initiated" },
];

const roadmap = [
  { period: "Q3 2025", title: "Seed & Build", items: ["MVP launch Lagos", "NIN KYC integration", "500 beta users"] },
  { period: "Q1 2026", title: "Agent Network", items: ["200 agents onboarded", "USSD live on 3 telcos", "Series A raise"] },
  { period: "Q3 2026", title: "Remittance Live", items: ["UK & US corridors open", "FCA / FinCEN compliance", "50K active users"] },
  { period: "2027+", title: "Expand", items: ["Ghana, Kenya, Ethiopia", "Merchant lending", "IPO prep"] },
];

export function Traction() {
  return (
    <section id="roadmap" className="border-b border-nf-border">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading eyebrow="Traction & Roadmap" title="Early validation" />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {earlyStats.map((s) => (
            <div key={s.label} className="rounded-xl border border-nf-border bg-nf-surface/60 p-6 text-center">
              <div className="text-2xl font-bold text-nf-green">{s.value}</div>
              <div className="mt-2 text-sm text-neutral-400">{s.label}</div>
            </div>
          ))}
        </div>

        <h3 className="mt-16 text-xl font-semibold text-white">Roadmap</h3>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {roadmap.map((r) => (
            <div key={r.period} className="rounded-xl border border-nf-border bg-nf-surface/40 p-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-nf-gold">{r.period}</div>
              <div className="mt-1 font-semibold text-white">{r.title}</div>
              <ul className="mt-3 space-y-1.5 text-sm text-neutral-400">
                {r.items.map((it) => (
                  <li key={it}>• {it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
