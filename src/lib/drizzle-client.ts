import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

// Reuse a single Pool across hot reloads / module reevaluations in dev so we
// don't leak connections, same pattern commonly used for Prisma clients.
declare global {
  var __nairaflowPool: Pool | undefined;
}

const pool =
  global.__nairaflowPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== "production") {
  global.__nairaflowPool = pool;
}

export const client = drizzle(pool, { schema });
