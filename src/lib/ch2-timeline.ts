// Fig. 2-2: how fast the route runs, from research/mechanics.md §2.3.
// The time axis is piecewise linear: the first four hours get most of the
// length, then a break, then four hours to four days compressed. A log axis
// would be more compact but executives misread it; a single linear axis would
// crush everything Akira does into the first few pixels.

import type { Lang } from "./paths";

export const SPLIT_H = 4;
export const END_H = 96;
/** Share of the axis length used by 0–SPLIT_H. */
export const A_FRAC = 0.55;
/** Share left empty for the break mark. */
export const GAP_FRAC = 0.03;

/** Position along an axis of `len` units for `h` hours. */
export function axisPos(h: number, len: number): number {
  if (!Number.isFinite(h) || h < 0 || h > END_H) throw new Error(`hours out of range: ${h}`);
  if (h <= SPLIT_H) return (h / SPLIT_H) * A_FRAC * len;
  const b0 = A_FRAC + GAP_FRAC;
  return (b0 + ((h - SPLIT_H) / (END_H - SPLIT_H)) * (1 - b0)) * len;
}

/** Where the break mark sits, as [start, end] along the axis. */
export function breakSpan(len: number): [number, number] {
  return [A_FRAC * len, (A_FRAC + GAP_FRAC) * len];
}

export interface Tick {
  h: number;
  label: Record<Lang, string>;
}

export const TICKS: Tick[] = [
  { h: 0, label: { en: "0", ja: "0" } },
  { h: 1, label: { en: "1 h", ja: "1時間" } },
  { h: 2, label: { en: "2 h", ja: "2時間" } },
  { h: 3, label: { en: "3 h", ja: "3時間" } },
  { h: 4, label: { en: "4 h", ja: "4時間" } },
  { h: 24, label: { en: "1 day", ja: "1日" } },
  { h: 48, label: { en: "2 days", ja: "2日" } },
  { h: 72, label: { en: "3 days", ja: "3日" } },
  { h: 96, label: { en: "4 days", ja: "4日" } },
];

export type LaneId = "akira" | "sophos" | "handa";

export interface Lane {
  id: LaneId;
  title: Record<Lang, string>;
  /** What hour 0 means for this lane. */
  origin: Record<Lang, string>;
  source: string;
}

export const LANES: Lane[] = [
  {
    id: "akira",
    title: {
      en: "Akira via SonicWall SSL-VPN (Arctic Wolf, 2025)",
      ja: "Akira、SonicWall SSL-VPN 経由（Arctic Wolf、2025年）",
    },
    origin: { en: "0 = VPN login", ja: "0 = VPN へのログイン" },
    source: "arcticwolf-akira-2025",
  },
  {
    id: "sophos",
    title: { en: "Sophos incident cases, medians", ja: "Sophos の対応事例、中央値" },
    origin: { en: "0 = start of the attack", ja: "0 = 攻撃の開始" },
    source: "sophos-aar-2026",
  },
  {
    id: "handa",
    title: { en: "Handa Hospital, 2021 (expert panel report)", ja: "半田病院、2021年（有識者会議報告書）" },
    origin: {
      en: "0 = 23:57, first recorded remote desktop activity",
      ja: "0 = 23:57、記録に残る最初のリモートデスクトップ操作",
    },
    source: "handa-report-main",
  },
];

export type MarkKind = "point" | "range" | "prior";

export interface Mark {
  id: string;
  lane: LaneId;
  h: number;
  /** "range" draws a bar from 0 to h; "prior" is an earlier year, drawn hollow. */
  kind: MarkKind;
  text: Record<Lang, string[]>;
}

export const MARKS: Mark[] = [
  {
    id: "scan",
    lane: "akira",
    h: 5 / 60,
    kind: "point",
    text: { en: ["5 min", "internal scanning starts"], ja: ["5分", "社内の探索が始まる"] },
  },
  {
    id: "fastest",
    lane: "akira",
    h: 55 / 60,
    kind: "point",
    text: { en: ["55 min", "ransomware, fastest cases"], ja: ["55分", "最も早い例で暗号化へ"] },
  },
  {
    id: "under4",
    lane: "akira",
    h: 4,
    kind: "range",
    text: { en: ["under 4 h", "encryption, almost all cases"], ja: ["4時間未満", "ほぼ全件で暗号化まで"] },
  },
  {
    id: "ad",
    lane: "sophos",
    h: 3.4,
    kind: "point",
    text: {
      en: ["3.40 h", "first attempt on", "Active Directory"],
      ja: ["3.40時間", "Active Directory への", "最初の試み"],
    },
  },
  {
    id: "ad-2024",
    lane: "sophos",
    h: 11,
    kind: "prior",
    text: { en: ["11 h in 2024 data"], ja: ["2024年のデータでは11時間"] },
  },
  {
    id: "exfil-2024",
    lane: "sophos",
    h: 72.98,
    kind: "prior",
    text: { en: [], ja: [] },
  },
  {
    id: "exfil",
    lane: "sophos",
    h: 78.83,
    kind: "point",
    text: {
      en: ["78.83 h (2025)", "72.98 h (2024)", "data exfiltration"],
      ja: ["78.83時間（2025年）", "72.98時間（2024年）", "データの持ち出し"],
    },
  },
  {
    id: "note",
    lane: "handa",
    h: clockSpanHours("23:57", "03:04"),
    kind: "range",
    text: { en: ["03:04", "ransom note opened"], ja: ["03:04", "身代金要求文書を開く"] },
  },
];

/** 23:57 on 10-30 to 03:04 on 10-31 (半田病院 本編 p.21). */
export function clockSpanHours(from: string, to: string): number {
  const m = (s: string) => {
    const r = /^(\d{2}):(\d{2})$/.exec(s);
    if (!r) throw new Error(`bad clock time: ${s}`);
    return Number(r[1]) * 60 + Number(r[2]);
  };
  let d = m(to) - m(from);
  if (d < 0) d += 24 * 60;
  return d / 60;
}

/** Off-hours share of ransomware deployments, Sophos AAR 2026 (2025 data). */
export const OFF_HOURS_PCT = 88.1;

/**
 * Push label positions down so each label starts below the previous one ends.
 * `heights[i]` is the space label i needs. Order is kept. Used for the
 * vertical (phone) layout where every mark gets its own row.
 */
export function spread(ys: number[], heights: number[]): number[] {
  if (ys.length !== heights.length) throw new Error("ys and heights differ in length");
  const out: number[] = [];
  for (const [i, y] of ys.entries()) {
    const prev = out[i - 1];
    out.push(prev === undefined ? y : Math.max(y, prev + (heights[i - 1] ?? 0)));
  }
  return out;
}

/** Marks in time order, for the vertical layout. */
export function marksByTime(): Mark[] {
  return [...MARKS].sort((a, b) => a.h - b.h || a.id.localeCompare(b.id));
}
