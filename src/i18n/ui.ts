import { LATEST } from "../data/revisions";
import type { Lang } from "../lib/paths";

export const SITE = {
  revision: LATEST.rev,
  updated: LATEST.date,
  repo: "https://github.com/0-draft/vpn-is-the-door",
} as const;

export const dict = {
  en: {
    "site.title": "The door was the VPN",
    "site.desc":
      "Why VPN appliances are the most common way ransomware gets into Japanese organizations: the statistics, what happens after entry, the products, real cases and what to do.",
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
    "cut.label": "Technical detail",
    "foot.method":
      "Every number on this site links to its source. Minato Precision is a fictional company used to explain; the cases in chapter 4 are real and cited.",
    "foot.noaffil":
      "Independent explainer. Not affiliated with any vendor or with the National Police Agency. No product is recommended.",
    "foot.revised": "Revised",
    "foot.source": "Source on GitHub",
    "foot.license": "Text CC BY 4.0 · code MIT",
    "search.open": "Search",
    "search.label": "Search this report",
    "search.placeholder": "Search chapters, cases, terms",
    "search.results": "Search results",
    "search.hint": "Type a product, a CVE ID, a case or a term.",
    "search.empty": "Nothing in the English pages matches.",
    "search.unavailable": "Search works on the built site only (pnpm build, then pnpm preview).",
    "search.count1": "1 result",
    "search.countN": "{n} results",
    "search.keys": "↑↓ move · ↵ open · esc close",
    "search.close": "Close search",
    "search.kind.summary": "Summary",
    "search.kind.chapter": "Chapter",
    "search.kind.case": "Case",
    "search.kind.glossary": "Glossary",
    "search.kind.sources": "Sources",
    "og.home": "Ransomware entry points in Japan, 2025",
    "og.vpn": "VPN",
    "og.nts": "NTS",
  },
  ja: {
    "site.title": "扉はVPNだった",
    "site.desc":
      "ランサムウェアが日本の組織に入り込む経路で最も多いのは VPN 機器。統計、侵入後に起きること、製品と脆弱性、実際の事例、対策を図で示す。",
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
    "cut.label": "技術者向けの詳細",
    "foot.method":
      "このサイトの数字にはすべて出典を付けている。港精密は説明用の架空の会社。第4章の事例は実在し、出典がある。",
    "foot.noaffil": "独立した解説サイト。いかなるベンダー、警察庁とも関係はない。製品の推奨もしない。",
    "foot.revised": "改訂",
    "foot.source": "GitHub のソース",
    "foot.license": "本文 CC BY 4.0 · コード MIT",
    "search.open": "検索",
    "search.label": "報告書内を検索",
    "search.placeholder": "章・事例・用語を検索",
    "search.results": "検索結果",
    "search.hint": "製品名、CVE 番号、事例、用語で探せる。",
    "search.empty": "日本語のページに一致するものはない。",
    "search.unavailable": "検索はビルド後のサイトでのみ動く（pnpm build のあと pnpm preview）。",
    "search.count1": "1件",
    "search.countN": "{n}件",
    "search.keys": "↑↓ 移動 · ↵ 開く · esc 閉じる",
    "search.close": "検索を閉じる",
    "search.kind.summary": "要旨",
    "search.kind.chapter": "章",
    "search.kind.case": "事例",
    "search.kind.glossary": "用語集",
    "search.kind.sources": "出典",
    "og.home": "2025年 ランサムウェアの侵入経路",
    "og.vpn": "VPN機器",
    "og.nts": "縮尺なし",
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
