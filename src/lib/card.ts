import { KNOWN_LABELS } from "./score";

export type Entry = "delvies" | "hall";

export type CardParams = {
  score: number;
  words: number;
  tells: number;
  top: string[];
  entry?: Entry;
};

const int = (raw: string | null, max: number): number | undefined => {
  if (raw === null || !/^\d{1,6}$/.test(raw)) return undefined;
  const n = Number(raw);
  return n <= max ? n : undefined;
};

// Card URLs are public and user-editable, so every field is validated and anything
// unknown is dropped. No free text from the checked writing ever reaches a card.
export const parseCard = (q: URLSearchParams): CardParams | undefined => {
  const score = int(q.get("s"), 100);
  const words = int(q.get("w"), 100_000);
  const tells = int(q.get("t"), 100_000);
  if (score === undefined || words === undefined || tells === undefined) return undefined;
  const top = (q.get("k") ?? "")
    .split("|")
    .map((s) => s.trim().toLowerCase())
    .filter((s) => KNOWN_LABELS.has(s))
    .slice(0, 3);
  const e = q.get("e");
  return { score, words, tells, top, entry: e === "delvies" || e === "hall" ? e : undefined };
};

export const cardQuery = (p: CardParams): string => {
  const q = new URLSearchParams({ s: String(p.score), w: String(p.words), t: String(p.tells) });
  if (p.top.length) q.set("k", p.top.slice(0, 3).join("|"));
  if (p.entry) q.set("e", p.entry);
  return q.toString();
};

export const HASHTAGS: Record<Entry, string> = {
  delvies: "#TheDelvies",
  hall: "#RejectionHallOfShame",
};

export const REPO_URL = "https://github.com/andyuninvited/write-like-a-human";
