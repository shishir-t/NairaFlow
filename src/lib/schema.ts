import { pgTable, text, integer, real } from "drizzle-orm/pg-core";

// Drizzle table definitions mirroring src/lib/types.ts exactly (same field
// names/shapes, just persisted in Postgres instead of a JSON file).

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull().unique(),
  nin: text("nin").notNull(),
  passwordHash: text("password_hash").notNull(),
  kycTier: integer("kyc_tier").notNull(),
  createdAt: text("created_at").notNull(),
});

export const wallets = pgTable("wallets", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id),
  balanceNgn: integer("balance_ngn").notNull(),
});

export const transactions = pgTable("transactions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  type: text("type").notNull(),
  amountNgn: integer("amount_ngn").notNull(),
  counterpartyName: text("counterparty_name"),
  counterpartyPhone: text("counterparty_phone"),
  method: text("method"),
  note: text("note"),
  fxRate: real("fx_rate"),
  sourceCurrency: text("source_currency"),
  sourceAmount: real("source_amount"),
  feeNgn: integer("fee_ngn"),
  status: text("status").notNull(),
  createdAt: text("created_at").notNull(),
});

export const agents = pgTable("agents", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  area: text("area").notNull(),
  type: text("type").notNull(),
  rating: real("rating").notNull(),
  commissionPct: real("commission_pct").notNull(),
});
