# Akindo skill script commands

Run commands from repository root.

Use any TypeScript runner available in your environment. Examples below use `npx tsx` with bundled scripts in `.agents/skills/akindo/scripts/`.

## 1) List wave-hacks

Script: `.agents/skills/akindo/scripts/fetch-akindo-wave-hacks.ts`

```bash
npx tsx .agents/skills/akindo/scripts/fetch-akindo-wave-hacks.ts --page 1 --page-size 12
```

Raw JSON:

```bash
npx tsx .agents/skills/akindo/scripts/fetch-akindo-wave-hacks.ts --page 1 --page-size 12 --raw
```

## 2) Fetch wave timeline (wave-hack detail context)

Script: `.agents/skills/akindo/scripts/fetch-akindo-wave-timeline.ts`

By flag:

```bash
npx tsx .agents/skills/akindo/scripts/fetch-akindo-wave-timeline.ts --wave-hack-id <waveHackId> --page 1 --page-size 5
```

By positional ID:

```bash
npx tsx .agents/skills/akindo/scripts/fetch-akindo-wave-timeline.ts <waveHackId> --page 1 --page-size 5
```

By environment variable:

```bash
AKINDO_WAVE_HACK_ID=<waveHackId> npx tsx .agents/skills/akindo/scripts/fetch-akindo-wave-timeline.ts --page 1 --page-size 5
```

Raw JSON:

```bash
npx tsx .agents/skills/akindo/scripts/fetch-akindo-wave-timeline.ts <waveHackId> --page 1 --page-size 5 --raw
```

## 3) Fetch submissions

Script: `.agents/skills/akindo/scripts/fetch-akindo-submissions.ts`

By flag:

```bash
npx tsx .agents/skills/akindo/scripts/fetch-akindo-submissions.ts --wave-hack-id <waveHackId> --page 1 --page-size 10
```

By positional ID:

```bash
npx tsx .agents/skills/akindo/scripts/fetch-akindo-submissions.ts <waveHackId> --page 1 --page-size 10
```

By environment variable:

```bash
AKINDO_WAVE_HACK_ID=<waveHackId> npx tsx .agents/skills/akindo/scripts/fetch-akindo-submissions.ts --page 1 --page-size 10
```

Raw JSON:

```bash
npx tsx .agents/skills/akindo/scripts/fetch-akindo-submissions.ts <waveHackId> --page 1 --page-size 10 --raw
```

## Notes

- `--page-size` is capped at `50` in all three scripts.
- `fetch-akindo-submissions.ts` paginates by wave page, then fetches submissions for waves in that page.
- Suggested flow:
  1. List wave-hacks and pick `waveHackId`
  2. Inspect timeline for context
  3. Fetch submissions for the same `waveHackId`
