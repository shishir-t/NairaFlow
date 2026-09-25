"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { readDb, writeDb, genId } from "@/lib/db";
import { getSessionUserId, getCurrentUser } from "@/lib/auth";
import { isDuplicateTransaction } from "@/lib/replay-guard";
import { NAIRAFLOW_FX_FEE_PCT } from "@/lib/fx";
import type { FormState } from "@/lib/actions/state";

function randomLast4(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function issueCardAction(_prev: FormState, _formData: FormData): Promise<FormState> {
  const userId = await getSessionUserId();
  if (!userId) return { error: "You must be signed in" };

  const user = await getCurrentUser();
  if (!user) return { error: "User not found" };

  const db = await readDb();
  const existing = db.cards.find((c) => c.userId === userId);
  if (existing) return { error: "You already have a NairaCard" };

  const now = new Date();
  db.cards.push({
    id: genId("card"),
    userId,
    last4: randomLast4(),
    cardholderName: user.fullName.toUpperCase(),
    expiryMonth: now.getMonth() + 1,
    expiryYear: now.getFullYear() + 3,
    balanceUsd: 0,
    status: "active",
    createdAt: now.toISOString(),
  });

  await writeDb(db);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/card");
  return { success: "Your simulated NairaCard has been issued." };
}

const fundCardSchema = z.object({
  amountNgn: z.coerce.number().positive("Enter an amount above ₦0").max(5_000_000, "Amount too large"),
  lockedRate: z.coerce.number().positive("Quote expired, refresh and try again"),
});

export async function fundCardAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const userId = await getSessionUserId();
  if (!userId) return { error: "You must be signed in" };

  const parsed = fundCardSchema.safeParse({
    amountNgn: formData.get("amountNgn"),
    lockedRate: formData.get("lockedRate"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const { amountNgn, lockedRate } = parsed.data;

  const db = await readDb();
  const wallet = db.wallets.find((w) => w.userId === userId);
  if (!wallet) return { error: "Wallet not found" };
  if (wallet.balanceNgn < amountNgn) return { error: "Insufficient wallet balance" };

  const card = db.cards.find((c) => c.userId === userId);
  if (!card) return { error: "Issue a NairaCard first" };
  if (card.status === "frozen") return { error: "Your card is frozen — unfreeze it before funding" };

  if (isDuplicateTransaction(db, userId, "card_fund", amountNgn)) {
    return { error: "Duplicate request detected. Please wait a moment before trying again." };
  }

  // Funding spends NGN to buy USD, so the FX spread comes off the USD side
  // (mirrors NairaRemit's fee shape, just inverted direction).
  const grossUsd = amountNgn / lockedRate;
  const feeUsd = grossUsd * (NAIRAFLOW_FX_FEE_PCT / 100);
  const netUsd = Math.round((grossUsd - feeUsd) * 100) / 100;

  wallet.balanceNgn -= amountNgn;
  card.balanceUsd = Math.round((card.balanceUsd + netUsd) * 100) / 100;

  db.transactions.unshift({
    id: genId("txn"),
    userId,
    type: "card_fund",
    amountNgn,
    fxRate: lockedRate,
    sourceCurrency: "USD",
    sourceAmount: netUsd,
    method: "NairaWallet → NairaCard",
    status: "completed",
    createdAt: new Date().toISOString(),
  });

  await writeDb(db);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/card");
  return { success: `$${netUsd.toFixed(2)} added to your NairaCard at a locked rate of ${lockedRate}` };
}

const spendSchema = z.object({
  amountUsd: z.coerce.number().positive("Enter an amount above $0").max(50_000, "Amount too large"),
  merchant: z.string().trim().min(1, "Enter a merchant name").max(60, "Merchant name too long"),
});

export async function simulateCardSpendAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const userId = await getSessionUserId();
  if (!userId) return { error: "You must be signed in" };

  const parsed = spendSchema.safeParse({
    amountUsd: formData.get("amountUsd"),
    merchant: formData.get("merchant"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const { amountUsd, merchant } = parsed.data;

  const db = await readDb();
  const card = db.cards.find((c) => c.userId === userId);
  if (!card) return { error: "Issue a NairaCard first" };
  if (card.status === "frozen") return { error: "Your card is frozen — unfreeze it to spend" };
  if (card.balanceUsd < amountUsd) return { error: "Insufficient card balance" };

  if (isDuplicateTransaction(db, userId, "card_spend", 0)) {
    return { error: "Duplicate request detected. Please wait a moment before trying again." };
  }

  card.balanceUsd = Math.round((card.balanceUsd - amountUsd) * 100) / 100;

  db.transactions.unshift({
    id: genId("txn"),
    userId,
    type: "card_spend",
    amountNgn: 0,
    sourceCurrency: "USD",
    sourceAmount: amountUsd,
    merchant,
    method: "NairaCard",
    status: "completed",
    createdAt: new Date().toISOString(),
  });

  await writeDb(db);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/card");
  // Clearly a simulated purchase — no real Amazon/eBay checkout happens here.
  return { success: `Simulated purchase of $${amountUsd.toFixed(2)} at ${merchant}` };
}

export async function toggleCardFreezeAction(_prev: FormState, _formData: FormData): Promise<FormState> {
  const userId = await getSessionUserId();
  if (!userId) return { error: "You must be signed in" };

  const db = await readDb();
  const card = db.cards.find((c) => c.userId === userId);
  if (!card) return { error: "Issue a NairaCard first" };

  card.status = card.status === "active" ? "frozen" : "active";
  await writeDb(db);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/card");
  return { success: card.status === "frozen" ? "Card frozen" : "Card unfrozen" };
}
