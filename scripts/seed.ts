// Seeds the `agents` table with the 12 fixed agents from
// src/lib/agents-seed.ts. Run with `npm run db:seed` once DATABASE_URL
// points at a real Postgres instance and the schema has been pushed
// (`npm run db:push`).
import { client } from "../src/lib/drizzle-client";
import { agents } from "../src/lib/schema";
import { SEED_AGENTS } from "../src/lib/agents-seed";

async function main() {
  for (const agent of SEED_AGENTS) {
    await client
      .insert(agents)
      .values(agent)
      .onConflictDoUpdate({ target: agents.id, set: agent });
  }
  console.log(`Seeded ${SEED_AGENTS.length} agents.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
