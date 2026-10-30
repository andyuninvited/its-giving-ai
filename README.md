# It's Giving AI

Paste the rejection email, the layoff memo, the press release, or your own cover letter, and find out how much of it a human actually wrote.

The slop meter counts AI tells (delve, em-dashes, "not X, but Y", throat-clearing openers, corporate autopilot) and gives the text a 0 to 100 score with a shareable card. It's a tell-density score, not an AI detector, and humans write these phrases too.

- **Private by design.** Text is checked in the browser and never sent anywhere. Share cards carry only the score, the word and tell counts, and up to three tell names from a fixed list.
- **The Rejection/Layoff Hall of Shame** at `/hall`: real emails, scored, company names blurred.
- **The Delvies** at `/delvies`: awards for the most AI-sounding corporate writing. Nominate with #TheDelvies.

Rules come from [write-like-a-human](https://github.com/andyuninvited/write-like-a-human), which teaches AI to write like you instead.

## Develop

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm test         # vitest
pnpm typecheck
pnpm lint
pnpm build
```

## Scoring the Hall of Shame

Put email bodies as `.txt` files in `private/rejections/` (gitignored) with a `manifest.json` that gives each one a blurred company label:

```json
{ "acme.txt": { "company": "████ (fintech, Series C)", "kind": "rejection", "daysToReply": 4 } }
```

Then run `pnpm score:hall`. It writes only numbers and tell labels to `src/data/hall.json`.

## License

MIT for the code. Archivo Black is under the SIL Open Font License (`assets/fonts/OFL.txt`). The favicon robot is from Google's [Noto Emoji](https://github.com/googlefonts/noto-emoji), Apache License 2.0.
