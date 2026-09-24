import { SectionHeading } from "@/components/marketing/Problem";

const cols = ["Unbanked Onboarding", "P2P Payments", "Diaspora Remittance", "Offline USSD", "FX Rate Lock"];
const rows: { name: string; values: ("yes" | "no" | "partial")[] }[] = [
  { name: "NairaFlow", values: ["yes", "yes", "yes", "yes", "yes"] },
  { name: "OPay / PalmPay", values: ["yes", "yes", "no", "yes", "no"] },
  { name: "Flutterwave", values: ["no", "partial", "partial", "no", "no"] },
  { name: "Western Union", values: ["no", "no", "yes", "no", "no"] },
  { name: "Chipper Cash", values: ["partial", "yes", "yes", "no", "no"] },
];

const mark = { yes: "✓", no: "✗", partial: "◐" };
const markColor = { yes: "text-nf-green", no: "text-neutral-600", partial: "text-nf-gold" };

export function Competitive() {
  return (
    <section className="border-b border-nf-border bg-nf-surface/30">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading eyebrow="Competitive Landscape" title="We sit at the intersection no single competitor covers" />
        <div className="mt-10 overflow-x-auto rounded-xl border border-nf-border">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-nf-border bg-neutral-950/60">
                <th className="px-4 py-3 text-left font-semibold text-neutral-300">Company</th>
                {cols.map((c) => (
                  <th key={c} className="px-4 py-3 text-center font-semibold text-neutral-300">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.name}
                  className={r.name === "NairaFlow" ? "bg-nf-green/10" : "border-t border-nf-border"}
                >
                  <td className={`px-4 py-3 font-medium ${r.name === "NairaFlow" ? "text-nf-green" : "text-white"}`}>
                    {r.name}
                  </td>
                  {r.values.map((v, i) => (
                    <td key={cols[i]} className={`px-4 py-3 text-center text-lg ${markColor[v]}`}>
                      {mark[v]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
