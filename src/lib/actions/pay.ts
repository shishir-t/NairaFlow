"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { readDb, writeDb, genId } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";
import { isDuplicateTransaction } from "@/lib/replay-guard";
import type { FormState } from "@/lib/actions/state";

const FLAT_FEE_NGN = 50;
const FEE_THRESHOLD_NGN = 5000;

const paySchema = z.object({
  recipientPhone: z
    .string()
    .trim()
    .regex(/^0[789][01]\d{8}$/, "Enter a valid Nigerian phone number"),
  amount: z.coerce.number().positive("Enter an amount above ₦0").max(2_000_000, "Amount too large"),
  note: z.string().trim().max(140).optional(),
});

export async function sendPayAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const userId = await getSessionUserId();
  if (!userId) return { error: "You must be signed in" };

  const parsed = paySchema.safeParse({
    recipientPhone: formData.get("recipientPhone"),
    amount: formData.get("amount"),
    note: formData.get("note") ?? undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const { recipientPhone, amount, note } = parsed.data;
  const db = readDb();

  const sender = db.users.find((u) => u.id === userId);
  if (!sender) return { error: "Sender not found" };
  if (sender.phone === recipientPhone) return { error: "You can't send money to yourself" };

  const recipient = db.users.find((u) => u.phone === recipientPhone);
  if (!recipient) {
    return { error: "No NairaFlow user found with that phone number" };
  }

  const fee = amount > FEE_THRESHOLD_NGN ? FLAT_FEE_NGN : 0;
  const totalDebit = amount + fee;

  const senderWallet = db.wallets.find((w) => w.userId === userId);
  const recipientWallet = db.wallets.find((w) => w.userId === recipient.id);
  if (!senderWallet || !recipientWallet) return { error: "Wallet not found" };
  if (senderWallet.balanceNgn < totalDebit) return { error: "Insufficient balance" };

  if (isDuplicateTransaction(db, userId, "p2p_send", amount)) {
    return { error: "Duplicate request detected. Please wait a moment before trying again." };
  }

  senderWallet.balanceNgn -= totalDebit;
  recipientWallet.balanceNgn += amount;

  const now = new Date().toISOString();
  db.transactions.unshift({
    id: genId("txn"),
    userId,
    type: "p2p_send",
    amountNgn: amount,
    feeNgn: fee,
    counterpartyName: recipient.fullName,
    counterpartyPhone: recipient.phone,
    note,
    status: "completed",
    createdAt: now,
  });
  db.transactions.unshift({
    id: genId("txn"),
    userId: recipient.id,
    type: "p2p_receive",
    amountNgn: amount,
    counterpartyName: sender.fullName,
    counterpartyPhone: sender.phone,
    note,
    status: "completed",
    createdAt: now,
  });

  writeDb(db);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/pay");
  return { success: `₦${amount.toLocaleString()} sent to ${recipient.fullName}` };
}
