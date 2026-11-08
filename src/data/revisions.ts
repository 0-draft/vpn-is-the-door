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
    rev: 6,
    date: "2026-11-08",
    change: {
      en: "Layout made easier to scan. Each page's summary cut to two or three sentences. In chapter 1, the four floor plans drawn per opening became one plan with a note for each opening. In chapter 2, the hospital report tables are laid out by step. In chapter 6, the measure tables became a two-column schedule with the evidence folded. The door schedule and the case index were cut to four columns. Each figure's sources fold into one line.",
      ja: "流し読みしやすい配置に変えた。各ページの要旨を2〜3文に短縮。第1章で開口部ごとに4枚あった平面図を1枚にまとめ、開口部ごとの注記を付けた。第2章の病院の報告書の表を手順ごとに区切った。第6章の対策の表を2列にし、根拠をたたんだ。建具表と事例の一覧を4列に削減。図の出典を1行にたたんだ。",
    },
  },
  {
    rev: 5,
    date: "2026-10-27",
    change: {
      en: "Text cut to the facts on every page (no announcements, figure-building notes or advice outside the what-to-do page); page titles name what each page answers; the report number and per-section scale tags removed.",
      ja: "全ページの本文を事実だけに削った（予告、図の作り方の説明、対策ページ以外での助言を削除）。ページの題名を各ページの内容を示すものに変更。報告書番号と節ごとの縮尺表示を削除。",
    },
  },
  {
    rev: 4,
    date: "2026-10-27",
    change: {
      en: "CVSS scores of the 2026-numbered rows checked against NVD; CVE-2026-15409 now shows 10.0 (CISA-ADP), and score sources corrected for four rows.",
      ja: "2026年番号の行の CVSS を NVD と照合。CVE-2026-15409 に 10.0（CISA-ADP）を記載し、4行の採点元を訂正。",
    },
    pages: ["/the-doors/"],
  },
  {
    rev: 3,
    date: "2026-10-26",
    change: {
      en: "Corrections after a full read against the sources: Kantsu reclassified to its own wording 'connection point with external networks' (9 VPN, 5 undisclosed, 1 other); case facts, hedges and attributions fixed across chapters 1 to 4 and 6; Ryomo now cites its own third report.",
      ja: "出典との全面照合による訂正。関通を自社の表現「外部ネットワークとの接続口」に変更（VPN 9件、種類非公表5件、その他1件）。第1〜4章と第6章で事例の事実、断定の度合い、帰属を修正。両毛システムズは自社の第3報を出典とした。",
    },
    pages: [
      "/",
      "/where-they-came-in/",
      "/after-the-door/",
      "/the-doors/",
      "/cases/",
      "/cases/handa-hospital/",
      "/cases/osaka-general-medical-center/",
      "/cases/nagoya-port/",
      "/cases/okayama-psychiatric/",
      "/cases/kantsu/",
      "/cases/askul/",
      "/cases/asahi/",
      "/cases/anabuki/",
      "/cases/ycc/",
      "/cases/seidensha/",
      "/cases/ryomo-systems/",
      "/cases/colonial-pipeline/",
      "/cases/boeing-distribution/",
      "/cases/cisa-csat/",
      "/cases/mitre/",
      "/what-to-do/",
      "/sources/",
    ],
  },
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
