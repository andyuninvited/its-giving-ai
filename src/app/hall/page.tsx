import type { Metadata } from "next";
import hall from "@/data/hall.json";

export const metadata: Metadata = {
  title: "The Rejection/Layoff Hall of Shame",
  description: "Real rejection and layoff emails, scored for AI tells. Company names blurred.",
};

type HallEntry = { id: string; company: string; kind: "rejection" | "layoff"; daysToReply?: number; words: number; tells: number; score: number; top: string[] };

const QUIPS = [
  "It's giving intern with a chatbot.",
  "Did someone click send on the template?",
  "Woof. Too busy to customize their rejection.",
  "Touché. Applied with AI, rejected by AI.",
  "\"Dear Candidate,\" said the mail merge.",
  "Copy, paste, regret to inform.",
];

const entries = (hall as HallEntry[]).toSorted((a, b) => b.score - a.score);

export default function Hall() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-12 sm:px-6">
      <header className="flex flex-col gap-3">
        <h1 className="text-4xl font-black sm:text-6xl">The Rejection/Layoff Hall of Shame</h1>
        <p className="text-lg">Every email here is real and was sent to a real person. The scores come from the same rules as the slop meter. Company names are blurred, because the point is the template and not the recruiter who hit send.</p>
      </header>
      {entries.length === 0 ? (
        <p className="rounded-2xl border-2 border-dashed border-ink p-6 text-lg font-semibold">The first inductees are being scored. Check back soon, or nominate your own with #RejectionHallOfShame.</p>
      ) : (
        <ol className="flex flex-col gap-4">
          {entries.map((e, i) => (
            <li key={e.id} className="flex flex-col gap-2 rounded-2xl border-2 border-ink p-5 sm:flex-row sm:items-center sm:gap-6">
              <span className="text-5xl font-black text-hot">{e.score}</span>
              <div className="flex flex-1 flex-col gap-1">
                <span className="text-xl font-black">#{i + 1} {e.company}</span>
                <span className="font-semibold">{e.tells} tells in {e.words} words{e.daysToReply !== undefined ? `, sent ${e.daysToReply} days after applying` : ""}. {QUIPS[i % QUIPS.length]}</span>
                <span className="text-sm text-ink/70">{e.kind === "layoff" ? "Layoff" : "Rejection"} · {e.top.join(" · ")}</span>
              </div>
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
