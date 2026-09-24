# Compliance groundwork

This is a checklist, not legal advice. NairaFlow moves real money once the demo integrations in
this repo are replaced with live ones, and that triggers licensing/regulatory obligations in every
jurisdiction it touches. None of this can be done by writing code — it requires engaging licensed
counsel and the actual regulators. Treat this file as the starting punch list referenced in the
investor deck (`CBN PSB`, `FCA`, `FinCEN`).

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
- [ ] AML/CFT program: appointed compliance officer, transaction monitoring thresholds, and
      Suspicious Transaction Report (STR) filing process with the NFIU, all required before
      go-live — not optional add-ons.
- [ ] NIN verification must go through NIMC's actual verification API (the app currently accepts
      any 11-digit string as a NIN — see `src/lib/actions/auth.ts` — this is a demo shortcut, not a
      real KYC check).

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
- [ ] BSA/AML program: SAR filing, recordkeeping, and a designated compliance officer, per FinCEN
      requirements for MSBs.

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
