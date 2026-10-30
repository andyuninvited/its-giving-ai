## Working State

**Current Task**: v1 built locally; waiting on Andy's rejection emails for the Hall, and on approval to create the public repo and deploy.
**Key Files**: src/lib/score.ts (scoring + tier copy), src/lib/card.ts (share params allowlist), src/app/api/card/route.tsx (OG card), src/components/checker.tsx (main UI), scripts/score-hall.ts (private emails to stats).
**Active Decisions**: Hashtag entries (#TheDelvies, #RejectionHallOfShame) instead of stored submissions, so there is no database, moderation queue, or private text to protect. Lint engine vendored rather than imported, to keep the site independent of the CLI package.
**Next Steps**: Score Andy's emails, Andy edits tier/roast copy, repo + Vercel deploy, custom domain decision.
**Blockers**: Public repo creation and deploy need Andy's OK.
**Gotchas**: Satori needs display flex on multi-child divs. Default OG font has no bold; Archivo Black is bundled via outputFileTracingIncludes.

## Session Archive

### 2026-10-30 - v1 build
Scaffolded Next 16 app, vendored write-like-a-human lint, added site rules for rejection boilerplate, built checker with highlights, OG share cards, Hall of Shame and Delvies pages, hall scoring script. 12 tests pass, build passes.
