import { parseConfig, type Config } from "./wlah/config";
import { lint, type Violation } from "./wlah/lint";
import starter from "./wlah/starter-rules.json";
import site from "./site-rules.json";

export const MIN_WORDS = 25;
export const MAX_CHARS = 20_000;

export const config: Config = (() => {
  const base = parseConfig("starter-rules.json", starter);
  const extra = parseConfig("site-rules.json", site);
  return { ...base, rules: [...base.rules, ...extra.rules] };
})();

const LABELS: Record<string, string> = {
  "em-dash": "em-dashes",
  "contrastive-not-but": "not X, but Y",
  "contrastive-not-its": "not X, it's Y",
  "contrastive-soft": "rather than",
  "throat-clearing": "throat-clearing",
  "meta-commentary": "let me be clear",
  "restating-closer": "in conclusion",
  triplet: "rule of three",
  "hope-finds-you-well": "hope this finds you well",
  "corporate-autopilot": "corporate autopilot",
};

const WORD_RULES = new Set(config.rules.filter((r) => r.kind === "words").map((r) => r.id));

// Words rules only ever match words from our own list, so the matched word is safe
// to show on a public card. Everything else gets a fixed label, never user text.
export const tellLabel = (v: Violation): string =>
  WORD_RULES.has(v.rule) ? v.match.toLowerCase().replace(/\s+/g, " ") : (LABELS[v.rule] ?? v.rule);

// Every label a real result can produce. Cards only show labels from this set, so a
// hand-edited share URL can't put arbitrary words on our domain.
export const KNOWN_LABELS: ReadonlySet<string> = new Set([
  ...Object.values(LABELS),
  ...config.rules.flatMap((r) => (r.kind === "words" ? r.words.map((w) => w.toLowerCase()) : [])),
  ...config.rules.map((r) => r.id),
]);

export type Tier = { min: number; headline: string; roast: string };

export const TIERS: Tier[] = [
  { min: 75, headline: "It's giving full robot.", roast: "A language model wrote this and nobody stopped it." },
  { min: 45, headline: "It's giving AI.", roast: "There's a human in here somewhere. Blink twice." },
  { min: 20, headline: "It's giving intern with a chatbot.", roast: "Some of this is you. Some of this is autocomplete." },
  { min: 1, headline: "It's giving mostly you.", roast: "A few tells snuck in. Hunt them down." },
  { min: 0, headline: "It's giving human.", roast: "Zero tells. Either you wrote this or your AI is in witness protection." },
];

export const tierFor = (score: number): Tier => TIERS.find((t) => score >= t.min) ?? TIERS[TIERS.length - 1];

export type Result = {
  words: number;
  tells: number;
  score: number;
  violations: Violation[];
  top: { label: string; count: number }[];
};

// Tell density, not detection: error = 1 point, warning = half, per 100 words.
export const scoreText = (text: string): Result => {
  const r = lint(text.slice(0, MAX_CHARS), config);
  // Two rules can fire on one phrase ("I hope this message finds you well"). Count it once.
  const violations = r.violations
    .filter((v) => v.rule !== "word-budget")
    .toSorted((x, y) => x.index - y.index)
    .filter((v, i, all) => !all.slice(0, i).some((p) => v.index < p.index + p.match.length && p.index < v.index + v.match.length));
  const points = violations.reduce((n, v) => n + (v.severity === "error" ? 1 : 0.5), 0);
  const density = r.words ? (points / r.words) * 100 : 0;
  const counts = violations.reduce<Map<string, number>>((m, v) => m.set(tellLabel(v), (m.get(tellLabel(v)) ?? 0) + 1), new Map());
  const top = [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  return { words: r.words, tells: violations.length, score: Math.min(100, Math.round(density * 12)), violations, top };
};
