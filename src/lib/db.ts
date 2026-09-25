import { desc } from "drizzle-orm";
import { client } from "./drizzle-client";
import { users, wallets, transactions, agents, cards } from "./schema";
import type { DB, User, Wallet, Transaction, Agent, Card } from "./types";

/**
 * Reads the whole DB, assembled from four table queries against Postgres.
 *
 * This keeps the `readDb()`/`writeDb()` whole-DB shape the JSON-file store
 * used (see git history), so every Server Action / Server Component only
 * needed `await` added at call sites instead of being rewritten around
 * granular queries.
 */
export async function readDb(): Promise<DB> {
  const [userRows, walletRows, transactionRows, agentRows, cardRows] = await Promise.all([
    client.select().from(users),
    client.select().from(wallets),
    client.select().from(transactions).orderBy(desc(transactions.createdAt)),
    client.select().from(agents),
    client.select().from(cards),
  ]);

  return {
    users: userRows as User[],
    wallets: walletRows as Wallet[],
    transactions: transactionRows as Transaction[],
    agents: agentRows as Agent[],
    cards: cardRows as Card[],
  };
}

/**
 * Persists the whole DB back to Postgres.
 *
 * Callers mutate the object `readDb()` returned (push new rows, or flip a
 * field on an existing one) and pass the whole thing back in, exactly like
 * the old JSON-file `writeDb()`. None of the current app logic ever removes
 * a row, so this upserts every row of every table (insert, or update on
 * primary-key conflict) rather than diffing against what's currently
 * stored — functionally equivalent here, and much simpler. If a caller ever
 * needs to delete rows, this will need a real diff (or a dedicated delete
 * function) to match.
 */
export async function writeDb(db: DB): Promise<void> {
  await client.transaction(async (tx) => {
    for (const u of db.users) {
      await tx
        .insert(users)
        .values(u)
        .onConflictDoUpdate({ target: users.id, set: u });
    }
    for (const w of db.wallets) {
      await tx
        .insert(wallets)
        .values(w)
        .onConflictDoUpdate({ target: wallets.userId, set: { balanceNgn: w.balanceNgn } });
    }
    for (const t of db.transactions) {
      await tx
        .insert(transactions)
        .values(t)
        .onConflictDoUpdate({ target: transactions.id, set: t });
    }
    for (const a of db.agents) {
      await tx
        .insert(agents)
        .values(a)
        .onConflictDoUpdate({ target: agents.id, set: a });
    }
    for (const c of db.cards) {
      await tx
        .insert(cards)
        .values(c)
        .onConflictDoUpdate({ target: cards.id, set: c });
    }
  });
}

export function genId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
