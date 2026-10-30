import { Checker } from "@/components/checker";

export default function Home() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-10 px-4 py-12 sm:px-6">
      <header className="flex flex-col gap-4">
        <h1 className="text-5xl font-black leading-none tracking-tight sm:text-7xl">
          Is it giving <span className="text-hot">AI</span>?
        </h1>
        <p className="max-w-2xl text-xl">
          Paste the rejection email. The layoff memo. The press release. Your own cover letter, if you&apos;re brave. The slop meter counts every tell and tells you how much of it a human actually wrote.
        </p>
      </header>
      <Checker />
    </main>
  );
}
