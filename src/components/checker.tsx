"use client";

import { useMemo, useState } from "react";
import { MAX_CHARS, MIN_WORDS, scoreText, tierFor } from "@/lib/score";
import { cardQuery, HASHTAGS, SITE_URL, type Entry } from "@/lib/card";
import { SAMPLES } from "@/lib/samples";
import { Highlighted } from "./highlighted";
import { Pitch } from "./pitch";

const ENTRIES: { id: Entry | "none"; label: string }[] = [
  { id: "none", label: "Just roast me" },
  { id: "delvies", label: "Nominate for The Delvies" },
  { id: "hall", label: "Enter the Rejection/Layoff Hall of Shame" },
];

export function Checker() {
  const [text, setText] = useState("");
  const [checked, setChecked] = useState("");
  const [entry, setEntry] = useState<Entry | "none">("none");
  const result = useMemo(() => (checked ? scoreText(checked) : undefined), [checked]);

  const tooShort = result !== undefined && result.words < MIN_WORDS;
  const tier = result && !tooShort ? tierFor(result.score) : undefined;
  const query =
    result && !tooShort
      ? cardQuery({ score: result.score, words: result.words, tells: result.tells, top: result.top.map((t) => t.label), entry: entry === "none" ? undefined : entry })
      : "";
  const shareUrl = `${SITE_URL}/c?${query}`;
  const tag = entry === "none" ? "#ItsGivingAI" : `${HASHTAGS[entry]} #ItsGivingAI`;
  const shareText = tier ? `${tier.headline} ${result?.score}/100 on the slop meter. ${tag}` : "";

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        <span className="py-1.5 text-sm font-semibold text-ink/60">Try one:</span>
        {SAMPLES.map((s) => (
          <button key={s.id} onClick={() => { setText(s.text); setChecked(s.text); }} className="rounded-full border-2 border-ink px-3 py-1 text-sm font-semibold hover:bg-ink hover:text-paper">
            {s.label}
          </button>
        ))}
      </div>

      <label htmlFor="slop" className="sr-only">Text to check</label>
      <textarea
        id="slop"
        value={text}
        maxLength={MAX_CHARS}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste the email, post, memo, or cover letter. It never leaves your browser."
        className="min-h-56 w-full rounded-2xl border-2 border-ink bg-paper p-5 font-mono text-[15px] leading-7 text-ink placeholder:text-ink/40 focus:outline-none focus:ring-4 focus:ring-hot/40"
      />
      <button
        onClick={() => setChecked(text)}
        disabled={!text.trim()}
        className="self-start rounded-full bg-hot px-8 py-3 text-lg font-black uppercase tracking-wide text-paper shadow-[5px_5px_0_var(--color-ink)] transition active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-40"
      >
        Is it giving AI?
      </button>

      {tooShort && <p className="font-semibold">Give it at least {MIN_WORDS} words. Even a robot needs a runway.</p>}

      {result && tier && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 rounded-3xl bg-ink p-6 text-paper sm:p-8">
            <div className="flex items-baseline gap-3">
              <span className="text-7xl font-black text-acid sm:text-8xl">{result.score}</span>
              <span className="text-xl font-bold text-paper/70">/100 slop</span>
            </div>
            <h2 className="text-3xl font-black sm:text-4xl">{tier.headline}</h2>
            <p className="text-lg text-paper/80">{tier.roast}</p>
            <p className="text-sm text-paper/60">
              {result.tells} tells in {result.words} words.
            </p>
            {result.top.length > 0 && (
              <ul className="mt-2 flex flex-wrap gap-2">
                {result.top.map((t) => (
                  <li key={t.label} className="rounded-full bg-hot px-3 py-1 text-sm font-bold">
                    {t.label} ×{t.count}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Highlighted text={checked} violations={result.violations} />

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-lg font-black">Make it famous</legend>
            {ENTRIES.map((e) => (
              <label key={e.id} className="flex items-center gap-2 font-semibold">
                <input type="radio" name="entry" checked={entry === e.id} onChange={() => setEntry(e.id)} className="accent-[var(--color-hot)]" />
                {e.label}
              </label>
            ))}
            <p className="text-sm text-ink/60">Only the score and the tell names go on the card. Your text stays here. Public company writing only, please. Don&apos;t post a person&apos;s private message.</p>
          </fieldset>

          <div className="flex flex-wrap gap-3">
            <a href={`/api/card?${query}&dl=1`} className="rounded-full border-2 border-ink px-5 py-2 font-bold hover:bg-ink hover:text-paper">Download card</a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="rounded-full border-2 border-ink px-5 py-2 font-bold hover:bg-ink hover:text-paper">Share on LinkedIn</a>
            <a href={`https://x.com/intent/post?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="rounded-full border-2 border-ink px-5 py-2 font-bold hover:bg-ink hover:text-paper">Post on X</a>
            <button onClick={() => navigator.clipboard.writeText(`${shareText} ${shareUrl}`)} className="rounded-full border-2 border-ink px-5 py-2 font-bold hover:bg-ink hover:text-paper">Copy link</button>
          </div>

          <Pitch />
        </div>
      )}
    </section>
  );
}
