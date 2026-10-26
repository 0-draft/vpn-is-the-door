import { describe, expect, it } from "vitest";
import { STEP_COUNT, showFor, stepFromHash, titlesFromHtml, viewFor } from "../../src/lib/steps";

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

describe("show all steps", () => {
  it("picks the view from the hash, then the motion preference", () => {
    expect(viewFor("#all-steps", false)).toBe("grid");
    expect(viewFor("#step-3", true)).toBe("scroll");
    expect(viewFor("", true)).toBe("grid");
    expect(viewFor("", false)).toBe("scroll");
    expect(viewFor("#fig-2-1", false)).toBe("scroll");
  });

  it("reads step titles from the rendered list", () => {
    const html = `<ol><li class="step" data-step="1" id="step-1" data-astro-cid-x><div class="step-card"><h3 class="step-h" data-astro-cid-x><span class="step-n num" aria-hidden="true" data-astro-cid-x>1</span>Monday, 07:40</h3><p>Text with <a href="#">a link</a></p></div></li>
<li class="step" data-step="2" id="step-2"><div><h3 class="step-h"><span class="step-n num" aria-hidden="true">2</span>Keys &amp; doors</h3></div></li></ol>`;
    expect(titlesFromHtml(html)).toEqual({ 1: "Monday, 07:40", 2: "Keys & doors" });
  });
});
