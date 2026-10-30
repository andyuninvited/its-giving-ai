import { REPO_URL } from "@/lib/card";

const POINTS = [
  { title: "It learns from your edits.", body: "Every time you fix one of its drafts, it notes what you changed. Fix the same thing twice and it becomes a rule." },
  { title: "It checks before you see it.", body: "Each draft runs against the tells this meter just caught, plus every rule your own edits created." },
  { title: "It starts from your writing.", body: "Give it three to ten things you wrote. It measures how you actually write: sentence length, how you open, and the words you lean on." },
  { title: "It's free and stays with you.", body: "Open source under MIT. Your samples and rules live in a folder on your machine." },
];

export function Pitch() {
  return (
    <section className="flex flex-col gap-6 rounded-3xl bg-acid p-6 text-ink shadow-[8px_8px_0_var(--color-ink)] sm:p-10">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-black uppercase tracking-widest text-ink/60">The fix</p>
        <h2 className="text-3xl font-black leading-tight sm:text-5xl">Your AI doesn&apos;t have to write like this.</h2>
        <p className="max-w-2xl text-lg">
          write-like-a-human is a free Claude Code skill that teaches AI to write in your style. Stop fixing the same tells in every draft. Teach it once, and it writes like you.
        </p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2">
        {POINTS.map((p) => (
          <li key={p.title} className="flex flex-col gap-1 rounded-2xl border-2 border-ink bg-paper p-5">
            <span className="text-lg font-black">{p.title}</span>
            <span>{p.body}</span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center gap-4">
        <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="rounded-full bg-ink px-8 py-3 text-lg font-black uppercase tracking-wide text-acid shadow-[5px_5px_0_var(--color-hot)] transition active:translate-x-1 active:translate-y-1 active:shadow-none">
          Get write-like-a-human
        </a>
        <span className="font-semibold">Set up in Claude Code in about a minute.</span>
      </div>
    </section>
  );
}
