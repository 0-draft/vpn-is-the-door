// Which OG card a page gets, and what it says. Base.astro and the PNG endpoint
// both go through ogSlug(), so a page's og:image always names a file that exists.
import { CHAPTERS } from "../../data/chapters";
import { chapterLabel, t } from "../../i18n/ui";
import { type Lang, stripBase } from "../../lib/paths";

export interface OgPage {
  slug: string;
  lang: Lang;
  title: string;
  label: string;
  scales: string[];
}

// "/" -> "index", "/ja/" -> "ja/index", "/cases/x/" -> "cases/x", "/404.html" -> "404"
export function ogSlug(pathname: string, base = "/"): string {
  const local = stripBase(pathname, base)
    .replace(/(index)?\.html$/, "")
    .replace(/^\/+|\/+$/g, "");
  if (local === "") return "index";
  if (local === "ja") return "ja/index";
  return local;
}

export function ogImagePath(pathname: string, base = "/"): string {
  const b = base.endsWith("/") ? base : `${base}/`;
  return `${b}og/${ogSlug(pathname, base)}.png`;
}

// Label line above the title: the chapter number (plus the parent page for a
// sub-page) and the drawing scales the page uses.
export function chapterMeta(lang: Lang, chapter: string, parentTitle?: string): { label: string; scales: string[] } {
  if (chapter === "home") return { label: t(lang, "og.home"), scales: ["1:500"] };
  if (chapter === "glossary") return { label: t(lang, "nav.glossary"), scales: [] };
  if (chapter === "sources") return { label: t(lang, "nav.sources"), scales: [] };
  const c = CHAPTERS.find((x) => x.id === chapter);
  if (!c) return { label: t(lang, "og.home"), scales: [] };
  const num = chapterLabel(lang, c.num);
  return { label: parentTitle ? `${num} · ${parentTitle}` : num, scales: [...c.scales] };
}
