# NairaFlow

Mobile-first banking for Nigeria's informal economy, built from the NairaFlow investor deck. One app, three products:

- **NairaWallet** — mobile-first wallet with NIN-based KYC. Fund via bank transfer, USSD, or a cash agent.
- **NairaPay** — P2P payments by phone number, with QR codes for receiving payments from market traders.
- **NairaRemit** — international remittances from the UK, US, EU, and Canada, with an FX rate locked at send time.

Also included: an **agent network** (cash-in/cash-out across Lagos & Abuja) and a full **transaction history**.

## Stack

- Next.js 16 (App Router, Server Actions, Turbopack)
- TypeScript + Tailwind CSS v4
- Postgres via Drizzle ORM (`src/lib/schema.ts`, `src/lib/db.ts`) — needs a `DATABASE_URL` (see "Database" below)
- Session auth via signed JWT cookies (`jose`), passwords hashed with `bcryptjs`

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Set `NF_SESSION_SECRET` in production to a long random string (defaults to a dev-only secret).

### Database

The app persists to Postgres via [Drizzle ORM](https://orm.drizzle.team) (`src/lib/schema.ts` defines
the tables, `src/lib/db.ts` is the `readDb()`/`writeDb()` data-access layer). You need a real Postgres
instance to run it — this sandbox does not run one for you.

1. Get a Postgres database. For local dev, either run Postgres locally (e.g. `docker run -p 5432:5432
   -e POSTGRES_PASSWORD=postgres postgres:16`) or use a free hosted dev instance — [Neon](https://neon.tech)
   or [Supabase](https://supabase.com) both offer one.
2. Set `DATABASE_URL` in `.env.local` (or your shell) to its connection string, e.g.
   `postgres://user:password@localhost:5432/nairaflow`.
3. Push the schema (no migration files, just syncs the tables to match `src/lib/schema.ts`):
   ```bash
   npm run db:push
   ```
   Or, to manage versioned migrations instead: `npm run db:generate` then `npm run db:migrate`.
4. Seed the 12 fixed agents (`src/lib/agents-seed.ts`) into the `agents` table:
   ```bash
   npm run db:seed
   ```

`DATABASE_URL` is required for every environment, including local dev — there is no more JSON-file
fallback.

### Admin / Ops view

`/dashboard/admin` shows aggregate stats (total wallet balance, transaction volume by type, agent
cash-in/cash-out) pulled straight from `readDb()`. It is currently protected only by the same
session check as every other `/dashboard/*` route — **any signed-in user can view it**. Before this
is safe to expose in a real deployment, it needs proper role-based access control (an `isAdmin` /
role field on `User`, and a server-side check in the route — or its own layout — that redirects
non-admins away) rather than piggybacking on ordinary dashboard auth.

## Deploying

The app is a stock Next.js 16 App Router project, so it deploys to Vercel with zero extra config:

1. Push this branch, then in Vercel: **Add New → Project → Import** `shishir-t/NairaFlow`, pick this
   branch, and deploy — no `vercel.json` needed.
2. Set environment variables in the Vercel project settings (Production + Preview):
   - `NF_SESSION_SECRET` — required. Generate with `openssl rand -base64 32`. Never reuse the dev
     default (`nairaflow-dev-secret-change-me`).
   - `DATABASE_URL` — required. Any standard Postgres connection string works (Vercel Postgres,
     Supabase, Neon, etc.) — the app itself is host-agnostic. Run `npm run db:push` (and
     `npm run db:seed`) against it before first deploy.
   - `PAYSTACK_SECRET_KEY` / `PAYSTACK_PUBLIC_KEY` — required once real wallet funding replaces the
     simulated `fundWalletAction` flow. Use Paystack's **test** keys until the money flows are
     verified end-to-end.
3. Run `npm run db:push` (and `npm run db:seed` for the agent network) against the production
   `DATABASE_URL` before the first deploy, so the tables and seed data exist before traffic hits it.

No deployment has been done from this session — actually running the above steps requires access to
your Vercel account, which this session doesn't have.

## Project structure

- `src/app` — routes: marketing landing page, `/signup`, `/login`, and the `/dashboard/*` app
- `src/lib/actions` — Server Actions for auth, wallet funding, P2P payments, remittances, and agent cash in/out
- `src/lib/schema.ts` — Drizzle ORM table definitions (mirrors `src/lib/types.ts`)
- `src/lib/db.ts` — Postgres-backed `readDb()`/`writeDb()` data-access layer (via Drizzle)
- `scripts/seed.ts` — seeds the agent network (`npm run db:seed`)
- `src/lib/fx.ts` — remittance corridors and live-quote simulation
- `src/components/marketing` — landing page sections sourced from the investor deck
- `src/components/dashboard` — wallet, pay, remit, and agent network UI

## Before production

This repo is a working demo, not a production-ready backend. Before wiring in real money movement, at minimum:

- **Rotate `NF_SESSION_SECRET`.** It currently defaults to a dev-only string (`nairaflow-dev-secret-change-me`) in `src/lib/auth.ts` if the env var is unset. Set it to a long random secret in every real environment, and never rely on the default outside local dev.
- **Move rate limiting to shared storage.** Signup/login rate limiting (`src/lib/rate-limit.ts`) is an in-memory sliding-window limiter keyed by client IP. It resets on every server restart and isn't shared across instances, so it only meaningfully protects a single-instance deployment. Move it to Redis/Upstash (or similar shared storage) before running more than one instance.
- **Postgres migration: done, but `writeDb()` still isn't safe for concurrent money-moving writes.** `src/lib/db.ts` now persists to Postgres via Drizzle ORM instead of a JSON file (see "Database" above), so data survives restarts and works on serverless hosts like Vercel. However, `writeDb()` still reads the whole DB, mutates it in application code, and writes it all back — there's no row-level locking or `SELECT ... FOR UPDATE` around balance changes, so two concurrent requests against the same wallet can still race (e.g. two simultaneous transfers both reading the same starting balance). Before handling real funds, move balance-changing operations (fund/pay/remit/agent-cash) to targeted, transactional SQL (e.g. `UPDATE wallets SET balance_ngn = balance_ngn - $1 WHERE user_id = $2 AND balance_ngn >= $1`) instead of read-whole-DB/mutate-in-JS/write-whole-DB.
