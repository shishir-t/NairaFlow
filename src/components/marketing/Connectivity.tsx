import { SectionHeading } from "@/components/marketing/Problem";

const stats = [
  { value: "38%", label: "of Nigerians lack internet" },
  { value: "75M", label: "people offline in rural markets" },
  { value: "NCC", label: "mandates rural broadband expansion" },
];

const pillars = [
  {
    title: "Local government MoUs",
    body: "Sign memoranda of understanding with state governments in Lagos, Abuja, Kano, and Port Harcourt — giving NairaFlow preferred-partner status for digital financial inclusion programs aligned with CBN's National Financial Inclusion Strategy.",
    footer: "CBN inclusion mandate creates urgency for state partnerships",
  },
  {
    title: "Community Wi-Fi via agent nodes",
    body: "NairaFlow agents become community Wi-Fi hotspot hosts — solar-powered routers co-funded with state governments and piggybacking on MTN and Airtel rural 4G rollouts (each investing ₦1.6T+ in rural Nigeria). Users earn free internet per transaction.",
    footer: "Agents earn extra income; NairaFlow gains an activation channel",
  },
  {
    title: "USSD-first, internet-second",
    body: "NairaFlow works 100% offline via USSD today — no internet required. Government partnership accelerates the connectivity transition while our offline fallback ensures zero user is left behind during the rollout.",
    footer: "USSD is the bridge; connectivity is the upgrade path",
  },
];

export function Connectivity() {
  return (
    <section className="border-b border-nf-border">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading
          eyebrow="Government & Connectivity"
          title="Partnering with local officials to bring internet access to the informal economy"
        />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-nf-border bg-nf-surface/60 p-6 text-center">
              <div className="text-2xl font-bold text-nf-gold">{s.value}</div>
              <div className="mt-2 text-sm text-neutral-400">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {pillars.map((p) => (
            <div key={p.title} className="flex flex-col rounded-xl border border-nf-border bg-nf-surface/40 p-6">
              <h3 className="font-semibold text-white">{p.title}</h3>
              <p className="mt-2 flex-1 text-sm text-neutral-400">{p.body}</p>
              <p className="mt-4 text-xs font-medium text-nf-green">{p.footer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
