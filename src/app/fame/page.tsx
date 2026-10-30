import type { Metadata } from "next";
import Link from "next/link";
import fame from "@/data/fame.json";

export const metadata: Metadata = {
  title: "Hall of Fame: Actually Human Resources",
  description: "Companies that sent rejection emails scoring zero on the slop meter. Thank you, HR.",
};

const CHEERS = ["🎉", "👏", "🙌", "💐", "🏆", "✨"];

const companies = (fame as { company: string }[]).map((f) => f.company).toSorted((a, b) => a.localeCompare(b));

export default function Fame() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-12 sm:px-6">
      <header className="flex flex-col gap-3">
        <p className="text-5xl" aria-hidden>
          🎉👏🙌
        </p>
        <h1 className="text-4xl font-black sm:text-6xl">Hall of Fame: Actually Human Resources</h1>
        <p className="text-lg">
          Getting rejected is personal, and these HR teams wrote like they knew it. Every company below sent a rejection email that scored zero on the slop meter, with no AI tells and none of the usual template phrases. Somebody took the time to write to a candidate like a person.
        </p>
        <p className="text-lg font-bold">Thank you. You made a hard day a little easier.</p>
      </header>
      {companies.length === 0 ? (
        <p className="rounded-2xl border-2 border-dashed border-ink p-6 text-lg font-semibold">The first inductees are being confirmed. Check back soon.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {companies.map((c, i) => (
            <li key={c} className="flex items-center gap-3 rounded-2xl border-2 border-ink bg-acid/40 px-5 py-4 text-xl font-black">
              <span aria-hidden>{CHEERS[i % CHEERS.length]}</span>
              {c}
            </li>
          ))}
        </ul>
      )}
      <p className="text-sm text-ink/70">
        Only company names are listed. We never publish the emails or the name of anyone who wrote them. A zero score means the meter found no AI tells or template phrases, which is the closest a linter gets to a thank-you note.
      </p>
      <Link href="/hall" className="self-start font-bold underline">
        Then there&apos;s the Hall of Shame 🫣
      </Link>
    </main>
  );
}
