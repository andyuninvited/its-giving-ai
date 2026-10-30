// Scores extracted emails in private/rejections/text and writes private/rejections/scored.json.
// Private analysis only. Nothing here goes to the public site.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { scoreText, tierFor } from "../src/lib/score";

type Row = { n: string; date: string | null; from_name: string; from_domain: string; subject: string; words: number };

const dir = process.argv[2] ?? "private/rejections/text";
const rows: Row[] = JSON.parse(readFileSync(join(dir, "index.json"), "utf8"));

const scored = rows.map((r) => {
  const s = scoreText(readFileSync(join(dir, `${r.n}.txt`), "utf8"));
  return { ...r, words: s.words, tells: s.tells, score: s.score, tier: tierFor(s.score).headline, top: s.top.slice(0, 5) };
});
writeFileSync(join(dir, "..", "scored.json"), JSON.stringify(scored, null, 1));

const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / Math.max(xs.length, 1);
const tiers = scored.reduce<Record<string, number>>((m, s) => ({ ...m, [s.tier]: (m[s.tier] ?? 0) + 1 }), {});
const tellTotals = scored.flatMap((s) => s.top).reduce<Record<string, number>>((m, t) => ({ ...m, [t.label]: (m[t.label] ?? 0) + t.count }), {});
console.log(JSON.stringify({
  emails: scored.length,
  avgTells: +mean(scored.map((s) => s.tells)).toFixed(1),
  avgScore: +mean(scored.map((s) => s.score)).toFixed(1),
  medianWords: scored.map((s) => s.words).sort((a, b) => a - b)[Math.floor(scored.length / 2)],
  zeroTells: scored.filter((s) => s.tells === 0).length,
  tiers,
  topTells: Object.entries(tellTotals).sort((a, b) => b[1] - a[1]).slice(0, 12),
  byYear: Object.entries(scored.reduce<Record<string, number[]>>((m, s) => { const y = (s.date ?? "?").slice(0, 4); (m[y] ??= []).push(s.score); return m; }, {})).map(([y, xs]) => [y, xs.length, +mean(xs).toFixed(1)]),
}, null, 1));
