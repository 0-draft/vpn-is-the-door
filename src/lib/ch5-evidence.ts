import type { Lang } from "./paths";

// Fig. 5-10: what a reboot, a firmware upgrade and a factory reset do to the
// evidence on an appliance. General pattern, not any one product: the hospital
// reports (upgrade wiped the VPN syslog) and the persistence advisories
// (implants survived upgrades and resets) are the sourced anchors.

export const ACTIONS = ["reboot", "upgrade", "reset"] as const;
export type Action = (typeof ACTIONS)[number];

export const DEFAULT_ACTION: Action = "upgrade";

/** kept: still there. lost: gone. risk: may be lost, depends on product and procedure. stays: the intruder's files may survive. */
export type State = "kept" | "lost" | "risk" | "stays";

export type Zone = "ram" | "disk" | "off";

export interface Item {
  id: string;
  zone: Zone;
  /** true for the intruder's own files: their survival is bad news, not evidence kept */
  implant?: boolean;
  label: Record<Lang, string>;
  states: Record<Action, State>;
}

export const ITEMS: Item[] = [
  {
    id: "proc",
    zone: "ram",
    label: { en: "Running processes, connections", ja: "実行中のプロセスと通信" },
    states: { reboot: "lost", upgrade: "lost", reset: "lost" },
  },
  {
    id: "membuf",
    zone: "ram",
    label: { en: "Logs held only in memory", ja: "メモリ上だけのログ" },
    states: { reboot: "lost", upgrade: "lost", reset: "lost" },
  },
  {
    id: "logs",
    zone: "disk",
    label: { en: "Local log files", ja: "本体内のログファイル" },
    states: { reboot: "kept", upgrade: "risk", reset: "lost" },
  },
  {
    id: "crash",
    zone: "disk",
    label: { en: "Crash records", ja: "クラッシュの記録" },
    states: { reboot: "kept", upgrade: "risk", reset: "lost" },
  },
  {
    id: "config",
    zone: "disk",
    label: { en: "Configuration as found", ja: "発見時の設定" },
    states: { reboot: "kept", upgrade: "risk", reset: "lost" },
  },
  {
    id: "implant",
    zone: "disk",
    implant: true,
    label: { en: "Files the intruder planted", ja: "侵入者が置いたファイル" },
    states: { reboot: "stays", upgrade: "stays", reset: "stays" },
  },
  {
    id: "siem",
    zone: "off",
    label: { en: "Logs already sent to a SIEM", ja: "SIEM に送信済みのログ" },
    states: { reboot: "kept", upgrade: "kept", reset: "kept" },
  },
  {
    id: "export",
    zone: "off",
    label: { en: "Exports taken before acting", ja: "作業前に取り出した控え" },
    states: { reboot: "kept", upgrade: "kept", reset: "kept" },
  },
];

export const ACTION_LABEL: Record<Lang, Record<Action, string>> = {
  en: { reboot: "Reboot", upgrade: "Firmware upgrade", reset: "Factory reset" },
  ja: { reboot: "再起動", upgrade: "ファームウェア更新", reset: "初期化" },
};

export const STATE_LABEL: Record<Lang, Record<State, string>> = {
  en: { kept: "kept", lost: "lost", risk: "may be lost", stays: "may survive" },
  ja: { kept: "残る", lost: "消える", risk: "消えうる", stays: "残りうる" },
};

export const ZONE_LABEL: Record<Lang, Record<Zone, string>> = {
  en: { ram: "Memory (RAM)", disk: "Flash / disk", off: "Off the box" },
  ja: { ram: "メモリ（RAM）", disk: "フラッシュ・ディスク", off: "本体の外" },
};

const SEVERITY: Record<State, number> = { kept: 0, risk: 1, lost: 2, stays: 0 };

/** How much evidence an action costs: higher is worse. Implants are not evidence and are not counted. */
export function severity(item: Item, action: Action): number {
  return item.implant ? 0 : SEVERITY[item.states[action]];
}

export function tally(action: Action): { lost: number; risk: number; kept: number; evidence: number } {
  const ev = ITEMS.filter((i) => !i.implant);
  const count = (s: State) => ev.filter((i) => i.states[action] === s).length;
  return { lost: count("lost"), risk: count("risk"), kept: count("kept"), evidence: ev.length };
}

export function summary(lang: Lang, action: Action): string {
  const t = tally(action);
  const a = ACTION_LABEL[lang][action];
  if (lang === "ja") {
    const risk = t.risk > 0 ? `、${t.risk}項目が消えうる` : "";
    return `${a}: 証拠${t.evidence}項目のうち${t.lost}項目が消える${risk}。侵入者のファイルは残りうる。`;
  }
  const risk = t.risk > 0 ? `, ${t.risk} more may be` : "";
  return `${a}: ${t.lost} of ${t.evidence} kinds of evidence are lost${risk}. The intruder's files may survive.`;
}

const HASH_RE = /^#evidence-(reboot|upgrade|reset)$/;

export function actionFromHash(hash: string): Action | null {
  const m = HASH_RE.exec(hash);
  return m ? (m[1] as Action) : null;
}

export function hashFor(action: Action): string {
  return `#evidence-${action}`;
}
