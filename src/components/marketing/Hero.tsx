import Link from "next/link";

const stats = [
  { value: "₦1,120T+", label: "Nigeria informal GDP" },
  { value: "40M+", label: "Unbanked Nigerians" },
  { value: "₦41.6T", label: "Annual diaspora remittances" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-nf-border">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(15,169,104,0.25) 0%, rgba(10,14,12,0) 70%)",
        }}
      />
      <div className="mx-auto max-w-6xl px-6 py-24 text-center relative">
        <p className="mb-4 inline-block rounded-full border border-nf-green/40 bg-nf-green/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-nf-green">
          Investor Deck 2025
        </p>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-6xl">
          Banking the informal economy.
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-xl text-nf-gold sm:text-2xl">
          Sending money home, instantly.
        </p>
        <p className="mx-auto mt-6 max-w-2xl text-balance text-neutral-400">
          NairaFlow is mobile-first banking for Nigeria&apos;s 133 million informal workers —
          wallet, P2P payments, and diaspora remittances in one app, with or without internet.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/signup"
            className="rounded-md bg-nf-green px-6 py-3 text-sm font-semibold text-neutral-950 shadow-lg shadow-nf-green/20 transition hover:bg-nf-green/90"
          >
            Open a free wallet
          </Link>
          <a
            href="#solution"
            className="rounded-md border border-nf-border px-6 py-3 text-sm font-semibold text-neutral-200 transition hover:border-neutral-500"
          >
            See how it works
          </a>
        </div>

        <dl className="mx-auto mt-20 grid max-w-3xl grid-cols-1 gap-8 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-nf-border bg-nf-surface/60 px-6 py-8">
              <dt className="text-3xl font-bold text-white">{s.value}</dt>
              <dd className="mt-2 text-sm text-neutral-400">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
