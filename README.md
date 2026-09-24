# NairaFlow

Mobile-first banking for Nigeria's informal economy, built from the NairaFlow investor deck. One app, three products:

- **NairaWallet** — mobile-first wallet with NIN-based KYC. Fund via bank transfer, USSD, or a cash agent.
- **NairaPay** — P2P payments by phone number, with QR codes for receiving payments from market traders.
- **NairaRemit** — international remittances from the UK, US, EU, and Canada, with an FX rate locked at send time.

Also included: an **agent network** (cash-in/cash-out across Lagos & Abuja) and a full **transaction history**.

## Stack

- Next.js 16 (App Router, Server Actions, Turbopack)
- TypeScript + Tailwind CSS v4
- JSON-file data store (`.data/db.json`) — no external database required for local development
- Session auth via signed JWT cookies (`jose`), passwords hashed with `bcryptjs`

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Data persists locally in `.data/db.json` (gitignored).

Set `NF_SESSION_SECRET` in production to a long random string (defaults to a dev-only secret).

### Paystack (bank transfer wallet funding)

`fundWalletAction`'s **Bank Transfer** method (`src/lib/actions/wallet.ts`) is wired to Paystack's
standard Transaction Initialize / Verify REST API (plain `fetch`, no SDK) instead of simulating a
credit. `ussd` and `cash_agent` remain simulated, unchanged.

Set these two environment variables to enable it locally (`.env.local`, gitignored):

```bash
PAYSTACK_SECRET_KEY=<your Paystack TEST secret key>
PAYSTACK_PUBLIC_KEY=<your Paystack TEST public key>
```

Get these from the [Paystack dashboard](https://dashboard.paystack.com) → Settings → API Keys &
Webhooks — copy the **Test Secret Key** and **Test Public Key** shown there (Paystack prefixes them
so they're easy to tell apart from live keys). **Use test mode keys for all development and demo
purposes.** Neither key is required to build, typecheck, lint, or run the app — if
`PAYSTACK_SECRET_KEY` is unset, `initializeTransaction`/`verifyTransaction` return a clear error
instead of throwing, and bank transfer funding surfaces that error in the UI while `ussd` /
`cash_agent` keep working as before.

**Webhook setup:** Paystack confirms payment asynchronously by POSTing to a webhook once the
transfer completes, rather than on the redirect back to the app. In the Paystack dashboard, set the
webhook URL to:

```
https://<your-domain>/api/paystack/webhook
```

(`src/app/api/paystack/webhook/route.ts`). It verifies the `x-paystack-signature` header
(HMAC-SHA512 of the raw body, keyed with `PAYSTACK_SECRET_KEY`) before trusting the payload, then on
a verified `charge.success` event looks up the matching pending transaction (by the Paystack
reference stored on it when `fundWalletAction` called `initializeTransaction`) and credits the
wallet — only once Paystack confirms the payment, not on the initial redirect.

**Going live is not just an env var flip.** Switching `PAYSTACK_SECRET_KEY` / `PAYSTACK_PUBLIC_KEY`
to live keys (`sk_live_...` / `pk_live_...`) means real money moves through the app, which requires
everything in `COMPLIANCE.md` to be sorted first (CBN licensing, AML/CFT program, real NIN
verification, etc.) — none of that is optional and none of it is done by writing code.

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
   - `DATABASE_URL` — required once the JSON-file store is replaced with Postgres (see "Before
     production" below). Any standard Postgres connection string works (Vercel Postgres, Supabase,
     Neon, etc.) — the app itself is host-agnostic.
   - `PAYSTACK_SECRET_KEY` / `PAYSTACK_PUBLIC_KEY` — required once real wallet funding replaces the
     simulated `fundWalletAction` flow. Use Paystack's **test** keys until the money flows are
     verified end-to-end.
3. Because `.data/db.json` is a local file, it will NOT persist on Vercel's serverless filesystem —
   deploying before the Postgres migration below means every write is lost between invocations.
   Do the database migration first, or expect data loss on Vercel.

No deployment has been done from this session — actually running the above steps requires access to
your Vercel account, which this session doesn't have.

## Project structure

- `src/app` — routes: marketing landing page, `/signup`, `/login`, and the `/dashboard/*` app
- `src/lib/actions` — Server Actions for auth, wallet funding, P2P payments, remittances, and agent cash in/out
- `src/lib/db.ts` — JSON-file persistence layer
- `src/lib/fx.ts` — remittance corridors and live-quote simulation
- `src/components/marketing` — landing page sections sourced from the investor deck
- `src/components/dashboard` — wallet, pay, remit, and agent network UI

## Before production

This repo is a working demo, not a production-ready backend. Before wiring in real money movement, at minimum:

- **Rotate `NF_SESSION_SECRET`.** It currently defaults to a dev-only string (`nairaflow-dev-secret-change-me`) in `src/lib/auth.ts` if the env var is unset. Set it to a long random secret in every real environment, and never rely on the default outside local dev.
- **Move rate limiting to shared storage.** Signup/login rate limiting (`src/lib/rate-limit.ts`) is an in-memory sliding-window limiter keyed by client IP. It resets on every server restart and isn't shared across instances, so it only meaningfully protects a single-instance deployment. Move it to Redis/Upstash (or similar shared storage) before running more than one instance.
- **Replace `.data/db.json`.** `src/lib/db.ts` is a JSON-file store meant for local development only. It has no transactions, locking, or concurrency control, so concurrent writes (including from multiple server instances) can race and corrupt data or lose money-moving updates. Replace it with a real database before handling real funds.
