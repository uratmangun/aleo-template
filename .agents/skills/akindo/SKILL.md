---
name: akindo
description: Fetch Akindo wave-hack data with bundled scripts. Use when users ask to list wave-hacks, inspect wave timeline/detail context, retrieve submissions, or analyze grant/hidden/github insights by wave-hack id.
---

# Akindo

Use this skill to run and explain Akindo data-fetch scripts in this repository.

## Workflow

1. Confirm which dataset the user needs:
   - wave-hacks list
   - wave timeline/detail context
   - wave submissions
   - submission insights (grant totals, hidden/public status, GitHub links)
2. Run the matching script from project root.
3. Prefer paginated requests (`--page`, `--page-size`) unless user asks for raw payload.
4. Use `--raw` when user wants machine-readable JSON.
5. For submissions/timeline/insights, resolve `waveHackId` via:
   - `--wave-hack-id <id>`
   - positional `<id>`
   - `AKINDO_WAVE_HACK_ID`
6. For grant + visibility checks:
   - wave-level grant total: `waveGrantAmount`
   - submission-level grant result: `earnedAmount`
   - hidden status: `isHidden` (derived from `product.isPublic`)
   - GitHub repo (when public): `githubRepositoryName`
7. For point + rating checks:
   - do not rely on `submission.point` (usually `null`)
   - total score is in `votes[].point`
   - per-criterion ratings are in `votes[].criterionRatings[]`
   - criterion name: `votes[].criterionRatings[].criterion.title`
   - criterion value: `votes[].criterionRatings[].value`
   - point/rating data can be present for both hidden and non-hidden submissions

## Script map

- Wave-hacks list: `.agents/skills/akindo/scripts/fetch-akindo-wave-hacks.ts`
- Wave timeline/detail context: `.agents/skills/akindo/scripts/fetch-akindo-wave-timeline.ts`
- Wave submissions: `.agents/skills/akindo/scripts/fetch-akindo-submissions.ts`
- Submission insights (grant/hidden/github): `.agents/skills/akindo/scripts/fetch-akindo-submission-insights.ts`

Read command examples in `references/commands.md`.
