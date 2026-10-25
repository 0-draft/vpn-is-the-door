import { describe, expect, it } from "vitest";
import { STEP_COUNT, showFor, stepFromHash } from "../../src/lib/steps";

describe("scrolly steps", () => {
  it("accumulate tokens", () => {
    expect(showFor(0)).toBe("");
    expect(showFor(2)).toBe("door");
    expect(showFor(7).split(" ")).toEqual(
      expect.arrayContaining(["door", "in", "bypass", "toKeys", "keys", "toBackup", "wiped", "out", "encrypt"]),
    );
  });

  it("has seven steps and rejects others", () => {
    expect(STEP_COUNT).toBe(7);
    expect(() => showFor(8)).toThrow();
    expect(() => showFor(1.5)).toThrow();
  });

  it("parses #step-n deep links", () => {
    expect(stepFromHash("#step-3")).toBe(3);
    expect(stepFromHash("#step-0")).toBeNull();
    expect(stepFromHash("#step-9")).toBeNull();
    expect(stepFromHash("#fig-2-1")).toBeNull();
  });
});
