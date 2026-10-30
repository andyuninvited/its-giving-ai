// Scores the private rejection/layoff emails in private/rejections/ and writes the
// public stats to src/data/hall.json. Only numbers and tell labels are written;
// no email text, names, or addresses leave the private folder.
//
// <dir>/manifest.json (exported from private/rejections/review.html):
//   { "001.txt": { "company": "████ (fintech, Series C)", "kind": "rejection", "daysToReply": 4 } }
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { scoreText } from "../src/lib/score";

type Meta = { company: string; kind: "rejection" | "layoff"; daysToReply?: number };

const dir = process.argv[2] ?? "private/rejections";
const manifestPath = join(dir, "manifest.json");
const manifest: Record<string, Meta> = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : {};

// Only the emails picked in the manifest get scored and published.
const files = Object.keys(manifest);
const missing = files.filter((f) => !existsSync(join(dir, f)));
if (missing.length) {
  console.error(`Manifest lists files that don't exist in ${dir}: ${missing.join(", ")}`);
  process.exit(1);
}

const entries = files.map((file, i) => {
  const meta = manifest[file];
  const r = scoreText(readFileSync(join(dir, file), "utf8"));
  return { id: `e${i + 1}`, company: meta.company, kind: meta.kind, daysToReply: meta.daysToReply, words: r.words, tells: r.tells, score: r.score, top: r.top.slice(0, 4).map((t) => t.label) };
});

writeFileSync("src/data/hall.json", JSON.stringify(entries, null, 2) + "\n");
const avg = entries.length ? entries.reduce((n, e) => n + e.tells, 0) / entries.length : 0;
console.log(`${entries.length} emails scored. Average ${avg.toFixed(1)} tells each. Top score ${Math.max(0, ...entries.map((e) => e.score))}.`);
