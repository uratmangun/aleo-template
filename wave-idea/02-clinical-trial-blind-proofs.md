# Idea 02 — TrialShield (Private Clinical Trial Blind Proofs)

## One-line pitch
A privacy-preserving trial operations platform where sponsors and sites prove protocol compliance and blinded outcome integrity without revealing patient-level sensitive data.

## Why this should be unique vs scored submissions
- No exact phrase matches in judged updates for `clinical trial blind`, `adverse event proof`, or `trial protocol zk`.
- Health-related submissions exist, but not this specific trial-compliance + blinding integrity workflow.

## Judge-criteria fit
### 1) Privacy Usage (40%)
- Protect patient-level records and site-level sensitive metrics.
- Only disclose zk proofs for inclusion compliance, event count bounds, and protocol adherence.

### 2) Technical Implementation (20%)
- Non-trivial Leo programs:
  - `trial_registry.aleo`
    - `register_trial_protocol_hash`
    - `authorize_trial_site`
    - `close_trial_window`
  - `blinded_outcome.aleo`
    - `submit_blinded_result_commitment`
    - `prove_inclusion_criteria_satisfied`
    - `prove_event_count_within_range`
  - `site_reimbursement.aleo`
    - `fund_reimbursement_pool`
    - `release_site_payment_private`

### 3) User Experience (20%)
- Role-based UI: Sponsor / Site / Auditor.
- Guided workflows with status board: Registered → Recruiting → Blinded Reporting → Audit Proof Export.

### 4) Practicality (10%)
- Trial compliance and data integrity are real enterprise pain points.

### 5) Novelty (10%)
- Brings private trial governance and compliance proofs to Aleo with practical B2B use.

## Rule compliance checklist
- Functional testable frontend.
- Non-trivial deployed Leo contracts on testnet.
- Shield Wallet integrated for transaction/proof signing.
- If reimbursements are used: integrate `credits.aleo` or stablecoin rails.

## Build notes (based on judged repos)
- Use the same Shield adapter architecture seen in judged repositories:
  - wallet provider + modal provider + testnet config.
- Keep proofs client-triggered, with explicit transaction state in UI.

## 1-wave scoring experiment (go/no-go)
- Week MVP target:
  1. register one trial
  2. submit one blinded outcome commitment
  3. verify one compliance proof in UI
  4. optional private site reimbursement
- Go: judges acknowledge strong privacy + practicality.
- No-go: pivot to Idea 03.
