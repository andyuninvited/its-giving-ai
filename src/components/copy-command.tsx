"use client";

import { useState } from "react";

export function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () =>
    navigator.clipboard.writeText(command).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  return (
    <div className="flex w-full max-w-full items-stretch overflow-hidden rounded-2xl border-2 border-ink bg-ink">
      <code className="flex-1 overflow-x-auto whitespace-nowrap px-4 py-3 font-mono text-sm text-acid sm:text-base">{command}</code>
      <button onClick={copy} className="shrink-0 bg-hot px-4 font-black uppercase text-paper">
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
