# Compliance groundwork

This is a checklist, not legal advice. NairaFlow moves real money once the demo integrations in
this repo are replaced with live ones, and that triggers licensing/regulatory obligations in every
jurisdiction it touches. None of this can be done by writing code — it requires engaging licensed
counsel and the actual regulators. Treat this file as the starting punch list referenced in the
investor deck (`CBN PSB`, `FCA`, `FinCEN`).

## Compliance Officer

**Shishir Tumukuntala** (founder) is designated as NairaFlow's interim, part-time Compliance
Officer, effective immediately, until the company makes a dedicated compliance hire. *(Name
inferred from the account on file — correct this directly in the file if it's wrong.)*

Responsibilities at this stage: owns `docs/kyc-onboarding.md` and `docs/transaction-monitoring.md`,
is the designated point of contact for CBN/NFIU, FCA/NCA, and FinCEN once those registrations
exist, and signs off before any new corridor or product feature that touches real money ships.
This is a named-individual accountability requirement under CBN AML/CFT rules and FinCEN's BSA/AML
program requirement for MSBs (both referenced below) — it is not satisfiable by "the team" or by an
unnamed role.

## Nigeria — Central Bank of Nigeria (CBN)

- [ ] Engage Nigerian fintech/payments counsel before any real money moves through the app.
- [ ] Determine the correct license tier for NairaWallet + NairaPay: likely a **Payment Service
      Bank (PSB)** license, or a **Mobile Money Operator (MMO)** license depending on final product
      shape (deposit-taking vs. pure payments). The deck's own roadmap (`Q3 2025 — Seed & Build`)
      assumes PSB.
  - Minimum capital requirements, fit-and-proper checks on directors, and a physical Nigeria
    presence are all CBN prerequisites — budget timeline accordingly (this is typically a
    multi-month to multi-quarter process, not a sprint item).
- [ ] Register with the CBN's National Financial Inclusion Strategy program referenced in the
      deck's "Government & Connectivity" section, if pursuing the state-government MoU angle.
- [x] AML/CFT program: appointed compliance officer (above), written KYC onboarding procedure
      (`docs/kyc-onboarding.md`), and written transaction monitoring procedure
      (`docs/transaction-monitoring.md`) are now drafted. **Not yet done:** the procedures
      themselves aren't implemented in code (no real NIN verification, no live monitoring job — see
      each doc's own gap list), and neither doc has been reviewed by counsel or filed with
      regulators. Drafting the procedure is not the same as running it.
- [ ] NIN verification must go through NIMC's actual verification API (the app currently accepts
      any 11-digit string as a NIN — see `src/lib/actions/auth.ts` — this is a demo shortcut, not a
      real KYC check). Tracked in `docs/kyc-onboarding.md`.

## United Kingdom — FCA

- [ ] Required for the NairaRemit UK corridor. Likely an **Authorised Payment Institution (API)**
      or **Electronic Money Institution (EMI)** authorisation, or operating as an agent of an
      already-authorised institution (faster path for an MVP).
- [ ] FCA authorisation includes safeguarding requirements for customer funds (segregated
      accounts), and ongoing regulatory reporting.

## United States — FinCEN

- [ ] Register as a **Money Services Business (MSB)** with FinCEN for the US remittance corridor.
- [ ] State-by-state money transmitter licensing is separate from the federal FinCEN registration
      and is typically the longer pole — each state NairaRemit operates in needs its own license.
- [x] Designated compliance officer named (above) — required by FinCEN for MSBs.
- [ ] BSA/AML program: SAR filing and recordkeeping process, per FinCEN requirements for MSBs
      (draft transaction monitoring / SAR escalation path in `docs/transaction-monitoring.md`, not
      yet reviewed by US counsel or operational).

## Cross-cutting

- [ ] Data protection: Nigeria's NDPR (and UK/EU GDPR if handling UK/EU sender data) both apply —
      review data retention and cross-border transfer of user KYC data.
- [ ] Sanctions/watchlist screening (OFAC, UN, etc.) on both sides of every remittance corridor
      before it goes live — not currently implemented anywhere in this codebase.
- [ ] Each licensed corridor should be gated behind a feature flag so NairaRemit can launch
      market-by-market as licensing clears, rather than all-or-nothing (aligns with the deck's own
      phased roadmap: UK & US corridors first, then expansion).

None of the above is started in code. The one thing engineering can usefully do ahead of licensing
is keep the corridor list (`src/lib/fx.ts` → `CORRIDORS`) easy to gate per-corridor, so turning a
corridor on/off as licenses clear doesn't require a code change beyond a config flip — worth
revisiting when the Paystack/real-money integration lands.
