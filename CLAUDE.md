# It's Giving AI

Slop meter web app: paste text, get AI tells highlighted, a 0-100 tell-density score, and a shareable OG card. Launch artifact for write-like-a-human (see andy/campaigns/oss-launch-plan-2026-10-29.md).

## Stack

- Next.js 16 (App Router), React 19, Tailwind 4, TypeScript strict
- vitest for tests, tsx for scripts
- Deployment: Vercel (not yet deployed)

## Commands

```
pnpm dev | build | test | typecheck | lint
pnpm score:hall   # score private/rejections/* into src/data/hall.json
```

## Structure

```
src/lib/wlah/        vendored lint engine + starter rules from write-like-a-human (keep in sync by hand)
src/lib/site-rules.json  site-only rules (corporate autopilot, hope-finds-you-well)
src/lib/score.ts     scoring, tiers and roast copy, tell labels
src/lib/card.ts      share-card URL params (strict allowlist)
src/app/api/card     OG image (next/og, Archivo Black from assets/fonts)
src/app/{c,hall,delvies}  share page, Hall of Shame, The Delvies
```

## Key Context

- Text never leaves the browser. Cards carry only numbers and labels from KNOWN_LABELS, so a hand-edited URL can't put arbitrary words on the domain.
- Score = (errors + 0.5 x warnings) per 100 words x 12, capped at 100. A density score, not a detector; the footer says so.
- Overlapping tells on one phrase count once.
- `private/` is gitignored and holds Andy's real rejection emails. Never commit it. hall.json holds stats only.
- Satori: every div with more than one child needs display flex, or the card route 500s.
- Companies only. No private individuals' text anywhere on the site.

@AGENTS.md
