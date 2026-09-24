const problems = [
  {
    title: "40M+ Nigerians unbanked",
    body: "No ID, no address history, no credit record. Traditional banks won't open accounts for them.",
  },
  {
    title: "Remittances cost 8–12%",
    body: "Diaspora in the UK, US, and Italy pay enormous fees to send money home via legacy operators like Western Union.",
  },
  {
    title: "Cash-only informal trade",
    body: "Market traders, roadside vendors, and artisans handle 100% of transactions in cash — zero digital trail.",
  },
  {
    title: "No FX stability for senders",
    body: "Naira volatility means senders don't know what their family will actually receive by the time money arrives.",
  },
];

export function Problem() {
  return (
    <section id="problem" className="border-b border-nf-border bg-nf-surface/30">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading
          eyebrow="The Problem"
          title="Nigeria's 133 million informal workers are locked out of the financial system"
        />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {problems.map((p) => (
            <div key={p.title} className="rounded-xl border border-nf-border bg-neutral-950/60 p-6">
              <h3 className="text-lg font-semibold text-white">{p.title}</h3>
              <p className="mt-2 text-sm text-neutral-400">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-wider text-nf-green">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-neutral-400">{description}</p>}
    </div>
  );
}
