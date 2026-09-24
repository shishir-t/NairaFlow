import type { DB, TransactionType } from "@/lib/types";

const REPLAY_WINDOW_MS = 3_000;

/**
 * Server-side defense in depth against double-submits: rejects a transaction
 * if the same user just created a transaction of the same type and amount
 * within the last few seconds. The SubmitButton already disables the button
 * while a request is pending, but this guards against retries, double clicks
 * that race past that, or duplicate network requests.
 */
export function isDuplicateTransaction(
  db: DB,
  userId: string,
  type: TransactionType,
  amountNgn: number,
  windowMs = REPLAY_WINDOW_MS
): boolean {
  const now = Date.now();
  return db.transactions.some(
    (t) =>
      t.userId === userId &&
      t.type === type &&
      t.amountNgn === amountNgn &&
      now - new Date(t.createdAt).getTime() < windowMs
  );
}
