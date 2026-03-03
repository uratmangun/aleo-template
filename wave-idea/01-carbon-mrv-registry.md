# Idea 01 — CarbonMRV Registry

## One-line pitch
A privacy-preserving carbon MRV (Measurement, Reporting, Verification) platform where companies prove emissions reduction and carbon credit retirement on Aleo without exposing plant-level operational data.

## Why this should be unique vs scored submissions
- In the scored set for `gXdXJvJXxTJKBELvo` (226 judged entries), there was no direct match for key phrases like `carbon mrv`, `emissions ledger`, or `emission proof`.
- Existing projects heavily focus on payments, prediction, lending, social, and identity; climate MRV is still underexplored.

## Judge-criteria fit
### 1) Privacy Usage (40%)
- Keep raw emissions inputs private (energy usage, production volume, supplier factors).
- Publish only zk-verified emissions deltas and retirement attestations.

### 2) Technical Implementation (20%)
- Non-trivial Leo programs:
  - `mrv_commitments.aleo`
    - `commit_emissions_snapshot`
    - `prove_emission_delta_range`
    - `attest_verifier_signature`
  - `credit_lifecycle.aleo`
    - `mint_credit_from_verified_delta`
    - `retire_credit`
    - `transfer_credit_private`
  - `audit_disclosure.aleo`
    - `grant_auditor_view`
    - `revoke_auditor_view`

### 3) User Experience (20%)
- Dashboard for company, verifier, and auditor.
- Guided flows: Upload evidence hash → Generate proof → Mint/retire credits → Export compliance receipt.

### 4) Practicality (10%)
- Strong B2B compliance narrative for climate reporting and supply-chain sustainability.

### 5) Novelty (10%)
- Combines private industrial telemetry with verifiable carbon accounting on Aleo.

## Rule compliance checklist
- Functional frontend with end-to-end test flow.
- Non-trivial Leo code on Aleo testnet (not `leo new` default).
- Shield Wallet integration (minimum requirement).
- Payment rails via `credits.aleo` or stablecoin (`USDCx`/`USAD`) for verifier fees.

## Build notes (based on judged repos)
- Use Shield integration pattern from successful repos:
  - `@provablehq/aleo-wallet-adaptor-react`
  - `@provablehq/aleo-wallet-adaptor-react-ui`
  - `@provablehq/aleo-wallet-adaptor-shield`
- Configure wallet provider with testnet and supported programs.

## 1-wave scoring experiment (go/no-go)
- Week MVP target:
  1. private emissions commitment
  2. one verifiable reduction proof
  3. one private credit retirement
  4. working Shield-based frontend flow
- Go: judged score > 0 with positive privacy/technical feedback.
- No-go: poor privacy/novelty signal, then pivot to Idea 02.
