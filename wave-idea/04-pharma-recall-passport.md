# Idea 04 — RecallPassport (Private Pharma Batch Recall & Claims)

## One-line pitch
A privacy-preserving pharmaceutical batch passport and recall-claims system where manufacturers, distributors, and pharmacies verify affected inventory without exposing commercial supply-chain data.

## Why this should be unique vs scored submissions
- No exact phrase-level overlap in judged entries for `batch recall`, `pharma recall passport`, or `warranty claim proof`.
- Product-authenticity projects exist, but this focuses on healthcare recall operations and reimbursement settlement.

## Judge-criteria fit
### 1) Privacy Usage (40%)
- Batch provenance and transfer routes remain private.
- Only recall eligibility and claim validity proofs are publicly verifiable.

### 2) Technical Implementation (20%)
- Non-trivial Leo programs:
  - `batch_passport.aleo`
    - `mint_batch_passport`
    - `transfer_custody_private`
    - `prove_batch_authenticity`
  - `recall_registry.aleo`
    - `issue_recall_notice`
    - `prove_batch_in_recall_set`
    - `close_recall_notice`
  - `recall_settlement.aleo`
    - `fund_recall_pool`
    - `submit_recall_claim`
    - `release_reimbursement_private`

### 3) User Experience (20%)
- Fast scanning flow: Batch lookup → Recall status proof → Claim reimbursement.
- Separate dashboards for manufacturer, distributor, pharmacy.

### 4) Practicality (10%)
- Pharma recalls are frequent and expensive; privacy + verifiability is valuable.

### 5) Novelty (10%)
- Combines private provenance with operational recall payouts on Aleo.

## Rule compliance checklist
- Functional frontend for scan + claim flow.
- Non-trivial Leo contracts deployed on testnet.
- Shield Wallet integrated.
- Payment path via `credits.aleo` / stablecoin for reimbursement.

## Build notes (based on judged repos)
- Reuse proven Shield setup from judged repositories.
- Include explicit transaction progress UI (prepare/prove/broadcast/confirm).

## 1-wave scoring experiment (go/no-go)
- Week MVP target:
  1. mint and transfer one batch passport
  2. publish one recall notice
  3. process one private recall claim payout
- Go: judges react well to privacy + practicality.
- No-go: pivot to Idea 05.
