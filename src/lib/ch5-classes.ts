import type { Lang } from "./paths";

// Fig. 5-3: the 32 KEV-listed VPN / remote-access CVEs in research/vulns.json,
// grouped by bug class. The grouping is this site's, from the NVD CWE and the
// vendor advisory wording recorded in vulns.json.

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

export const KEV_VPN: { cve: string; cls: BugClass }[] = [
  { cve: "CVE-2018-13379", cls: "read" },
  { cve: "CVE-2019-11510", cls: "read" },
  { cve: "CVE-2019-19781", cls: "read" },
  { cve: "CVE-2021-20016", cls: "inject" },
  { cve: "CVE-2021-22893", cls: "memory" },
  { cve: "CVE-2022-42475", cls: "memory" },
  { cve: "CVE-2023-27997", cls: "memory" },
  { cve: "CVE-2023-3519", cls: "inject" },
  { cve: "CVE-2023-20269", cls: "auth" },
  { cve: "CVE-2023-4966", cls: "memory" },
  { cve: "CVE-2023-46805", cls: "auth" },
  { cve: "CVE-2024-21887", cls: "inject" },
  { cve: "CVE-2024-21762", cls: "memory" },
  { cve: "CVE-2024-3400", cls: "inject" },
  { cve: "CVE-2024-24919", cls: "read" },
  { cve: "CVE-2024-40766", cls: "auth" },
  { cve: "CVE-2024-53704", cls: "auth" },
  { cve: "CVE-2025-0282", cls: "memory" },
  { cve: "CVE-2025-22457", cls: "memory" },
  { cve: "CVE-2025-5777", cls: "memory" },
  { cve: "CVE-2025-6543", cls: "memory" },
  { cve: "CVE-2025-7775", cls: "memory" },
  { cve: "CVE-2025-20362", cls: "auth" },
  { cve: "CVE-2025-20333", cls: "memory" },
  { cve: "CVE-2026-24858", cls: "auth" },
  { cve: "CVE-2025-68686", cls: "read" },
  { cve: "CVE-2026-3055", cls: "memory" },
  { cve: "CVE-2026-0257", cls: "auth" },
  { cve: "CVE-2026-50751", cls: "auth" },
  { cve: "CVE-2026-15409", cls: "inject" },
  { cve: "CVE-2026-8452", cls: "memory" },
  { cve: "CVE-2026-104935", cls: "auth" },
];

export function byClass(): { cls: BugClass; cves: string[] }[] {
  return ORDER.map((cls) => ({ cls, cves: KEV_VPN.filter((r) => r.cls === cls).map((r) => r.cve) }));
}
