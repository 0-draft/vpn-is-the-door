import type { Lang } from "../lib/paths";

export const SITE = {
  report: "VITD-2026",
  revision: 1,
  updated: "2026-10-25",
  repo: "https://github.com/0-draft/vpn-is-the-door",
} as const;

export const dict = {
  en: {
    "site.title": "The door was the VPN",
    "site.desc":
      "Why VPN appliances are the most common way ransomware gets into Japanese organizations, drawn as a break-in report: the statistics, what happens after entry, the products, real cases and what to do.",
    "site.report": "Report",
    "site.rev": "Rev.",
    "nav.skip": "Skip to content",
    "nav.chapters": "Chapters",
    "nav.home": "Summary",
    "nav.sources": "Sources and method",
    "nav.glossary": "Glossary",
    "nav.lang": "日本語",
    "nav.langLabel": "日本語で読む (Switch to Japanese)",
    "nav.theme": "Theme",
    "nav.themeAuto": "Auto",
    "nav.themeLight": "Light",
    "nav.themeDark": "Dark",
    "nav.motion": "Pause motion",
    "nav.prev": "Previous",
    "nav.next": "Next",
    chapter: "Chapter",
    summary: "Summary",
    fig: "Fig.",
    source: "Source",
    data: "Data",
    composite: "Composite scenario, fictional company",
    nts: "NTS (not to scale)",
    "cut.label": "Engineers from here: section A–A",
    "cut.note": "Executives can stop here. Everything above is the whole argument.",
    "foot.method":
      "Every number on this site links to its source. Minato Precision is a fictional company used to explain; the cases in chapter 4 are real and cited.",
    "foot.noaffil":
      "Independent explainer. Not affiliated with any vendor or with the National Police Agency. No product is recommended.",
    "foot.revised": "Revised",
    "foot.source": "Source on GitHub",
    "foot.license": "Text CC BY 4.0 · code MIT",
  },
  ja: {
    "site.title": "扉はVPNだった",
    "site.desc":
      "ランサムウェアが日本の組織に入り込む経路で最も多いのは VPN 機器。その理由を侵入事案の調査報告書の形で図解する。統計、侵入後に起きること、製品と脆弱性、実際の事例、対策まで。",
    "site.report": "報告書",
    "site.rev": "改訂",
    "nav.skip": "本文へ移動",
    "nav.chapters": "章",
    "nav.home": "要旨",
    "nav.sources": "出典と方法",
    "nav.glossary": "用語集",
    "nav.lang": "English",
    "nav.langLabel": "Read in English (英語に切り替え)",
    "nav.theme": "表示",
    "nav.themeAuto": "自動",
    "nav.themeLight": "明",
    "nav.themeDark": "暗",
    "nav.motion": "動きを止める",
    "nav.prev": "前へ",
    "nav.next": "次へ",
    chapter: "第",
    summary: "要旨",
    fig: "図",
    source: "出典",
    data: "データ",
    composite: "複合事例（実在しない会社）",
    nts: "縮尺なし",
    "cut.label": "ここから技術者向け: 断面 A–A",
    "cut.note": "経営層の方はここまでで十分。ここまでに論点はすべて出ている。",
    "foot.method":
      "このサイトの数字にはすべて出典を付けている。港精密は説明用の架空の会社。第4章の事例は実在し、出典がある。",
    "foot.noaffil": "独立した解説サイト。いかなるベンダー、警察庁とも関係はない。製品の推奨もしない。",
    "foot.revised": "改訂",
    "foot.source": "GitHub のソース",
    "foot.license": "本文 CC BY 4.0 · コード MIT",
  },
} as const;

export type Key = keyof (typeof dict)["en"];

export function t(lang: Lang, key: Key): string {
  return dict[lang][key];
}

export function chapterLabel(lang: Lang, num: number): string {
  return lang === "ja" ? `第${num}章` : `Chapter ${num}`;
}

export function figLabel(lang: Lang, id: string): string {
  return lang === "ja" ? `図 ${id}` : `Fig. ${id}`;
}
