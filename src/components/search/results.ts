// Pure parts of the search palette: what kind a page is (indexed as
// data-pagefind-meta by Base.astro), and which results belong to the reader's language.
import type { Lang } from "../../lib/paths";

export const KINDS = ["summary", "chapter", "case", "glossary", "sources"] as const;
export type Kind = (typeof KINDS)[number];

// `chapter` is the Base.astro prop; `local` the path without base and locale.
export function pageKind(chapter: string | undefined, local: string): Kind {
  if (chapter === "home") return "summary";
  if (chapter === "glossary") return "glossary";
  if (chapter === "sources") return "sources";
  if (/^\/cases\/[^/]+\/$/.test(local)) return "case";
  return "chapter";
}

export function isKind(v: unknown): v is Kind {
  return typeof v === "string" && (KINDS as readonly string[]).includes(v);
}

// Pagefind keeps one index per <html lang>, but the palette filters again by URL
// so a page that declared the wrong lang cannot leak into the other language.
export function inLang(url: string, lang: Lang, base: string): boolean {
  const b = base.endsWith("/") ? base : `${base}/`;
  const ja = url.startsWith(`${b}ja/`) || url === `${b}ja`;
  return lang === "ja" ? ja : !ja;
}

export function countLabel(n: number, one: string, many: string): string {
  return n === 1 ? one : many.replace("{n}", String(n));
}
