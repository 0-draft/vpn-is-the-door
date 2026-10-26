// "Close the door" (chapter 6, design §8.2): which controls stop the intruder's
// route, and where. Each control cuts the route only at the station where it
// really works; everything else passes through. Pure logic, no DOM.

import type { Lang } from "./paths";

export type Entry = "password" | "preauth" | "zeroday";
export const ENTRIES: readonly Entry[] = ["password", "preauth", "zeroday"];

export type PatchDays = 0 | 3 | 14 | 60; // 0 = no patch deadline
export const PATCH_DAYS: readonly Exclude<PatchDays, 0>[] = [3, 14, 60];

export interface Controls {
  patch: PatchDays;
  mfa: boolean;
  unused: boolean;
  tiered: boolean;
  backup: boolean;
}

export type ControlId = keyof Controls;
export const CONTROL_IDS: readonly ControlId[] = ["patch", "mfa", "unused", "tiered", "backup"];

export const NO_CONTROLS: Controls = { patch: 0, mfa: false, unused: false, tiered: false, backup: false };

// Scenario: the pre-auth flaw is first exploited this many days after the fix
// is published. Mandiant's average time-to-exploit for 2023 was five days.
export const EXPLOIT_DAY = 5;

export type Station = "door" | "keys" | "backups";
export const STATIONS: readonly Station[] = ["door", "keys", "backups"];

export type NoteId =
  | "patch.cut"
  | "patch.late"
  | "patch.zeroday"
  | "patch.password"
  | "mfa.cut"
  | "mfa.preauth"
  | "unused.cut"
  | "unused.preauth"
  | "tiered.cut"
  | "tiered.moot"
  | "backup.cut"
  | "backup.moot";

export interface Outcome {
  /** First station where the route stops, or null if it runs to the end. */
  cutAt: Station | null;
  /** Every station where a control actually stopped something (one green bar each). */
  cuts: Station[];
  /** What the intruder gets to. backups = the backups are wiped. */
  reached: { door: boolean; keys: boolean; backups: boolean; exfil: boolean; encrypt: boolean };
  /** How much data leaves: everything reachable, only what the first account can read, or none. */
  exfil: "all" | "limited" | "none";
  /** Encryption happened but an untouched backup makes recovery possible. */
  recoverable: boolean;
  /** One note per switched-on control, in route order. */
  notes: NoteId[];
}

export function evaluate(entry: Entry, c: Controls): Outcome {
  const notes: NoteId[] = [];
  let doorCut = false;

  if (c.patch) {
    if (entry === "password") notes.push("patch.password");
    else if (entry === "zeroday") notes.push("patch.zeroday");
    else if (c.patch < EXPLOIT_DAY) {
      doorCut = true;
      notes.push("patch.cut");
    } else notes.push("patch.late");
  }
  if (c.mfa) {
    if (entry === "password") {
      doorCut = true;
      notes.push("mfa.cut");
    } else notes.push("mfa.preauth");
  }
  if (c.unused) {
    if (entry === "password") {
      doorCut = true;
      notes.push("unused.cut");
    } else notes.push("unused.preauth");
  }

  const door = !doorCut;
  const keysCut = door && c.tiered;
  const keys = door && !c.tiered;
  if (c.tiered) notes.push(door ? "tiered.cut" : "tiered.moot");

  const backupCut = keys && c.backup;
  const backups = keys && !c.backup;
  if (c.backup) notes.push(keys ? "backup.cut" : "backup.moot");

  const cuts: Station[] = [];
  if (doorCut) cuts.push("door");
  if (keysCut) cuts.push("keys");
  if (backupCut) cuts.push("backups");

  const exfil = !door ? "none" : keys ? "all" : "limited";
  return {
    cutAt: cuts[0] ?? null,
    cuts,
    reached: { door, keys, backups, exfil: door, encrypt: keys },
    exfil,
    recoverable: keys && c.backup,
    notes,
  };
}

