"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { readDb, writeDb, genId } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";
import { isDuplicateTransaction } from "@/lib/replay-guard";
import type { FormState } from "@/lib/actions/state";

const AGENT_COMMISSION_PCT = 0.5;

const cashSchema = z.object({
  agentId: z.string().min(1, "Select an agent"),
  direction: z.enum(["cash_in", "cash_out"]),
  amount: z.coerce.number().positive("Enter an amount above ₦0").max(2_000_000, "Amount too large"),
});

export async function agentCashAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const userId = await getSessionUserId();
  if (!userId) return { error: "You must be signed in" };

  const parsed = cashSchema.safeParse({
    agentId: formData.get("agentId"),
    direction: formData.get("direction"),
    amount: formData.get("amount"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const { agentId, direction, amount } = parsed.data;
  const db = readDb();
  const agent = db.agents.find((a) => a.id === agentId);
  if (!agent) return { error: "Agent not found" };

  const wallet = db.wallets.find((w) => w.userId === userId);
  if (!wallet) return { error: "Wallet not found" };

  const commission = Math.round(amount * (AGENT_COMMISSION_PCT / 100));
  const txnType = direction === "cash_out" ? "agent_cash_out" : "agent_cash_in";

  if (isDuplicateTransaction(db, userId, txnType, amount)) {
    return { error: "Duplicate request detected. Please wait a moment before trying again." };
  }

  if (direction === "cash_out") {
    const totalDebit = amount + commission;
    if (wallet.balanceNgn < totalDebit) return { error: "Insufficient balance" };
    wallet.balanceNgn -= totalDebit;
  } else {
    wallet.balanceNgn += amount;
  }

  db.transactions.unshift({
    id: genId("txn"),
    userId,
    type: txnType,
    amountNgn: amount,
    feeNgn: commission,
    counterpartyName: agent.name,
    method: `${agent.area}, ${agent.city}`,
    status: "completed",
    createdAt: new Date().toISOString(),
  });

  writeDb(db);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/agents");

  // TODO(notifications): wire to email/SMS provider here — send a
  // cash-in/cash-out receipt once a real provider is integrated.
  return {
    success:
      direction === "cash_out"
        ? `₦${amount.toLocaleString()} cash-out requested at ${agent.name}`
        : `₦${amount.toLocaleString()} cash-in confirmed via ${agent.name}`,
  };
}
