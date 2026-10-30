import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The Delvies",
  description: "The awards for the most AI-sounding corporate writing. The trophy is a golden em-dash.",
};

const CATEGORIES = [
  { name: "Best Use of “Delve” in an Earnings Call", note: "For the executive who delved and never came back." },
  { name: "Lifetime Achievement in Em-Dashes", note: "For a body of work held together by punctuation." },
  { name: "Most Seamless Synergy", note: "For a press release that leveraged everything and said nothing." },
  { name: "Best Apology Written by a Robot", note: "For the outage post with zero humans in it." },
  { name: "Best Layoff Memo", note: "For the memo that positioned the company for long-term success." },
  { name: "Most Impressed Rejection", note: "For the team that was truly impressed and moved forward with other candidates." },
];

export default function Delvies() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-12 sm:px-6">
      <header className="flex flex-col gap-3">
        <h1 className="text-4xl font-black sm:text-6xl">The Delvies</h1>
        <p className="text-lg">The awards for the most AI-sounding corporate writing of the year. Judged by a linter, which has no feelings to hurt. The trophy is a golden em-dash.</p>
      </header>
      <ul className="grid gap-4 sm:grid-cols-2">
        {CATEGORIES.map((c) => (
          <li key={c.name} className="flex flex-col gap-1 rounded-2xl border-2 border-ink p-5">
            <span className="text-xl font-black">{c.name}</span>
            <span>{c.note}</span>
          </li>
        ))}
      </ul>
      <section className="flex flex-col gap-3 rounded-3xl bg-ink p-6 text-paper sm:p-8">
        <h2 className="text-2xl font-black">How to nominate</h2>
        <p>Paste a public piece of company writing into the slop meter: a press release, an earnings call, a launch post, or an outage apology. Pick &ldquo;Nominate for The Delvies&rdquo; and share the card with #TheDelvies and the category.</p>
        <p className="text-paper/70">Companies only. No private messages and no individuals.</p>
        <Link href="/" className="self-start rounded-full bg-acid px-6 py-2 font-black text-ink">Open the slop meter</Link>
      </section>
    </main>
  );
}
