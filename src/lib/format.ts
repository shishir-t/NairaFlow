export function formatNgn(amount: number): string {
  return `₦${amount.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-NG", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  GBP: "£",
  USD: "$",
  EUR: "€",
  CAD: "C$",
};

export function formatForeign(amount: number, code: string): string {
  const symbol = CURRENCY_SYMBOLS[code] ?? code + " ";
  return `${symbol}${amount.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}
