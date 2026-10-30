import type { Metadata } from "next";
import Link from "next/link";
import { cardQuery, parseCard } from "@/lib/card";
import { tierFor } from "@/lib/score";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const toParams = (sp: Record<string, string | string[] | undefined>): URLSearchParams =>
  new URLSearchParams(Object.entries(sp).flatMap(([k, v]) => (typeof v === "string" ? [[k, v]] : [])));

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const card = parseCard(toParams(await searchParams));
  if (!card) return {};
  const title = `${tierFor(card.score).headline} ${card.score}/100`;
  const image = `/api/card?${cardQuery(card)}`;
  return {
    title,
    description: "Paste any text and find out how much it's giving AI.",
    openGraph: { title, images: [{ url: image, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, images: [image] },
  };
}

export default async function SharedCard({ searchParams }: Props) {
  const card = parseCard(toParams(await searchParams));
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-12 sm:px-6">
      {card ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`/api/card?${cardQuery(card)}`} alt={`${tierFor(card.score).headline} ${card.score} out of 100`} className="w-full rounded-3xl border-2 border-ink" />
      ) : (
        <p className="text-xl font-bold">That card link is broken. The robot ate it.</p>
      )}
      <Link href="/" className="self-start rounded-full bg-hot px-8 py-3 text-lg font-black uppercase text-paper shadow-[5px_5px_0_var(--color-ink)]">
        Check your own writing
      </Link>
    </main>
  );
}
