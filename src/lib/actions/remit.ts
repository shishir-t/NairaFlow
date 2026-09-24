"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { readDb, writeDb, genId } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";
import { isDuplicateTransaction } from "@/lib/replay-guard";
import type { FormState } from "@/lib/actions/state";
import { CORRIDORS, NAIRAFLOW_FX_FEE_PCT, type Corridor } from "@/lib/fx";

export async function sendRemitAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const userId = await getSessionUserId();
  if (!userId) return { error: "You must be signed in" };

  const parsed = z
    .object({
      corridor: z.enum(["GBP", "USD", "EUR", "CAD"]),
      sourceAmount: z.coerce.number().positive("Enter an amount above 0").max(50_000, "Amount too large"),
      lockedRate: z.coerce.number().positive("Quote expired, refresh and try again"),
      recipientPhone: z
        .string()
        .trim()
        .regex(/^0[789][01]\d{8}$/, "Enter a valid Nigerian phone number"),
    })
    .safeParse({
      corridor: formData.get("corridor"),
      sourceAmount: formData.get("sourceAmount"),
      lockedRate: formData.get("lockedRate"),
      recipientPhone: formData.get("recipientPhone"),
    });

  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const { corridor, sourceAmount, lockedRate, recipientPhone } = parsed.data;
  const corridorMeta = CORRIDORS.find((c) => c.code === (corridor as Corridor));
  if (!corridorMeta) return { error: "Unsupported corridor" };

  const db = readDb();
  const sender = db.users.find((u) => u.id === userId);
  if (!sender) return { error: "Sender not found" };

  const grossNgn = sourceAmount * lockedRate;
  const feeNgn = Math.round(grossNgn * (NAIRAFLOW_FX_FEE_PCT / 100));
  const netNgn = Math.round(grossNgn - feeNgn);

  if (isDuplicateTransaction(db, userId, "remit_send", netNgn)) {
    return { error: "Duplicate request detected. Please wait a moment before trying again." };
  }

  const recipient = db.users.find((u) => u.phone === recipientPhone);
  const now = new Date().toISOString();

  if (recipient) {
    const recipientWallet = db.wallets.find((w) => w.userId === recipient.id);
    if (!recipientWallet) return { error: "Recipient wallet not found" };
    recipientWallet.balanceNgn += netNgn;
    db.transactions.unshift({
      id: genId("txn"),
      userId: recipient.id,
      type: "remit_receive",
      amountNgn: netNgn,
      feeNgn,
      fxRate: lockedRate,
      sourceCurrency: corridor,
      sourceAmount,
      counterpartyName: sender.fullName,
      counterpartyPhone: sender.phone,
      method: `${corridorMeta.country} → Nigeria`,
      status: "completed",
      createdAt: now,
    });
  }

  db.transactions.unshift({
    id: genId("txn"),
    userId,
    type: "remit_send",
    amountNgn: netNgn,
    feeNgn,
    fxRate: lockedRate,
    sourceCurrency: corridor,
    sourceAmount,
    counterpartyPhone: recipientPhone,
    counterpartyName: recipient?.fullName ?? "Pending pickup",
    method: `${corridorMeta.country} → Nigeria`,
    status: recipient ? "completed" : "pending",
    createdAt: now,
  });

  writeDb(db);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/remit");

  // TODO(notifications): wire to email/SMS provider here — alert the
  // recipient (or prompt them to sign up) once a real provider is
  // integrated.
  return recipient
    ? { success: `₦${netNgn.toLocaleString()} delivered to ${recipient.fullName} at a locked rate of ${lockedRate}` }
    : {
        success: `Transfer locked at rate ${lockedRate}. ₦${netNgn.toLocaleString()} will be credited once ${recipientPhone} joins NairaFlow.`,
      };
}
