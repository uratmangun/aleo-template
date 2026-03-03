# Idea 03 — BuildProof Escrow (Private Construction Milestone Settlement)

## One-line pitch
A private construction payment rail where contractors prove milestone completion and owners release escrow without exposing sensitive budget, subcontractor, or margin details.

## Why this should be unique vs scored submissions
- No direct judged overlap for `construction escrow` or `milestone escrow` terms.
- Existing escrow/payment ideas are mostly generic or invoice-centric, not milestone-based construction execution.

## Judge-criteria fit
### 1) Privacy Usage (40%)
- Keep BoQ details, invoice line items, and subcontractor rates private.
- Publish only milestone status proofs and settlement receipts.

### 2) Technical Implementation (20%)
- Non-trivial Leo programs:
  - `project_escrow.aleo`
    - `open_project_escrow`
    - `fund_project_pool`
    - `release_milestone_payment_private`
  - `milestone_proof.aleo`
    - `commit_progress_evidence_hash`
    - `approve_milestone`
    - `challenge_milestone`
    - `resolve_challenge`
  - `retention_pool.aleo`
    - `lock_retention_amount`
    - `release_retention_after_acceptance`

### 3) User Experience (20%)
- Visual milestone timeline with proof status and payout state.
- Owner/Contractor/Supervisor role dashboards.

### 4) Practicality (10%)
- Clear real-world use case for contractors, developers, and infrastructure projects.

### 5) Novelty (10%)
- Privacy-first milestone governance + escrow settlement is uncommon in current Aleo submissions.

## Rule compliance checklist
- Functional frontend with real interaction path.
- Non-trivial Leo contracts deployed on Aleo testnet.
- Shield Wallet integration required.
- Payment settlement through `credits.aleo` / stablecoin programs.

## Build notes (based on judged repos)
- Follow Shield wallet provider pattern and transaction-state UX from high-scoring repos.
- Use async/finalize Leo patterns for state transitions and dispute windows.

## 1-wave scoring experiment (go/no-go)
- Week MVP target:
  1. create project escrow
  2. submit and approve one milestone proof
  3. release one private milestone payment
- Go: judges score privacy + technical implementation positively.
- No-go: pivot to Idea 04.
