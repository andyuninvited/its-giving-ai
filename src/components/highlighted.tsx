import type { Violation } from "@/lib/wlah/lint";
import { tellLabel } from "@/lib/score";

type Segment = { text: string; hit?: Violation };

const segments = (text: string, violations: Violation[]): Segment[] => {
  const hits = violations.filter((v) => v.match).sort((a, b) => a.index - b.index);
  const out: Segment[] = [];
  let cursor = 0;
  for (const v of hits) {
    if (v.index < cursor) continue;
    if (v.index > cursor) out.push({ text: text.slice(cursor, v.index) });
    out.push({ text: text.slice(v.index, v.index + v.match.length), hit: v });
    cursor = v.index + v.match.length;
  }
  out.push({ text: text.slice(cursor) });
  return out;
};

export function Highlighted({ text, violations }: { text: string; violations: Violation[] }) {
  return (
    <div className="whitespace-pre-wrap rounded-2xl border-2 border-ink bg-paper p-5 font-mono text-[15px] leading-7 text-ink">
      {segments(text, violations).map((s, i) =>
        s.hit ? (
          <mark
            key={i}
            title={`${tellLabel(s.hit)}: ${s.hit.message}`}
            className={s.hit.severity === "error" ? "rounded bg-hot/25 text-ink underline decoration-hot decoration-2" : "rounded bg-acid/60 text-ink"}
          >
            {s.text}
          </mark>
        ) : (
          <span key={i}>{s.text}</span>
        ),
      )}
    </div>
  );
}
