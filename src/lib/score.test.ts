import { describe, expect, it } from "vitest";
import { scoreText, tierFor, tellLabel } from "./score";
import { SAMPLES } from "./samples";

const sample = (id: string): string => SAMPLES.find((s) => s.id === id)?.text ?? "";

describe("scoreText", () => {
  it("scores plain human writing at zero", () => {
    const r = scoreText("The release moves from Thursday to Tuesday. We found a crash on older Android phones and the fix needs two days of testing. Until it ships, please only merge changes that are part of the fix. Everything else is on track.");
    expect(r.tells).toBe(0);
    expect(r.score).toBe(0);
    expect(tierFor(r.score).headline).toBe("It's giving human.");
  });

  it("catches the same six errors write-like-a-human finds in the team update", () => {
    const r = scoreText(sample("update"));
    const errors = r.violations.filter((v) => v.severity === "error").map((v) => v.rule).sort();
    expect(errors).toEqual(["ai-vocabulary", "ai-vocabulary", "ai-vocabulary", "em-dash", "meta-commentary", "throat-clearing"]);
  });

  it("puts every sample in an AI tier", () => {
    for (const s of SAMPLES) expect(scoreText(s.text).score).toBeGreaterThanOrEqual(45);
  });

  it("flags rejection boilerplate with the site rules", () => {
    const labels = scoreText(sample("rejection")).top.map((t) => t.label);
    expect(labels).toContain("corporate autopilot");
    expect(labels.some((l) => l === "hope this finds you well" || l === "throat-clearing")).toBe(true);
  });

  it("counts a phrase two rules both catch only once", () => {
    const r = scoreText("I hope this message finds you well. " + "We shipped the fix on Tuesday and the crash rate went back to normal. ".repeat(3));
    expect(r.tells).toBe(1);
  });

  it("caps the score at 100", () => {
    expect(scoreText("delve delve delve delve delve delve delve delve delve delve").score).toBe(100);
  });

  it("never puts user text in a label for regex rules", () => {
    const r = scoreText("This is not about the money, but about the secret plan Bob shared. " + "word ".repeat(30));
    for (const v of r.violations) {
      const label = tellLabel(v);
      expect(label).not.toMatch(/bob|secret|money/i);
    }
  });

  it("gives match indexes that point at the matched text", () => {
    const text = sample("update");
    for (const v of scoreText(text).violations) expect(text.slice(v.index, v.index + v.match.length)).toBe(v.match);
  });
});
