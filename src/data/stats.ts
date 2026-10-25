// National Police Agency ransomware survey: intrusion routes among victims that
// answered the question (不明・未回答 excluded). Counts are NPA's; percentages
// are derived here so rounding is consistent across the site.
// research/stats.md §1 has the sheet-by-sheet provenance.

export type RouteKey = "vpn" | "rdp" | "mail" | "other";

export interface RouteYear {
  year: number;
  label: { en: string; ja: string };
  n: number;
  counts: Record<RouteKey, number | null>;
  source: string;
}

export const ROUTE_YEARS: RouteYear[] = [
  {
    year: 2021,
    label: { en: "2021", ja: "2021年" },
    n: 76,
    counts: { vpn: 41, rdp: 15, mail: 5, other: 15 },
    source: "npa-r8h1-data",
  },
  {
    year: 2022,
    label: { en: "2022", ja: "2022年" },
    n: 102,
    counts: { vpn: 63, rdp: 19, mail: 9, other: 11 },
    source: "npa-r4",
  },
  {
    year: 2023,
    label: { en: "2023", ja: "2023年" },
    n: 115,
    counts: { vpn: 73, rdp: 21, mail: 6, other: 15 },
    source: "npa-r5",
  },
  {
    year: 2024,
    label: { en: "2024", ja: "2024年" },
    n: 100,
    counts: { vpn: 55, rdp: 31, mail: 2, other: 12 },
    source: "npa-r6-data",
  },
  {
    year: 2025,
    label: { en: "2025", ja: "2025年" },
    n: 92,
    counts: { vpn: 61, rdp: 19, mail: 2, other: 10 },
    source: "npa-r7-data",
  },
];

// 2026 H1 has no email row in NPA's table and only 36 answers; shown separately, never as a trend point.
export const ROUTES_2026H1: RouteYear = {
  year: 2026,
  label: { en: "2026 H1", ja: "2026年上半期" },
  n: 36,
  counts: { vpn: 18, rdp: 9, mail: null, other: 9 },
  source: "npa-r8h1-data",
};

export const FIVE_YEAR = { n: 485, vpn: 293, rdp: 105, mail: 24, other: 63, source: "npa-r8h1-data" } as const;

export const HEADLINE = {
  reports2025: 226,
  reports2026h1: 123,
  sme2025: 143,
  unpatched: { n: 344, yes: 203, years: "2022–2025", source: "npa-r8h1-data" },
  backupFail2025: { n: 99, failed: 79, encrypted: 48, source: "npa-r7-data" },
  cost2025: { n: 89, over10m: 46, source: "npa-r7-data" },
} as const;

export function pct(part: number, whole: number, digits = 1): string {
  if (whole <= 0) throw new Error("whole must be positive");
  return (Math.round((part / whole) * 100 * 10 ** digits) / 10 ** digits).toFixed(digits);
}

export function latest(): RouteYear {
  const y = ROUTE_YEARS.at(-1);
  if (!y) throw new Error("no route data");
  return y;
}

export function routeSum(y: RouteYear): number {
  return Object.values(y.counts).reduce<number>((s, v) => s + (v ?? 0), 0);
}
