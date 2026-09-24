# KYC Onboarding Flow

Status: **drafted for review** — this is a written procedure, not a substitute for sign-off by
qualified compliance counsel (see `COMPLIANCE.md`) or for the licensing that must exist before
NairaFlow can lawfully hold or move customer funds.

## Purpose

Defines how NairaFlow identifies and verifies a customer before allowing wallet funding, P2P
transfers, or remittance activity, and how that verification level gates what the customer can do
in the app.

## Tiered KYC

| Tier | Identity evidence | Wallet balance cap | Monthly transaction cap | Enabled features |
|---|---|---|---|---|
| **Tier 1** | Full name, phone number (OTP-verified), NIN (verified against NIMC, not just format-checked) | ₦300,000 | ₦500,000 | NairaWallet funding, NairaPay P2P |
| **Tier 2** | Tier 1 + a government-issued photo ID (BVN-linked bank verification, voter's card, or international passport) + liveness selfie match | ₦2,000,000 | ₦5,000,000 | Tier 1 + NairaRemit receive, agent cash-out above Tier 1 limits |
| **Tier 3** | Tier 2 + proof of address + enhanced due diligence for high-volume or business accounts | Case-by-case | Case-by-case | Merchant/institutional tier referenced in the deck's business model, agent-network accounts |

Caps are placeholders pending CBN guidance for the licensed product (PSB vs. MMO — see
`COMPLIANCE.md`) and should be finalized with counsel before launch, not treated as final.

## Onboarding flow (step by step)

1. **Collect.** Full name, email, phone number, NIN, password (current signup form —
   `src/app/signup/page.tsx`, `src/lib/actions/auth.ts`).
2. **Verify phone.** Send an OTP to the provided phone number; block progress until confirmed.
   *(Not yet implemented in code — the current signup flow accepts a phone number with no OTP
   step.)*
3. **Verify NIN.** Call NIMC's NIN verification API with the submitted NIN and full name; require an
   exact or fuzzy-matched name match before proceeding. *(Not yet implemented — the current signup
   flow only checks the NIN is 11 digits, which `COMPLIANCE.md` already flags as a demo shortcut,
   not real verification.)*
4. **Screen.** Run the verified name (and, once collected, date of birth) against sanctions/PEP/
   watchlists (OFAC, UN, and Nigeria's applicable list) before account activation. A hit routes to
   manual review, not automatic rejection or automatic approval.
5. **Assign tier.** A clean NIN verification + phone OTP = Tier 1. Tier 2/3 require the customer to
   actively submit additional documents (self-serve upload flow — not yet built) which a human
   reviewer approves before the tier upgrade takes effect.
6. **Activate.** Only after steps 2–4 pass does the wallet accept funding or outbound transfers.
   Today the app activates the wallet immediately on signup — the balance simply starts at ₦0, no
   verification gate exists yet.
7. **Re-verify.** Re-run sanctions screening periodically (not just at onboarding) and on any name/
   phone-number change to the account, since sanctions lists change over time.

## Failure / mismatch handling

- **NIN verification fails or doesn't match the submitted name:** account stays at an unverified,
  zero-privilege state (no funding, no sending). Customer is shown a generic "we couldn't verify
  your details" message — never the specific reason a screening system flagged them, to avoid
  tipping off bad actors.
- **Sanctions/watchlist hit:** account is frozen pending manual review by the Compliance Officer
  (see `COMPLIANCE.md`). No automatic account closure or fund seizure without review — false
  positives on common names are expected and must be handled without unnecessarily
  debanking legitimate customers.
- **Repeated failed NIN attempts:** rate-limited (the app's existing `src/lib/rate-limit.ts`
  infrastructure, built for login/signup, is the natural place to also gate repeated verification
  attempts) and, after a threshold, flagged for manual review rather than allowed to retry
  indefinitely.

## Record retention

Retain KYC records (submitted documents, verification API responses, screening results, and any
manual review notes) for the period required by CBN AML/CFT regulation — typically a minimum of 5
years after account closure, but confirm the exact figure with counsel before relying on it.

## Roles

- **Customer-facing product** (engineering): builds and maintains the collection/verification/tier
  gating logic described above.
- **Compliance Officer** (see `COMPLIANCE.md`): owns this procedure, reviews sanctions hits and
  document-upgrade requests, and is accountable for the program to CBN/NFIU.
- **NIMC / sanctions-screening vendor**: external verification providers — not yet selected or
  integrated into the codebase.
