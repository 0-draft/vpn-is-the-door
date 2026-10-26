// Revision history, newest first. The header, the footer, the table on
// /sources/ and each page's own history all read from here, so a refresh adds
// one entry and nothing else.
export interface Revision {
  rev: number;
  date: string;
  change: { en: string; ja: string };
  // Locale-free paths this revision changed ("/", "/cases/nagoya-port/").
  // Omit for a site-wide revision, which every page lists.
  pages?: string[];
}

export const REVISIONS: Revision[] = [
  {
    rev: 2,
    date: "2026-10-26",
    change: {
      en: "Home summary scoped to cases with a known entry route; Nagoya port reclassified as 'device type not disclosed' per the association's own wording; one source entry per document; source titles and dates checked against the documents.",
      ja: "冒頭の要約を「侵入経路が判明した事案」に限定。名古屋港を協会自身の表現に合わせて「機器の種類は非公表」に変更。出典を1文書1件に統合し、題名と日付を原文と照合。",
    },
    pages: ["/", "/cases/", "/cases/nagoya-port/", "/sources/"],
  },
  { rev: 1, date: "2026-10-25", change: { en: "First publication", ja: "初版" } },
];

export const LATEST: Revision = REVISIONS[0] as Revision;

/** Revisions that changed this page (site-wide ones included), newest first. */
export function revisionsFor(path: string, all: Revision[] = REVISIONS): Revision[] {
  const p = path.endsWith("/") ? path : `${path}/`;
  return all.filter((r) => !r.pages || r.pages.includes(p));
}
