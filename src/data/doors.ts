// Chapter 3 door schedule: exploited VPN-appliance flaws, one row per CVE.
// Facts come from research/vulns.json (cross-checked against CISA KEV
// catalogVersion 2026.10.23); `part` and `patch` are this site's reading of
// the cited advisories. Pure helpers live here so they can be unit-tested.
import { z } from "zod";
import raw from "./doors.json";

export const PARTS = ["intercom", "lock", "keys", "frame", "camera"] as const;
export type Part = (typeof PARTS)[number];

const Text = z.object({ en: z.string().min(1), ja: z.string().min(1) });
// YYYY-MM-DD, or YYYY-MM when only the month is known
const DateStr = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?$/);
const DayStr = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/);
const CveId = z.string().regex(/^CVE-\d{4}-\d{4,}$/);

export const ProductSchema = z.object({
  id: z.enum(["fortinet", "ivanti", "citrix", "paloalto", "sonicwall", "cisco", "checkpoint"]),
  mark: z.string().regex(/^SD-\d+$/),
  name: Text,
});

export const VulnSchema = z
  .object({
    cve: CveId,
    product: ProductSchema.shape.id,
    productDetail: z.string().min(1),
    nickname: z.string().min(1).nullable(),
    cvss: z.array(z.object({ score: z.number().min(0).max(10), by: z.string().min(1).nullable() })),
    class: Text,
    preauth: z.boolean(),
    chainedBehind: CveId.nullable(),
    gets: Text,
    part: z.array(z.enum(PARTS)).min(1),
    disclosed: DateStr,
    exploited: z.object({ date: DateStr, zeroDay: z.boolean(), before: z.boolean(), note: Text }).nullable(),
    kevAdded: DayStr,
    ransomware: z.enum(["Known", "Unknown"]),
    patch: z.discriminatedUnion("enough", [
      z.object({ enough: z.literal(true), reason: z.null(), source: z.null() }),
      z.object({ enough: z.literal(false), reason: Text, source: z.string().regex(/^[a-z0-9-]+$/) }),
    ]),
    sources: z.array(z.url().startsWith("https://")).min(2),
  })
  .refine((v) => v.preauth || v.chainedBehind !== null, {
    message: "a post-auth row must name the bug it was chained behind",
  });

export const DoorsSchema = z.object({
  catalogVersion: z.string(),
  excluded: z.array(z.object({ cve: CveId, reason: z.string().min(1) })),
  products: z.array(ProductSchema).min(1),
  vulns: z.array(VulnSchema).min(1),
});

export type Product = z.infer<typeof ProductSchema>;
export type Vuln = z.infer<typeof VulnSchema>;
export type Doors = z.infer<typeof DoorsSchema>;

export const DOORS: Doors = DoorsSchema.parse(raw);
export const PRODUCTS = DOORS.products;
export const VULNS = DOORS.vulns;

export function productOf(v: Vuln, products: Product[] = PRODUCTS): Product {
  const p = products.find((x) => x.id === v.product);
  if (!p) throw new Error(`unknown product ${v.product}`);
  return p;
}

export const nvdUrl = (cve: string) => `https://nvd.nist.gov/vuln/detail/${cve}`;
export const kevUrl = (cve: string) => `https://www.cisa.gov/known-exploited-vulnerabilities-catalog?field_cve=${cve}`;

/** "CVE-2023-4966" → "cve-2023-4966", the row's id and URL hash. */
export const anchor = (cve: string) => cve.toLowerCase();

export function cveFromHash(hash: string, list: Vuln[] = VULNS): string | null {
  const m = /^#?(cve-\d{4}-\d{4,})$/i.exec(hash.trim());
  if (!m) return null;
  const id = (m[1] as string).toUpperCase();
  return list.some((v) => v.cve === id) ? id : null;
}

/** First and last day covered by a YYYY-MM or YYYY-MM-DD string, as UTC epoch days. */
export function period(d: string): { start: number; end: number } {
  const [y, m, day] = d.split("-").map(Number) as [number, number, number | undefined];
  const ms = 86_400_000;
  if (day !== undefined) {
    const t = Date.UTC(y, m - 1, day) / ms;
    return { start: t, end: t };
  }
  return { start: Date.UTC(y, m - 1, 1) / ms, end: Date.UTC(y, m, 0) / ms };
}

