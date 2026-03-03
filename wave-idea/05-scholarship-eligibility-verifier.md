# Idea 05 — GrantGate (Private Scholarship & Tuition Eligibility Verifier)

## One-line pitch
A private scholarship disbursement platform where students prove eligibility (income bracket, GPA threshold, residency criteria) without exposing full personal or academic records.

## Why this should be unique vs scored submissions
- No judged overlap on `scholarship eligibility`, `tuition grant`, or privacy-first student aid proofs.
- Education + compliant grant disbursement is not saturated in current scored entries.

## Judge-criteria fit
### 1) Privacy Usage (40%)
- Student identity attributes, grades, and income data stay private.
- Only eligibility proofs and grant allocation validity become verifiable.

### 2) Technical Implementation (20%)
- Non-trivial Leo programs:
  - `eligibility_rules.aleo`
    - `register_rule_commitment`
    - `prove_threshold_eligibility`
    - `invalidate_rule_version`
  - `grant_allocation.aleo`
    - `create_grant_round`
    - `submit_private_application`
    - `approve_application`
    - `mint_award_record`
  - `tuition_settlement.aleo`
    - `fund_tuition_pool`
    - `release_tuition_payment_private`

### 3) User Experience (20%)
- Applicant flow with checklist and proof status.
- Admin panel for blinded ranking + budget tracking.

### 4) Practicality (10%)
- Useful for universities, foundations, and NGOs distributing aid fairly.

### 5) Novelty (10%)
- Bridges privacy-preserving credentials with institutional grant payments.

## Rule compliance checklist
- Live frontend with end-to-end app + payout test flow.
- Non-trivial Leo contracts on Aleo testnet.
- Shield Wallet integrated as default wallet path.
- Tuition payout using `credits.aleo` or stablecoin standard.

## Build notes (based on judged repos)
- Use Shield adapter packages and provider structure from judged projects.
- Design clear proof-state UX to reduce judge friction during demo.

## 1-wave scoring experiment (go/no-go)
- Week MVP target:
  1. one rule registration
  2. one private eligibility proof
  3. one grant disbursement transaction
- Go: positive score signal on privacy/practicality.
- No-go: pivot to Idea 06.
