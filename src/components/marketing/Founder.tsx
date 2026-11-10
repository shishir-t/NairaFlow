import { SectionHeading } from "@/components/marketing/Problem";

const whatIBring = [
  "Sales and marketing background — deep understanding of how to reach and convert users in informal markets",
  "Product intuition built from studying M-Pesa, OPay, and Chipper Cash market entries",
  "Actively recruiting a technical co-founder and CBN compliance advisor with this raise",
];

export function Founder() {
  return (
    <section className="border-b border-nf-border">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading
          eyebrow="The Founder"
          title="Built by someone who has lived this problem first-hand"
        />

        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-[220px_1fr]">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-nf-green to-nf-green-dark text-2xl font-bold text-white">
              ST
            </div>
            <h3 className="mt-4 text-lg font-bold text-white">Shishir Tumukuntala</h3>
            <p className="text-sm text-nf-green">Founder &amp; CEO, NairaFlow</p>
            <a
              href="mailto:shishirtumukuntala@gmail.com"
              className="mt-2 text-sm text-neutral-400 hover:text-white"
            >
              shishirtumukuntala@gmail.com
            </a>
          </div>

          <div className="space-y-8">
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
                Why I am building this
              </h4>
              <p className="mt-3 text-neutral-300">
                I have watched family members pay 10%+ fees to receive money from abroad, wait
                days for transfers, and get turned away by banks because they lacked the right
                paperwork. The informal economy is not small or peripheral — it is the Nigerian
                economy. The tools to serve it just have not been built yet.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
                What I bring
              </h4>
              <ul className="mt-3 space-y-2 text-neutral-300">
                {whatIBring.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-nf-green">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