/** Days from b to a; with month precision, compares the earliest possible days. */
export const daysBetween = (a: string, b: string) => period(b).start - period(a).start;

/**
 * Exploitation relative to disclosure, in days (negative = before disclosure).
 * Month-precision dates become a range; a zero-day's range is clipped to end
 * before disclosure. `open` marks "this date or earlier".
 */
export function exploitGap(v: Vuln): { from: number; to: number; open: boolean } | null {
  if (!v.exploited) return null;
  const d = period(v.disclosed);
  const e = period(v.exploited.date);
  let from = e.start - d.start;
  let to = e.end - d.start;
  if (v.exploited.zeroDay) to = Math.min(to, -1);
  if (from > to) from = to;
  return { from, to, open: v.exploited.before };
}

export const kevGap = (v: Vuln) => period(v.kevAdded).start - period(v.disclosed).start;

/** Route segments drawn on the detail drawing: from the street ("o") through each part. */
export function segmentsFor(part: readonly Part[]): string[] {
  const seq = ["o", ...part];
  return seq.slice(1).map((p, i) => `${seq[i]}-${p}`);
}

/** A row whose route never touches the lock: passwords and MFA are not consulted. */
export const skipsLock = (v: Vuln) => !v.part.includes("lock");

export interface Filter {
  product: Product["id"] | "all";
  preauthOnly: boolean;
  patchNotEnough: boolean;
}

export function matches(v: Vuln, f: Filter): boolean {
  if (f.product !== "all" && v.product !== f.product) return false;
  if (f.preauthOnly && !v.preauth) return false;
  if (f.patchNotEnough && v.patch.enough) return false;
  return true;
}

export const PART_LABEL: Record<Part, { metaphor: Record<"en" | "ja", string>; real: Record<"en" | "ja", string> }> = {
  intercom: {
    metaphor: { en: "Intercom", ja: "インターホン" },
    real: { en: "Pre-auth web portal", ja: "認証前の Web ポータル" },
  },
  lock: {
    metaphor: { en: "Lock", ja: "錠" },
    real: { en: "Authentication and MFA", ja: "認証・多要素認証" },
  },
  keys: {
    metaphor: { en: "Issued keys", ja: "合鍵" },
    real: { en: "Session tokens and stored credentials", ja: "セッショントークン・保存された認証情報" },
  },
  frame: {
    metaphor: { en: "Frame and hinges", ja: "枠と蝶番" },
    real: { en: "Appliance OS, daemons, management", ja: "機器の OS・常駐プロセス・管理機能" },
  },
  camera: {
    metaphor: { en: "Camera", ja: "防犯カメラ" },
    real: { en: "Appliance logs", ja: "機器のログ" },
  },
};

export function partPath(lang: "en" | "ja", part: readonly Part[], real = true): string {
  return part.map((p) => PART_LABEL[p][real ? "real" : "metaphor"][lang]).join(" → ");
}

export function cvssText(v: Vuln, lang: "en" | "ja"): string {
  if (v.cvss.length === 0) return lang === "ja" ? "未確認" : "not confirmed";
  return v.cvss.map((c) => (c.by ? `${c.score.toFixed(1)} (${c.by})` : c.score.toFixed(1))).join(" / ");
}

/** Counts quoted in the chapter text, derived so prose and table never disagree. */
export function scheduleStats(list: Vuln[] = VULNS) {
  return {
    total: list.length,
    preauth: list.filter((v) => v.preauth).length,
    zeroDay: list.filter((v) => v.exploited?.zeroDay).length,
    sameDayKev: list.filter((v) => kevGap(v) === 0).length,
    patchNotEnough: list.filter((v) => !v.patch.enough).length,
    ransomwareKnown: list.filter((v) => v.ransomware === "Known").length,
    byPart: Object.fromEntries(PARTS.map((p) => [p, list.filter((v) => v.part.includes(p)).length])) as Record<
      Part,
      number
    >,
  };
}
