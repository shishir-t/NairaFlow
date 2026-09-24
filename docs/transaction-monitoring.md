# Transaction Monitoring Procedures

Status: **drafted for review** — written procedure, not a substitute for sign-off by qualified
compliance counsel or the licensing covered in `COMPLIANCE.md`. No part of this is implemented in
the codebase yet; it describes what needs to be built and how it should be operated once it is.

## Purpose

Detects and escalates suspicious activity across NairaWallet, NairaPay, NairaRemit, and the agent
cash-in/cash-out network, and defines how a flagged transaction gets from "system alert" to a filed
report (or a cleared false positive).

## Monitoring triggers

These are starting thresholds to configure and tune with counsel and real transaction data — not
fixed rules the product must ship with unchanged.

| Pattern | Trigger | Applies to |
|---|---|---|
| **Structuring** | Multiple transfers just under a reporting/fee threshold in a short window (e.g. several ₦4,900 P2P sends instead of one ₦20,000 send, avoiding the ₦5,000 flat-fee tier in `src/lib/actions/pay.ts`) | NairaPay |
| **Velocity spike** | Transaction count or volume for an account jumps well above its own trailing average | All products |
| **New-account high-value** | A large first transaction (funding, remit-receive, or cash-out) on a newly created or just-upgraded-tier account | NairaWallet, NairaRemit |
| **Round-tripping** | Funds in via one channel and immediately out via another with no economic purpose (e.g. remittance receive followed instantly by full agent cash-out) | NairaRemit + Agent Network |
| **Agent anomalies** | An agent's cash-in/cash-out volume or commission diverges sharply from their historical pattern, or clusters around a single counterparty | Agent Network |
| **Sanctioned/PEP counterparty** | Either side of a NairaRemit corridor transaction matches a sanctions/PEP screening hit | NairaRemit |
| **Geographic mismatch** | Remittance sender/recipient pairing doesn't match the customer's registered corridor or KYC-collected location without explanation | NairaRemit |

## What's needed in the app vs. what exists today

None of the above triggers currently run anywhere in the codebase. `src/lib/replay-guard.ts` exists
but only prevents duplicate/double-submitted transactions — it is not a monitoring or fraud system.
Before go-live, this procedure requires:

- A monitoring job (scheduled or event-driven) that evaluates new rows in the `transactions` table
  (now Postgres-backed — see `src/lib/schema.ts`) against the trigger rules above.
- An internal case-management view (distinct from the existing `/dashboard/admin` aggregate stats
  page, which is a metrics dashboard, not an alert queue) where flagged transactions land for
  review.
- Sanctions/PEP screening integrated into both account onboarding (`docs/kyc-onboarding.md`) and
  ongoing remittance counterparty checks.

## Escalation path

1. **Alert generated** (system, once built) — a transaction matches a trigger and is queued for
   review, not blocked automatically. Auto-blocking is reserved for confirmed sanctions hits.
2. **First-line review** — a trained reviewer (can be the Compliance Officer directly at NairaFlow's
   current size — see `COMPLIANCE.md`) checks the alert against account history and available
   context within a defined SLA (recommend 24 hours for most alerts, immediate for sanctions hits).
3. **Disposition:**
   - **Cleared** — documented reason logged, no further action, informs future threshold tuning.
   - **Escalated** — enough concern to require deeper investigation, potentially including a
     temporary account hold while investigating.
   - **Reportable** — meets the bar for a formal filing:
     - Nigeria: **Suspicious Transaction Report (STR)** to the NFIU.
     - United States (once the FinCEN MSB registration in `COMPLIANCE.md` is complete):
       **Suspicious Activity Report (SAR)** to FinCEN.
     - United Kingdom (once FCA authorisation in `COMPLIANCE.md` is complete): report to the
       National Crime Agency (NCA) per FCA/JMLSG guidance.
4. **File and record.** Filed reports and their underlying case files are retained per the same
   record-retention standard as KYC records (`docs/kyc-onboarding.md`) — confirm exact retention
   period with counsel.
5. **No tipping off.** Customers are never told a report was filed or that they are under review —
   this is a legal requirement in every jurisdiction above, not a product choice.

## Roles

- **Compliance Officer** (see `COMPLIANCE.md`) — owns this procedure, performs or delegates
  first-line review, makes filing decisions, and is the point of contact for regulators (NFIU,
  FinCEN, FCA/NCA) on these matters.
- **Engineering** — builds and maintains the monitoring job, alert queue, and case-management
  tooling described above; does not make filing decisions.
- **Agent network operations** — surfaces agent-level anomalies from field knowledge that a
  purely transactional system won't catch (e.g. an agent under duress or acting as a front).

## Review cadence

- Alert queue: reviewed daily at minimum once real transaction volume exists.
- Thresholds: reviewed quarterly against actual flagged-vs-cleared rates, and immediately after
  any regulator guidance change.
- This document itself: reviewed at least annually, and before entering any new jurisdiction/
  corridor.
