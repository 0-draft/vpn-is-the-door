import { describe, expect, it } from "vitest";
import { GLOSSARY, sortedTerms } from "../../src/data/glossary";
import { SOURCES } from "../../src/data/sources";

const JA = /[぀-ヿ㐀-鿿＀-￯]/;

describe("glossary", () => {
  it("has unique ids", () => {
    const ids = GLOSSARY.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("keeps Japanese out of English fields", () => {
    for (const t of GLOSSARY) {
      for (const f of [t.term.en, t.short.en, t.long.en]) expect(JA.test(f), `${t.id}: ${f}`).toBe(false);
    }
  });

  it("has both languages for every field", () => {
    for (const t of GLOSSARY) {
      for (const f of [t.term, t.short, t.long]) {
        expect(f.en.trim(), t.id).not.toBe("");
        expect(f.ja.trim(), t.id).not.toBe("");
      }
      expect(JA.test(t.short.ja) || JA.test(t.long.ja), `${t.id} ja`).toBe(true);
    }
  });

  it("covers the terms the chapters rely on", () => {
    const ids = new Set(GLOSSARY.map((t) => t.id));
    for (const id of [
      "vpn-appliance",
      "session-token",
      "credential",
      "integrity-checker",
      "end-of-life",
      "immutable-backup",
      "ioc",
      "kev",
    ])
      expect(ids.has(id), id).toBe(true);
  });

  it("cites only known sources", () => {
    const known = new Set(SOURCES.map((s) => s.id));
    for (const t of GLOSSARY) for (const s of t.sources ?? []) expect(known.has(s), `${t.id}: ${s}`).toBe(true);
  });

  it("sorts alphabetically in English and by reading in Japanese", () => {
    const en = sortedTerms("en").map((t) => t.term.en);
    expect(en[0]).toBe("Active Directory (AD)");
    expect(en.at(-1)).toBe("ZTNA (zero trust network access)");
    const ja = sortedTerms("ja").map((t) => t.kana);
    expect(ja[0]).toBe("あーるでぃーぴー");
    expect(ja.at(-1)).toBe("らんさむうぇあ");
    expect(ja).toEqual([...ja].sort((a, b) => a.localeCompare(b, "ja")));
  });
});
