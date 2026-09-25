import { SectionHeading } from "@/components/marketing/Problem";

const products = [
  {
    name: "NairaWallet",
    tag: "Mobile-first banking",
    href: "/dashboard/wallet",
    bullets: [
      "Fund via bank transfer, USSD, or cash agent",
      "NIN-based KYC — no existing bank required",
      "Works on smartphones AND feature phones via USSD",
    ],
  },
  {
    name: "NairaPay",
    tag: "P2P payments (like Venmo)",
    href: "/dashboard/pay",
    bullets: [
      "Send by phone number in under 5 seconds",
      "QR code payments for market traders",
      "Optional social feed for vendor trust-building",
    ],
  },
  {
    name: "NairaRemit",
    tag: "International transfers",
    href: "/dashboard/remit",
    bullets: [
      "Send from UK, US, EU, Canada → Nigeria",
      "Locked FX rate on send — no surprise at delivery",
      "USDC on the backend; Naira in the recipient's wallet",
    ],
  },
  {
    name: "NairaCard",
    tag: "Spend anywhere online",
    href: "/dashboard/card",
    bullets: [
      "Virtual USD card funded from your NairaWallet",
      "Shop on Amazon, eBay, and anywhere Visa/Mastercard is accepted online",
      "Freeze and unfreeze instantly from the app",
    ],
  },
];

export function Solution() {
  return (
    <section id="solution" className="border-b border-nf-border bg-nf-surface/30">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading
          eyebrow="Our Solution"
          title="One app. Four core products. Every Nigerian, every device."
        />
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <div
              key={p.name}
              className="flex flex-col rounded-xl border border-nf-border bg-neutral-950/60 p-6"
            >
              <h3 className="text-xl font-bold text-white">{p.name}</h3>
              <p className="mt-1 text-sm font-medium text-nf-green">{p.tag}</p>
              <ul className="mt-4 flex-1 space-y-2 text-sm text-neutral-400">
                {p.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="text-nf-green">✓</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
