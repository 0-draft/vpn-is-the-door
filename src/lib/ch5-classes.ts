import { VULNS } from "../data/doors";
import type { Lang } from "./paths";

// Fig. 5-3: the KEV-listed VPN / remote-access CVEs of the door schedule
// (src/data/doors.json), grouped by bug class. The grouping is this site's,
// from the NVD CWE and the vendor advisory wording.

export type BugClass = "memory" | "auth" | "inject" | "read";

export const CLASS_LABEL: Record<Lang, Record<BugClass, string>> = {
  en: {
    memory: "Memory corruption",
    auth: "Authentication or authorization bypass",
    inject: "Injection (command, code, SQL, SSRF)",
    read: "File read or path traversal",
  },
  ja: {
    memory: "メモリ破壊",
    auth: "認証・認可の回避",
    inject: "インジェクション（コマンド、コード、SQL、SSRF）",
    read: "ファイル読み出し・パストラバーサル",
  },
};

export const CLASS_NOTE: Record<Lang, Record<BugClass, string>> = {
  en: {
    memory: "buffer overflow, out-of-bounds read or write, use-after-free",
    auth: "",
    inject: "",
    read: "",
  },
  ja: {
    memory: "バッファオーバーフロー、範囲外の読み書き、解放後使用",
    auth: "",
    inject: "",
    read: "",
  },
};

export const ORDER: BugClass[] = ["memory", "auth", "inject", "read"];

// Bug class per CVE, keyed by id. The rows themselves come from src/data/doors.json
// (chapter 3's dataset); tests fail if a row has no class or a class has no row.
export const CLASS_OF: Record<string, BugClass> = {
  "CVE-2018-13379": "read",
  "CVE-2019-11510": "read",
  "CVE-2019-19781": "read",
  "CVE-2021-20016": "inject",
  "CVE-2021-22893": "memory",
  "CVE-2022-42475": "memory",
  "CVE-2023-27997": "memory",
  "CVE-2023-3519": "inject",
  "CVE-2023-20269": "auth",
  "CVE-2023-4966": "memory",
  "CVE-2023-46805": "auth",
  "CVE-2024-21887": "inject",
  "CVE-2024-21762": "memory",
  "CVE-2024-3400": "inject",
  "CVE-2024-24919": "read",
  "CVE-2024-40766": "auth",
  "CVE-2024-53704": "auth",
  "CVE-2025-0282": "memory",
  "CVE-2025-22457": "memory",
  "CVE-2025-5777": "memory",
  "CVE-2025-6543": "memory",
  "CVE-2025-7775": "memory",
  "CVE-2025-20362": "auth",
  "CVE-2025-20333": "memory",
  "CVE-2026-24858": "auth",
  "CVE-2025-68686": "read",
  "CVE-2026-3055": "memory",
  "CVE-2026-0257": "auth",
  "CVE-2026-50751": "auth",
  "CVE-2026-15409": "inject",
  "CVE-2026-104935": "auth",
};

export function classOf(cve: string): BugClass {
  const c = CLASS_OF[cve];
  if (!c) throw new Error(`no bug class for ${cve}`);
  return c;
}

export const ROWS = VULNS.map((v) => ({ cve: v.cve, preauth: v.preauth, cls: classOf(v.cve) }));
export const TOTAL = ROWS.length;
export const PREAUTH = ROWS.filter((r) => r.preauth).length;

export function byClass(): { cls: BugClass; cves: string[] }[] {
  return ORDER.map((cls) => ({ cls, cves: ROWS.filter((r) => r.cls === cls).map((r) => r.cve) }));
}
