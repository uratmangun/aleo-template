# Idea 06 — BorderProof (Private Customs Clearance Dossier)

## One-line pitch
A cross-border trade compliance app where exporters prove regulatory compliance and tariff class correctness without exposing full invoice, supplier, or margin data.

## Why this should be unique vs scored submissions
- No phrase overlap in judged entries for `customs dossier`, `tariff settlement`, or private cross-border compliance proofs.
- Differentiates from generic private invoice/payment products by focusing on customs workflows.

## Judge-criteria fit
### 1) Privacy Usage (40%)
- Hide sensitive trade docs (supplier price, partner identities, line-item economics).
- Reveal only zk proofs that declarations satisfy customs rules.

### 2) Technical Implementation (20%)
- Non-trivial Leo programs:
  - `declaration_commit.aleo`
    - `commit_trade_declaration`
    - `prove_tariff_code_validity`
    - `prove_origin_rule_satisfaction`
  - `clearance_registry.aleo`
    - `request_clearance`
    - `issue_clearance_attestation`
    - `revoke_clearance`
  - `duty_settlement.aleo`
    - `fund_duty_pool`
    - `pay_duty_private`
    - `issue_settlement_receipt`

### 3) User Experience (20%)
- Guided declaration wizard and status tracker: Draft → Proof Ready → Clearance Issued.
- Role-based interface: Exporter / Broker / Auditor.

### 4) Practicality (10%)
- Real need in international trade for selective disclosure with compliance.

### 5) Novelty (10%)
- Introduces privacy-first customs compliance to Aleo ecosystem.

## Rule compliance checklist
- Functional frontend judges can test.
- Non-trivial Leo contracts deployed to testnet.
- Shield Wallet integration mandatory.
- Duty payment through `credits.aleo` / stablecoin if settlement flow is included.

## Build notes (based on judged repos)
- Follow judged app pattern for wallet connect + transaction state lifecycle.
- Keep one-click demo path for judges (fast deterministic scenario).

## 1-wave scoring experiment (go/no-go)
- Week MVP target:
  1. create declaration commitment
  2. generate one compliance proof
  3. complete one duty settlement
- Go: judges reward novelty + practicality.
- No-go: pivot to Idea 07.
