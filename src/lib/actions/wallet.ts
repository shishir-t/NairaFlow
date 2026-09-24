"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { readDb, writeDb, genId } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";
import { isDuplicateTransaction } from "@/lib/replay-guard";
import type { FormState } from "@/lib/actions/state";

const fundSchema = z.object({
  method: z.enum(["bank_transfer", "ussd", "cash_agent"]),
  amount: z.coerce.number().positive("Enter an amount above ₦0").max(5_000_000, "Amount too large"),
});

const methodLabels: Record<string, string> = {
  bank_transfer: "Bank Transfer",
  ussd: "USSD (*347#)",
  cash_agent: "Cash Agent",
};

export async function fundWalletAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const userId = await getSessionUserId();
  if (!userId) return { error: "You must be signed in" };

  const parsed = fundSchema.safeParse({
    method: formData.get("method"),
    amount: formData.get("amount"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const { method, amount } = parsed.data;
  const db = readDb();
  const wallet = db.wallets.find((w) => w.userId === userId);
  if (!wallet) return { error: "Wallet not found" };

  if (isDuplicateTransaction(db, userId, "fund", amount)) {
    return { error: "Duplicate request detected. Please wait a moment before trying again." };
  }

  wallet.balanceNgn += amount;
  db.transactions.unshift({
    id: genId("txn"),
    userId,
    type: "fund",
    amountNgn: amount,
    method: methodLabels[method],
    status: "completed",
    createdAt: new Date().toISOString(),
  });
  writeDb(db);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/wallet");
  return { success: `₦${amount.toLocaleString()} added via ${methodLabels[method]}` };
}
