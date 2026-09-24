export type Corridor = "GBP" | "USD" | "EUR" | "CAD";

export const CORRIDORS: { code: Corridor; label: string; country: string; flag: string; baseRate: number }[] = [
  { code: "GBP", label: "British Pound", country: "United Kingdom", flag: "GB", baseRate: 2050 },
  { code: "USD", label: "US Dollar", country: "United States", flag: "US", baseRate: 1600 },
  { code: "EUR", label: "Euro", country: "European Union", flag: "EU", baseRate: 1750 },
  { code: "CAD", label: "Canadian Dollar", country: "Canada", flag: "CA", baseRate: 1150 },
];

/** Returns a live-ish rate with small deterministic-ish jitter, simulating a quote feed. */
export function getQuoteRate(code: Corridor): number {
  const corridor = CORRIDORS.find((c) => c.code === code);
  if (!corridor) throw new Error("Unknown corridor");
  const jitter = (Math.random() - 0.5) * corridor.baseRate * 0.01; // +/-0.5%
  return Math.round((corridor.baseRate + jitter) * 100) / 100;
}

export const NAIRAFLOW_FX_FEE_PCT = 1.5; // mid of deck's 1-2% FX spread
