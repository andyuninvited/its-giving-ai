import { describe, expect, it } from "vitest";
import { cardQuery, parseCard } from "./card";

const q = (s: string) => new URLSearchParams(s);

describe("parseCard", () => {
  it("round-trips a card", () => {
    const card = { score: 72, words: 140, tells: 9, top: ["delve", "em-dashes", "corporate autopilot"], entry: "hall" as const };
    expect(parseCard(q(cardQuery(card)))).toEqual(card);
  });

  it("rejects missing or out-of-range numbers", () => {
    expect(parseCard(q("s=101&w=10&t=1"))).toBeUndefined();
    expect(parseCard(q("s=-1&w=10&t=1"))).toBeUndefined();
    expect(parseCard(q("s=50&w=abc&t=1"))).toBeUndefined();
    expect(parseCard(q("w=10&t=1"))).toBeUndefined();
  });

  it("drops anything that isn't a known tell label", () => {
    const card = parseCard(q("s=50&w=100&t=3&k=" + encodeURIComponent("<script>|the ceo is a fraud|https://x.com|delve|robust|holistic|seamless")));
    expect(card?.top).toEqual(["delve", "robust", "holistic"]);
  });

  it("ignores unknown entries", () => {
    expect(parseCard(q("s=1&w=30&t=1&e=evil"))?.entry).toBeUndefined();
  });
});
