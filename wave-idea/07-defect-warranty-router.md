# Idea 07 — WarrantyRouter (Private Defect Claims & Manufacturer Settlement)

## One-line pitch
A private warranty-claims router where buyers prove entitlement, service centers verify defect categories, and manufacturers settle reimbursements without exposing sensitive customer/device data.

## Why this should be unique vs scored submissions
- No direct overlap in judged entries for `warranty claim`, `defect proof`, or private after-sales settlement pipelines.
- Distinct from existing authenticity, payment, and generic escrow projects.

## Judge-criteria fit
### 1) Privacy Usage (40%)
- Keep serial history, user profile, and service diagnostics private.
- Publicly verify only claim legitimacy and payout finality.

### 2) Technical Implementation (20%)
- Non-trivial Leo programs:
  - `warranty_passport.aleo`
    - `mint_warranty_passport`
    - `transfer_ownership_private`
    - `prove_warranty_active`
  - `defect_claims.aleo`
    - `submit_defect_claim`
    - `attest_service_result`
    - `approve_or_reject_claim`
  - `manufacturer_settlement.aleo`
    - `fund_claim_pool`
    - `release_claim_payout_private`

### 3) User Experience (20%)
- Consumer flow: claim submission with guided privacy controls.
- Service-center console for diagnostics attestation.
- Manufacturer dashboard for claims queue and settlement state.

### 4) Practicality (10%)
- Warranty claims are universal in electronics/appliances and costly to process.

### 5) Novelty (10%)
- Privacy-preserving claim lifecycle + settlement is uncommon in current Aleo builds.

## Rule compliance checklist
- Functional frontend with testable claim path.
- Non-trivial deployed Leo contracts.
- Shield Wallet integration included.
- Settlement payments integrated with Aleo core token tooling.

## Build notes (based on judged repos)
- Use Shield provider pattern and network config from scored examples.
- Include clear claim-state transitions to simplify judging.

## 1-wave scoring experiment (go/no-go)
- Week MVP target:
  1. issue warranty passport
  2. submit + verify one defect claim
  3. settle one private reimbursement
- Go: strong practicality + privacy score.
- No-go: pivot to Idea 08.
