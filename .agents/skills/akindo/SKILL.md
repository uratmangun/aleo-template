---
name: akindo
description: Fetch Akindo wave-hack data using bundled skill scripts. Use when users ask to list wave-hacks, inspect a wave-hack timeline/detail context, or retrieve wave submissions with pagination via scripts in `.agents/skills/akindo/scripts/`.
---

# Akindo

Use this skill to run and explain Akindo data-fetch scripts in this repository.

## Workflow

1. Confirm which dataset the user needs:
   - wave-hacks list
   - wave timeline/detail context
   - wave submissions
2. Run the matching script from project root.
3. Prefer paginated requests (`--page`, `--page-size`) unless user asks for raw payload.
4. Use `--raw` when user wants machine-readable JSON.
5. For submissions/timeline, resolve `waveHackId` via:
   - `--wave-hack-id <id>`
   - positional `<id>`
   - `AKINDO_WAVE_HACK_ID`

## Script map

- Wave-hacks list: `.agents/skills/akindo/scripts/fetch-akindo-wave-hacks.ts`
- Wave timeline/detail context: `.agents/skills/akindo/scripts/fetch-akindo-wave-timeline.ts`
- Wave submissions: `.agents/skills/akindo/scripts/fetch-akindo-submissions.ts`

Read command examples in `references/commands.md`.
