import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { parseCard, HASHTAGS } from "@/lib/card";
import { tierFor } from "@/lib/score";

const INK = "#111111";
const PAPER = "#fff8ee";
const HOT = "#ff2e88";
const ACID = "#d4ff3a";

const font = readFile(join(process.cwd(), "assets/fonts/ArchivoBlack-Regular.ttf"));

export async function GET(request: Request) {
  const url = new URL(request.url);
  const card = parseCard(url.searchParams);
  if (!card) return new Response("Bad card", { status: 400 });
  const tier = tierFor(card.score);
  const headers: Record<string, string> = { "Cache-Control": "public, max-age=31536000, immutable" };
  if (url.searchParams.get("dl") === "1") headers["Content-Disposition"] = 'attachment; filename="its-giving-ai.png"';

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: INK, color: PAPER, padding: 64 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 34, color: HOT, letterSpacing: -1 }}>{"IT'S GIVING AI"}</div>
            <div style={{ display: "flex", fontSize: 20, color: "#999999", marginTop: 4 }}>slop meter by write-like-a-human</div>
          </div>
          {card.entry && <div style={{ display: "flex", fontSize: 28, fontWeight: 700, color: INK, background: ACID, padding: "8px 20px", borderRadius: 999 }}>{HASHTAGS[card.entry]}</div>}
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 48 }}>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <div style={{ display: "flex", fontSize: 220, color: ACID, lineHeight: 1 }}>{card.score}</div>
            <div style={{ display: "flex", fontSize: 44, fontWeight: 700, color: "#bbbbbb", marginLeft: 12 }}>/100</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingBottom: 24 }}>
            <div style={{ display: "flex", fontSize: 56, lineHeight: 1.05 }}>{tier.headline}</div>
            <div style={{ display: "flex", fontSize: 28, color: "#cccccc", marginTop: 14 }}>{`${card.tells} tells in ${card.words} words`}</div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 12 }}>
            {card.top.map((t) => (
              <div key={t} style={{ display: "flex", fontSize: 28, fontWeight: 700, background: HOT, color: PAPER, padding: "8px 20px", borderRadius: 999 }}>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630, headers, fonts: [{ name: "Archivo Black", data: await font, weight: 400, style: "normal" }] },
  );
}
