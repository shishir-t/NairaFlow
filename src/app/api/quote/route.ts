import { NextRequest, NextResponse } from "next/server";
import { getQuoteRate, CORRIDORS, type Corridor } from "@/lib/fx";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("corridor") as Corridor | null;
  const valid = CORRIDORS.some((c) => c.code === code);
  if (!code || !valid) {
    return NextResponse.json({ error: "Unsupported corridor" }, { status: 400 });
  }
  const rate = getQuoteRate(code);
  return NextResponse.json({ corridor: code, rate, quotedAt: new Date().toISOString() });
}
