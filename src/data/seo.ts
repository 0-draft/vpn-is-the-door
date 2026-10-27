// <title> and meta description for the pages that are not MDX or cases.json
// (chapters keep theirs in frontmatter, cases in cases.json).
import type { Lang } from "../lib/paths";
import { type DatasetSource, dataset } from "../lib/seo";
import { source } from "./sources";
import { latest, ROUTE_YEARS, ROUTES_2026H1 } from "./stats";

type Meta = Record<Lang, { title: string; description: string }>;

export const PAGE_SEO: Record<"/" | "/glossary/" | "/sources/", Meta> = {
  "/": {
    en: {
      title: "Ransomware entry in Japan: VPN appliances, 61 of 92 cases",
      description:
        "In 2025, 61 of the 92 Japanese ransomware victims that could say how the attacker got in named their VPN appliance. Email accounted for two.",
    },
    ja: {
      title: "ランサムウェアの侵入経路は VPN 機器 92件中61件｜扉はVPNだった",
      description:
        "警察庁の統計で、2025年に侵入経路が判明したランサムウェア被害92件のうち61件は VPN 機器からの侵入だった。不審メールは2件。",
    },
  },
  "/glossary/": {
    en: {
      title: "Glossary: VPN and ransomware terms · The door was the VPN",
      description:
        "The terms this site uses, from SSL-VPN and KEV to lateral movement, each with a one-sentence definition for executives and a note for engineers.",
    },
    ja: {
      title: "用語集 VPN・ランサムウェアの用語｜扉はVPNだった",
      description:
        "このサイトで使う用語の意味。SSL-VPN、KEV、横展開、二重恐喝など。経営層向けの一文の説明と、技術者向けの補足を並べる。五十音順。",
    },
  },
  "/sources/": {
    en: {
      title: "Sources: NPA statistics, incident reports and advisories",
      description:
        "Every document this site cites, with a link and the page or sheet behind each figure: NPA ransomware statistics, investigation reports, CISA advisories.",
    },
    ja: {
      title: "出典一覧 警察庁統計・調査報告書・勧告｜扉はVPNだった",
      description:
        "このサイトが読んだ資料と、数字の照合方法。警察庁のランサムウェア統計、各組織の調査報告書、CISA の勧告など、文書ごとにリンクと該当ページ・シートを示す。",
    },
  },
};

// Dataset markup for /where-they-came-in/: the NPA route counts the page charts.
export function routeDataset(lang: Lang, url: string) {
  const y = latest();
  const h = ROUTES_2026H1;
  const ids = [...new Set([...ROUTE_YEARS.map((r) => r.source), h.source])];
  const sources: DatasetSource[] = ids
    .map((id) => source(id))
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((s) => ({ title: s.title, url: s.url, date: s.date }));
  const c = y.counts;
  const ja = lang === "ja";
  return dataset({
    lang,
    url,
    name: ja
      ? "警察庁に報告されたランサムウェア被害の侵入経路（2021年〜2026年上半期）"
      : "Ransomware infection routes reported to Japan's National Police Agency, 2021 to 2026 H1",
    description: ja
      ? `警察庁のランサムウェア被害組織への調査で、侵入経路の設問に有効な回答があった件数を経路別・年別に集計したもの。不明・未回答は除く。${y.year}年は有効回答${y.n}件のうち VPN 機器${c.vpn}件、リモートデスクトップ${c.rdp}件、不審メールやその添付ファイル${c.mail}件、その他${c.other}件。${h.label.ja}は有効回答${h.n}件で、メールの行はない。件数は警察庁の値で、割合はこのサイトが件数から計算した。`
      : `Japanese ransomware victims that gave a valid answer to the National Police Agency (NPA) survey question on how the intruder got in, counted by route for each year. Unknown and unanswered are excluded. ${y.year}: ${y.n} answers; VPN appliance ${c.vpn}, remote desktop ${c.rdp}, suspicious email or attachments ${c.mail}, other ${c.other}. ${h.label.en}: ${h.n} answers, with no email row. Counts are NPA's; percentages are computed by this site from those counts.`,
    variables: ja
      ? ["VPN 機器", "リモートデスクトップ", "不審メールやその添付ファイル", "その他", "有効回答数"]
      : ["VPN appliance", "Remote desktop", "Suspicious email or attachments", "Other", "Valid answers"],
    // NPA's half-year reports end in June
    temporalCoverage: `${ROUTE_YEARS[0]?.year}/${h.year}-06`,
    sources,
  });
}
