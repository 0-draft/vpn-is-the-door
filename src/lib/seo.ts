// Search-result limits and schema.org JSON-LD for every page. Base.astro renders
// what these return; tests/unit/seo.test.ts holds every page to the limits.
import { REVISIONS, revisionsFor } from "../data/revisions";
import type { Lang } from "./paths";

// Display width: a full-width character counts 2, half-width 1 (JA title limit 64 = 32 全角).
export function displayWidth(s: string): number {
  let w = 0;
  for (const ch of s) {
    const cp = ch.codePointAt(0) ?? 0;
    w += cp < 0x100 || (cp >= 0xff61 && cp <= 0xff9f) ? 1 : 2;
  }
  return w;
}

export const LIMITS = {
  en: { title: 60, description: 155 },
  ja: { titleWidth: 64, description: 120 },
} as const;

export function titleFits(lang: Lang, title: string): boolean {
  return lang === "ja" ? displayWidth(title) <= LIMITS.ja.titleWidth : title.length <= LIMITS.en.title;
}

export function descriptionFits(lang: Lang, description: string): boolean {
  return [...description].length <= LIMITS[lang].description;
}

export const PUBLISHED = (REVISIONS.at(-1) as (typeof REVISIONS)[number]).date;

/** Date of the newest revision that touched this locale-free path. */
export function lastModified(path: string): string {
  return revisionsFor(path)[0]?.date ?? PUBLISHED;
}

export const ORG = { "@type": "Organization", name: "0-draft", url: "https://github.com/0-draft" } as const;

type Json = Record<string, unknown>;

export function breadcrumbList(items: { name: string; url: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: it.url })),
  };
}

export function webSite(o: { name: string; alternateName: string; url: string; lang: Lang }): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${o.url}#website`,
    name: o.name,
    alternateName: o.alternateName,
    url: o.url,
    inLanguage: o.lang,
    publisher: ORG,
  };
}

export function article(o: {
  headline: string;
  description: string;
  url: string;
  image: string;
  lang: Lang;
  path: string;
  homeUrl: string;
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: o.headline,
    description: o.description,
    inLanguage: o.lang,
    url: o.url,
    mainEntityOfPage: o.url,
    image: o.image,
    datePublished: PUBLISHED,
    dateModified: lastModified(o.path),
    author: ORG,
    publisher: ORG,
    isPartOf: { "@id": `${o.homeUrl}#website` },
  };
}

export interface DatasetSource {
  title: string;
  url: string;
  date: string;
}

export function dataset(o: {
  lang: Lang;
  url: string;
  name: string;
  description: string;
  variables: string[];
  temporalCoverage: string;
  sources: DatasetSource[];
}): Json {
  const npa = {
    "@type": "Organization",
    name: o.lang === "ja" ? "警察庁" : "National Police Agency",
    url: "https://www.npa.go.jp/",
  };
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: o.name,
    description: o.description,
    url: o.url,
    inLanguage: o.lang,
    creator: ORG,
    temporalCoverage: o.temporalCoverage,
    spatialCoverage: { "@type": "Place", name: o.lang === "ja" ? "日本" : "Japan" },
    variableMeasured: o.variables,
    measurementTechnique:
      o.lang === "ja" ? "警察庁による被害組織へのアンケート調査" : "NPA survey of victim organizations",
    isBasedOn: o.sources.map((s) => ({
      "@type": "CreativeWork",
      name: s.title,
      url: s.url,
      datePublished: s.date,
      publisher: npa,
    })),
  };
}

/** JSON for a <script type="application/ld+json">: `<` escaped so no string can close the tag. */
export function jsonLdText(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
