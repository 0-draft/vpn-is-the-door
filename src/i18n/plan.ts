import type { Lang } from "../lib/paths";
import type { OpeningId, RoomId } from "../lib/plan";

export const ROOM_LABEL: Record<RoomId, Record<Lang, string>> = {
  office: { en: "Office", ja: "事務室" },
  it: { en: "IT room", ja: "情報システム室" },
  server: { en: "Server room", ja: "サーバ室" },
  backup: { en: "Backups", ja: "バックアップ" },
  corridor: { en: "Corridor", ja: "廊下" },
  meeting: { en: "Meeting room", ja: "会議室" },
  reception: { en: "Reception", ja: "受付" },
  store: { en: "Storeroom", ja: "倉庫" },
};

// The tall (phone) plan has narrower rooms.
export const ROOM_LABEL_TALL: Partial<Record<RoomId, Record<Lang, string>>> = {
  meeting: { en: "Meeting", ja: "会議室" },
  server: { en: "Servers", ja: "サーバ室" },
};

export const FIXTURE_LABEL = {
  keys: { en: ["Key safe", "(AD)"], ja: ["鍵保管庫", "(AD)"] },
  fileserver: { en: ["File server"], ja: ["ファイルサーバ"] },
  nas: { en: ["NAS"], ja: ["NAS"] },
  pcs: { en: ["Staff PCs"], ja: ["社員の PC"] },
} as const;

// Two lines: the drawing's name for the opening, then what it stands for.
export const OPENING_LABEL: Record<OpeningId, Record<Lang, [string, string]>> = {
  vpn: { en: ["VPN door", "VPN appliance"], ja: ["VPN の扉", "VPN 機器"] },
  rdp: { en: ["Window", "Remote desktop"], ja: ["窓", "リモートデスクトップ"] },
  mail: { en: ["Main entrance", "Email"], ja: ["正面玄関", "メール"] },
  other: { en: ["Loading door", "Other routes"], ja: ["搬入口", "その他"] },
};

export const TALLY_NAME: Record<OpeningId, Record<Lang, string[]>> = {
  vpn: { en: ["VPN appliance"], ja: ["VPN 機器"] },
  rdp: { en: ["Remote desktop"], ja: ["リモート", "デスクトップ"] },
  mail: { en: ["Email"], ja: ["不審メール"] },
  other: { en: ["Other"], ja: ["その他"] },
};

export const PLAN_NOTE = {
  bypass: { en: "bypasses reception", ja: "受付を通らない" },
  wiped: { en: "wiped", ja: "削除" },
  data: { en: "data", ja: "データ" },
  mfa: { en: "MFA not reached", ja: "MFA: 素通り" },
} as const;

export function countLabel(lang: Lang, count: number, pct: string): string {
  return lang === "ja" ? `${count}件 · ${pct}%` : `${count} · ${pct}%`;
}

// Chapter 2 scrolly: the switch between the scroll version and the step grid.
export const ROUTE_VIEW = {
  showAll: { en: "Show all steps", ja: "すべての段階を見る" },
  showScroll: { en: "Back to the scrolling plan", ja: "スクロールの平面図に戻る" },
  gridCaption: { en: "all seven steps", ja: "7つの段階の一覧" },
} as const;
