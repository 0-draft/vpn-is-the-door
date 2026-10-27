import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { CASES } from "../../src/data/cases";
import { revisionsFor } from "../../src/data/revisions";
import { PAGE_SEO, routeDataset } from "../../src/data/seo";
import type { Lang } from "../../src/lib/paths";
import {
  breadcrumbList,
  descriptionFits,
  displayWidth,
  jsonLdText,
  LIMITS,
  lastModified,
  PUBLISHED,
  titleFits,
} from "../../src/lib/seo";

const LANGS: Lang[] = ["en", "ja"];
const CH = "src/content/chapters";

// Frontmatter values are YAML double-quoted strings or plain scalars.
function front(text: string, key: string): string | undefined {
  const v = new RegExp(`^${key}:\\s*(.+)$`, "m").exec(text)?.[1]?.trim();
  return v?.startsWith('"') ? (JSON.parse(v) as string) : v;
}

interface PageMeta {
  page: string;
  lang: Lang;
  title: string | undefined;
  description: string | undefined;
}

const pages: PageMeta[] = [
  ...Object.entries(PAGE_SEO).flatMap(([path, m]) =>
    LANGS.map((lang) => ({ page: `${lang}${path}`, lang, title: m[lang].title, description: m[lang].description })),
  ),
  ...LANGS.flatMap((lang) =>
    readdirSync(`${CH}/${lang}`)
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => {
        const t = readFileSync(`${CH}/${lang}/${f}`, "utf8");
        return { page: `${lang}/${f}`, lang, title: front(t, "seoTitle"), description: front(t, "description") };
      }),
  ),
  ...CASES.flatMap((c) =>
    LANGS.map((lang) => ({
      page: `${lang}/cases/${c.slug}`,
      lang,
      title: c.seoTitle[lang],
      description: c.seoDescription[lang],
    })),
  ),
];

describe("search titles and descriptions", () => {
  it("cover every page in both languages", () => {
    expect(pages.length).toBe(2 * (3 + readdirSync(`${CH}/en`).length + CASES.length));
  });

  for (const p of pages) {
    it(`${p.page} fits the limits`, () => {
      expect(p.title, "title").toBeTruthy();
      expect(p.description, "description").toBeTruthy();
      const t = p.title as string;
      const d = p.description as string;
      expect(titleFits(p.lang, t), `title too long (${p.lang === "ja" ? displayWidth(t) : t.length}): ${t}`).toBe(true);
      expect(descriptionFits(p.lang, d), `description too long (${[...d].length}): ${d}`).toBe(true);
    });
  }
});

describe("case titles and H1s keep to the organization's wording", () => {
  for (const c of CASES) {
    const lines = LANGS.flatMap((l) => [c.seoTitle[l], c.h1[l]]);
    it(`${c.slug}: says VPN only when the organization did`, () => {
      if (c.opening !== "vpn") for (const s of lines) expect(s, s).not.toMatch(/VPN/i);
    });
    it(`${c.slug}: says ransomware only for ransomware`, () => {
      if (c.kind === "not-ransomware") for (const s of lines) expect(s, s).not.toMatch(/ransom|ランサム/i);
    });
  }

  it("the rule has cases to bite on", () => {
    expect(CASES.some((c) => c.opening !== "vpn")).toBe(true);
    expect(CASES.some((c) => c.kind === "not-ransomware")).toBe(true);
  });
});

describe("helpers", () => {
  it("counts full-width characters double", () => {
    expect(displayWidth("VPN")).toBe(3);
    expect(displayWidth("扉はVPNだった")).toBe(13);
    expect(titleFits("ja", "あ".repeat(LIMITS.ja.titleWidth / 2))).toBe(true);
    expect(titleFits("ja", "あ".repeat(LIMITS.ja.titleWidth / 2 + 1))).toBe(false);
    expect(titleFits("en", "x".repeat(LIMITS.en.title + 1))).toBe(false);
  });

  it("escapes < so a value cannot close the script element", () => {
    const text = jsonLdText({ name: "</script><b>" });
    expect(text).not.toContain("<");
    expect(JSON.parse(text)).toEqual({ name: "</script><b>" });
  });

  it("dates a page by its newest revision", () => {
    expect(PUBLISHED).toBe("2026-10-25");
    expect(lastModified("/the-doors/") >= lastModified("/engineering/")).toBe(true);
    const newest = (p: string) =>
      revisionsFor(p)
        .map((r) => r.date)
        .sort()
        .at(-1);
    for (const p of ["/", "/engineering/evidence/", "/the-doors/"]) expect(lastModified(p)).toBe(newest(p));
  });

  it("numbers breadcrumb items from 1", () => {
    const b = breadcrumbList([
      { name: "a", url: "https://x/" },
      { name: "b", url: "https://x/b/" },
    ]);
    expect((b.itemListElement as { position: number }[]).map((i) => i.position)).toEqual([1, 2]);
  });
});

describe("route dataset", () => {
  for (const lang of LANGS) {
    const d = routeDataset(lang, "https://example.org/where-they-came-in/");
    it(`${lang}: is based on NPA documents and carries no license`, () => {
      expect(d["@type"]).toBe("Dataset");
      expect(d).not.toHaveProperty("license");
      const desc = d.description as string;
      expect(desc.length).toBeGreaterThanOrEqual(50);
      expect(desc.length).toBeLessThanOrEqual(5000);
      const based = d.isBasedOn as { url: string }[];
      expect(based.length).toBeGreaterThan(0);
      for (const b of based) expect(b.url).toMatch(/^https:\/\/www\.npa\.go\.jp\//);
      expect(based.some((b) => b.url.endsWith(".xlsx"))).toBe(true);
    });
  }
});