// ---- plan state -------------------------------------------------------------

export type Segment = "in" | "toKeys" | "toBackup" | "out";

export interface PlanState {
  /** FloorPlan data-show tokens. The full route is always drawn. */
  show: string;
  /** Route segments drawn grey: the intruder never walks them. */
  grey: Segment[];
  /** A dotted exfil line straight from the corridor (only what the first account reached). */
  limitedExfil: boolean;
}

export function planState(o: Outcome): PlanState {
  const show = ["door", "in", "toKeys", "toBackup", "out"];
  if (o.reached.door) show.push("bypass");
  if (o.reached.keys) show.push("keys");
  if (o.reached.backups) show.push("wiped");
  if (o.reached.encrypt) show.push("encrypt");
  const grey: Segment[] = !o.reached.door
    ? ["in", "toKeys", "toBackup", "out"]
    : !o.reached.keys
      ? ["toBackup", "out"]
      : [];
  return { show: show.join(" "), grey, limitedExfil: o.exfil === "limited" };
}

// ---- URL state --------------------------------------------------------------

export interface State {
  entry: Entry;
  controls: Controls;
}

const on = (v: string | null) => v === "1";

export function fromQuery(search: string): State {
  const q = new URLSearchParams(search);
  const e = q.get("entry");
  const entry = (ENTRIES as readonly string[]).includes(e ?? "") ? (e as Entry) : "password";
  const p = Number(q.get("patch"));
  const patch = (PATCH_DAYS as readonly number[]).includes(p) ? (p as PatchDays) : 0;
  return {
    entry,
    controls: {
      patch,
      mfa: on(q.get("mfa")),
      unused: on(q.get("unused")),
      tiered: on(q.get("tiered")),
      backup: on(q.get("backup")),
    },
  };
}

export function toQuery(s: State): string {
  const q = new URLSearchParams();
  q.set("entry", s.entry);
  if (s.controls.patch) q.set("patch", String(s.controls.patch));
  for (const k of ["mfa", "unused", "tiered", "backup"] as const) if (s.controls[k]) q.set(k, "1");
  return `?${q.toString()}`;
}

// ---- text -------------------------------------------------------------------

type T = Record<Lang, string>;

export const NOTE_TEXT: Record<NoteId, T> = {
  "patch.cut": {
    en: "Patched within {d} days. Exploitation in this scenario starts on day 5, so the flaw is gone first.",
    ja: "{d}日以内に修正した。この想定では悪用が5日目に始まるので、先に穴が塞がる。",
  },
  "patch.late": {
    en: "Exploitation starts on day 5. A {d}-day deadline leaves the door open in the meantime.",
    ja: "悪用は5日目に始まる。期限が{d}日では、その間扉は開いたままになる。",
  },
  "patch.zeroday": {
    en: "No fix existed when exploitation began. No patch deadline closes a zero-day.",
    ja: "悪用が始まった時点で修正版はなかった。ゼロデイはどの期限でも防げない。",
  },
  "patch.password": {
    en: "The password was stolen before the patch. It still works after the patch.",
    ja: "パッチ前に盗まれた認証情報は、パッチ後も有効。",
  },
  "mfa.cut": {
    en: "The password alone no longer opens the door. A stolen session token still would.",
    ja: "盗まれたパスワードだけでは扉は開かない。盗まれたセッション情報なら通る。",
  },
  "mfa.preauth": {
    en: "A pre-auth flaw is reached before the login step. MFA is never asked.",
    ja: "認証前の欠陥は錠を通らない。多要素認証は一度も求められない。",
  },
  "unused.cut": {
    en: "The leaked password belonged to an account nobody used. Once deleted, it opens nothing.",
    ja: "漏れたのは使われていないアカウントのパスワードだった。削除すれば何も開かない。",
  },
  "unused.preauth": {
    en: "This flaw needs no account at all.",
    ja: "この欠陥の悪用にアカウントは要らない。",
  },
  "tiered.cut": {
    en: "The account they hold cannot administer servers, so the key safe stays shut. Files that account can read still leave.",
    ja: "奪ったアカウントにはサーバの管理権限がなく、鍵保管庫は開かない。そのアカウントで読めるファイルは持ち出される。",
  },
  "tiered.moot": {
    en: "Not tested: the route stopped at the door.",
    ja: "試されない。経路は扉で止まっている。",
  },
  "backup.cut": {
    en: "The offline copy survives, so the encryption can be undone. The leak cannot.",
    ja: "暗号化からは戻れる。流出は戻らない。",
  },
  "backup.moot": {
    en: "Not tested: the route stopped before the backups.",
    ja: "試されない。経路はバックアップより手前で止まっている。",
  },
};

