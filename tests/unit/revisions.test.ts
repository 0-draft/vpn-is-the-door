import { describe, expect, it } from "vitest";
import { LATEST, REVISIONS, revisionsFor } from "../../src/data/revisions";
import { SITE } from "../../src/i18n/ui";

describe("revision history", () => {
  it("is newest first with consecutive numbers and ordered dates", () => {
    for (let i = 1; i < REVISIONS.length; i++) {
      const newer = REVISIONS[i - 1]!;
      const older = REVISIONS[i]!;
      expect(newer.rev).toBe(older.rev + 1);
      expect(newer.date >= older.date).toBe(true);
    }
    expect(REVISIONS.at(-1)?.rev).toBe(1);
  });

  it("drives the header and footer", () => {
    expect(SITE.revision).toBe(LATEST.rev);
    expect(SITE.updated).toBe(LATEST.date);
  });
});

describe("revisionsFor", () => {
  const all = [
    { rev: 3, date: "2026-12-01", change: { en: "c", ja: "c" }, pages: ["/cases/"] },
    { rev: 2, date: "2026-11-01", change: { en: "b", ja: "b" }, pages: ["/"] },
    { rev: 1, date: "2026-10-25", change: { en: "a", ja: "a" } },
  ];

  it("lists site-wide revisions everywhere and page revisions only on their pages", () => {
    expect(revisionsFor("/", all).map((r) => r.rev)).toEqual([2, 1]);
    expect(revisionsFor("/cases/", all).map((r) => r.rev)).toEqual([3, 1]);
    expect(revisionsFor("/cases", all).map((r) => r.rev)).toEqual([3, 1]);
    expect(revisionsFor("/the-doors/", all).map((r) => r.rev)).toEqual([1]);
  });

  it("only names pages that exist", async () => {
    const { existsSync } = await import("node:fs");
    for (const r of REVISIONS)
      for (const p of r.pages ?? []) {
        const mdx = existsSync(`src/content/chapters/en${p === "/" ? "/index" : p.replace(/\/$/, "")}.mdx`);
        const known = p === "/" || p === "/sources/" || p === "/glossary/" || p.startsWith("/cases/") || mdx;
        expect(known, p).toBe(true);
      }
  });
});
