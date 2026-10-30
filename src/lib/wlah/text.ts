// Vendored from write-like-a-human src/lib/text.ts (subset).
export type Frontmatter = Record<string, string>;

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
const WORD = /[A-Za-z0-9][A-Za-z0-9'’-]*/g;

export const parseFrontmatter = (text: string): { data: Frontmatter; body: string } => {
  const match = FRONTMATTER.exec(text);
  if (!match) return { data: {}, body: text };
  const data = Object.fromEntries(
    (match[1] ?? "")
      .split(/\r?\n/)
      .map((line) => /^([A-Za-z][\w-]*)\s*:\s*(.*)$/.exec(line))
      .filter((m): m is RegExpExecArray => m !== null)
      .map((m) => [m[1] ?? "", (m[2] ?? "").trim().replace(/^["']|["']$/g, "")]),
  );
  return { data, body: text.slice(match[0].length) };
};

const blank = (s: string): string => s.replace(/[^\n]/g, " ");

// Replaces frontmatter, fenced code, inline code, and HTML comments with spaces so
// offsets into the masked text still line up with the original file.
export const maskNonProse = (text: string): string => {
  const fm = FRONTMATTER.exec(text);
  const head = fm ? blank(fm[0]) : "";
  return (head + text.slice(fm ? fm[0].length : 0))
    .replace(/```[\s\S]*?```/g, blank)
    .replace(/~~~[\s\S]*?~~~/g, blank)
    .replace(/<!--[\s\S]*?-->/g, blank)
    .replace(/`[^`\n]*`/g, blank);
};

export const countWords = (text: string): number => text.match(WORD)?.length ?? 0;

export const lineCol = (text: string, index: number): { line: number; col: number } => {
  const before = text.slice(0, index);
  const lines = before.split("\n");
  return { line: lines.length, col: (lines[lines.length - 1]?.length ?? 0) + 1 };
};
