// Chapter 1 data that src/data/stats.ts does not carry, plus the small amount of
// geometry the chapter's unit blocks need. Counts are NPA's; shares are derived
// with pct() so they round the same way as everywhere else on the site.
import { FIVE_YEAR, HEADLINE, latest, pct, ROUTE_YEARS, type RouteKey, type RouteYear } from "../data/stats";

export type Bi = { en: string; ja: string };

// 侵入経路とされる機器のセキュリティパッチの適用状況 (research/stats.md §1.3).
export interface PatchYear {
  label: Bi;
  n: number;
  unpatched: number;
  source: string;
}

export const PATCH_YEARS: PatchYear[] = [
  { label: { en: "2022", ja: "2022年" }, n: 100, unpatched: 65, source: "npa-r8h1-data" },
  { label: { en: "2023", ja: "2023年" }, n: 86, unpatched: 52, source: "npa-r8h1-data" },
  { label: { en: "2024", ja: "2024年" }, n: 87, unpatched: 46, source: "npa-r8h1-data" },
  { label: { en: "2025", ja: "2025年" }, n: 71, unpatched: 40, source: "npa-r8h1-data" },
];

export const PATCH_2026H1: PatchYear = {
  label: { en: "2026 H1", ja: "2026年上半期" },
  n: 29,
  unpatched: 17,
  source: "npa-r8h1-data",
};

// Victims by organization size (research/stats.md §1.2). 団体等 = associations and other bodies.
export interface SizeYear {
  label: Bi;
  large: number;
  sme: number;
  other: number;
  source: string;
}

export const SIZE_YEARS: SizeYear[] = [
  { label: { en: "2022", ja: "2022年" }, large: 63, sme: 121, other: 46, source: "npa-r8h1-data" },
  { label: { en: "2023", ja: "2023年" }, large: 71, sme: 102, other: 24, source: "npa-r8h1-data" },
  { label: { en: "2024", ja: "2024年" }, large: 61, sme: 140, other: 21, source: "npa-r8h1-data" },
  { label: { en: "2025", ja: "2025年" }, large: 64, sme: 143, other: 19, source: "npa-r7-data" },
];

export const SIZE_2026H1: SizeYear = {
  label: { en: "2026 H1", ja: "2026年上半期" },
  large: 31,
  sme: 79,
  other: 13,
  source: "npa-r8h1-data",
};

export const sizeTotal = (s: SizeYear): number => s.large + s.sme + s.other;

// The four openings, largest first, using the latest full year.
export function openingsBySize(y: RouteYear = latest()): RouteKey[] {
  const keys: RouteKey[] = ["vpn", "rdp", "mail", "other"];
  return keys.sort((a, b) => (y.counts[b] ?? 0) - (y.counts[a] ?? 0));
}

// VPN + remote desktop: the two remote-access openings.
export const remote = (y: RouteYear): number => (y.counts.vpn ?? 0) + (y.counts.rdp ?? 0);

// Unit-block geometry: one square per case, filled row by row.
export const UNIT = 10;
export const UNIT_GAP = 2;

export function unitGrid(count: number, cols: number): { x: number; y: number }[] {
  if (cols <= 0) throw new Error("cols must be positive");
  const step = UNIT + UNIT_GAP;
  return Array.from({ length: count }, (_, i) => ({ x: (i % cols) * step, y: Math.floor(i / cols) * step }));
}

export function unitBox(count: number, cols: number): { w: number; h: number } {
  const step = UNIT + UNIT_GAP;
  const c = Math.min(count, cols);
  const rows = Math.ceil(count / cols);
  return { w: Math.max(c * step - UNIT_GAP, 0), h: Math.max(rows * step - UNIT_GAP, 0) };
}

// Figures quoted in the prose, computed once.
const y = latest();
export const C1 = {
  y,
  n: y.n,
  reports: HEADLINE.reports2025,
  vpn: y.counts.vpn ?? 0,
  rdp: y.counts.rdp ?? 0,
  mail: y.counts.mail ?? 0,
  other: y.counts.other ?? 0,
  vpnPct: pct(y.counts.vpn ?? 0, y.n),
  rdpPct: pct(y.counts.rdp ?? 0, y.n),
  mailPct: pct(y.counts.mail ?? 0, y.n),
  otherPct: pct(y.counts.other ?? 0, y.n),
  remote: remote(y),
  remotePct: pct(remote(y), y.n),
  five: FIVE_YEAR,
  fiveVpnPct: pct(FIVE_YEAR.vpn, FIVE_YEAR.n),
  fiveMailPct: pct(FIVE_YEAR.mail, FIVE_YEAR.n),
  fiveRdpPct: pct(FIVE_YEAR.rdp, FIVE_YEAR.n),
  fiveOtherPct: pct(FIVE_YEAR.other, FIVE_YEAR.n),
  sme: HEADLINE.sme2025,
  smePct: pct(HEADLINE.sme2025, HEADLINE.reports2025),
  unpatched: HEADLINE.unpatched,
  unpatchedPct: pct(HEADLINE.unpatched.yes, HEADLINE.unpatched.n),
  patchedPct: pct(HEADLINE.unpatched.n - HEADLINE.unpatched.yes, HEADLINE.unpatched.n),
  firstYear: ROUTE_YEARS[0]?.year ?? 2021,
} as const;
