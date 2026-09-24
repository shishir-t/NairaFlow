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