export const NOTE_STATION: Record<NoteId, Station> = {
  "patch.cut": "door",
  "patch.late": "door",
  "patch.zeroday": "door",
  "patch.password": "door",
  "mfa.cut": "door",
  "mfa.preauth": "door",
  "unused.cut": "door",
  "unused.preauth": "door",
  "tiered.cut": "keys",
  "tiered.moot": "keys",
  "backup.cut": "backups",
  "backup.moot": "backups",
};

export const noteKind = (id: NoteId): "cut" | "none" | "moot" =>
  id.endsWith(".cut") ? "cut" : id.endsWith(".moot") ? "moot" : "none";

export function noteText(id: NoteId, lang: Lang, c: Controls): string {
  return NOTE_TEXT[id][lang].replace("{d}", String(c.patch));
}

export type SummaryRow = { stage: keyof Outcome["reached"]; label: string; value: string; bad: boolean };

const STAGE_LABEL: Record<keyof Outcome["reached"], T> = {
  door: { en: "Entry", ja: "侵入" },
  keys: { en: "Master keys (AD)", ja: "鍵（AD）" },
  backups: { en: "Backups", ja: "バックアップ" },
  exfil: { en: "Data leak", ja: "データ流出" },
  encrypt: { en: "Encryption", ja: "暗号化" },
};

const V = {
  in: { en: "Gets in", ja: "入られる" },
  stopped: { en: "Stopped at the door", ja: "扉で止まる" },
  keysTaken: { en: "Taken", ja: "奪われる" },
  keysSafe: { en: "Stay in the safe", ja: "保管庫に残る" },
  wiped: { en: "Wiped", ja: "消される" },
  survive: { en: "Survive", ja: "残る" },
  leakAll: { en: "Everything reachable leaves", ja: "届く範囲のデータがすべて出る" },
  leakLimited: {
    en: "Only what the first account can read",
    ja: "最初のアカウントで読める範囲だけ出る",
  },
  none: { en: "None", ja: "なし" },
  encAll: { en: "Company-wide, no way back", ja: "全社。戻せない" },
  encRecover: { en: "Company-wide, restorable from the offline copy", ja: "全社。オフラインの複製から戻せる" },
  encNone: { en: "No company-wide encryption", ja: "全社の暗号化はできない" },
} satisfies Record<string, T>;

export function summaryRows(o: Outcome, lang: Lang): SummaryRow[] {
  const r = o.reached;
  const row = (stage: SummaryRow["stage"], v: T, bad: boolean): SummaryRow => ({
    stage,
    label: STAGE_LABEL[stage][lang],
    value: v[lang],
    bad,
  });
  return [
    row("door", r.door ? V.in : V.stopped, r.door),
    row("keys", r.keys ? V.keysTaken : V.keysSafe, r.keys),
    row("backups", r.backups ? V.wiped : V.survive, r.backups),
    row("exfil", o.exfil === "all" ? V.leakAll : o.exfil === "limited" ? V.leakLimited : V.none, o.exfil !== "none"),
    row("encrypt", !r.encrypt ? V.encNone : o.recoverable ? V.encRecover : V.encAll, r.encrypt),
  ];
}
