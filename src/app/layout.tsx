import type { Metadata } from "next";
import Link from "next/link";
import { REPO_URL, SITE_URL } from "@/lib/card";
import "./globals.css";


export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "It's Giving AI", template: "%s | It's Giving AI" },
  description: "Paste any text and find out how much it's giving AI. Rejection emails, layoff memos, press releases, and your own drafts.",
  openGraph: { images: [{ url: "/api/card?s=88&w=137&t=12&k=delve|em-dashes|let%20me%20be%20clear", width: 1200, height: 630 }] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased">
        <nav className="mx-auto flex max-w-4xl flex-wrap items-center gap-x-6 gap-y-2 px-4 pt-6 font-bold sm:px-6">
          <Link href="/" className="text-xl font-black text-hot">IT&apos;S GIVING AI</Link>
          <Link href="/hall" className="hover:text-hot">Hall of Shame 🫣</Link>
          <Link href="/delvies" className="hover:text-hot">The Delvies 🏆</Link>
          <Link href="/fame" className="hover:text-hot">Human-ish FTW 🤘</Link>
        </nav>
        {children}
        <footer className="mx-auto max-w-4xl px-4 pb-12 text-sm text-ink/60 sm:px-6">
          A tell-density score, not an AI detector. It counts phrases, and humans write these too. Your text is checked in your browser and never sent anywhere. Built by Andy Rosic with{" "}
          <a href={REPO_URL} className="underline">write-like-a-human</a>.
        </footer>
      </body>
    </html>
  );
}
