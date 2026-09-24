import { SectionHeading } from "@/components/marketing/Problem";

const tiers = [
  { label: "TAM", value: "₦288T", desc: "Total Africa mobile money + remittance market" },
  { label: "SAM", value: "₦67.2T", desc: "Nigeria fintech addressable market (2025E)" },
  { label: "SOM", value: "₦1.92T", desc: "Year-5 serviceable target (3% Nigeria market)" },
];

export function MarketSize() {
  return (
    <section className="border-b border-nf-border">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading eyebrow="Market Size" title="A multi-trillion naira addressable market at every layer" />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {tiers.map((t, i) => (
            <div
              key={t.label}
              className="rounded-xl border border-nf-border bg-nf-surface/60 p-8 text-center"
              style={{ opacity: 1 - i * 0.08 }}
            >
              <div className="text-xs font-semibold uppercase tracking-wider text-nf-green">{t.label}</div>
              <div className="mt-3 text-4xl font-bold text-white">{t.value}</div>
              <div className="mt-3 text-sm text-neutral-400">{t.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
