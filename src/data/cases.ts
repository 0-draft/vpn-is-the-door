import { z } from "zod";
import raw from "./cases.json";

// Chapter 4: real incidents, one record per case. Only cases whose entry point
// the organization (or an official report) stated itself; research/incidents.md
// has the provenance and the cases that were left out.

const L = z.object({ en: z.string().min(1), ja: z.string().min(1) });
const day = /^\d{4}-\d{2}(-\d{2})?$/;
const stamp = /^\d{4}-\d{2}(-\d{2}( \d{2}:\d{2})?)?$/;
const id = z.string().regex(/^[a-z0-9-]+$/);

export const OPENINGS = ["vpn", "rdp", "network-device-unspecified", "other"] as const;
export type Opening = (typeof OPENINGS)[number];

export const EventSchema = z.object({
  date: z.string().regex(stamp),
  approx: z.boolean().optional(),
  actor: L,
  event_en: z.string().min(1),
  event_ja: z.string().min(1),
  source: id,
});

export const PointSchema = z.object({
  status: z.enum(["stated", "presumed", "unknown"]),
  en: z.string().min(1),
  ja: z.string().min(1),
  source: id,
});

export const CaseSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  region: z.enum(["jp", "global"]),
  org: L,
  short: L,
  country: z.enum(["JP", "US"]),
  sector: L,
  kind: z.enum(["ransomware", "not-ransomware"]),
  kindNote: L,
  attacked: z.object({ date: z.string().regex(day), approx: z.boolean().optional(), note: L.optional() }),
  detected: z.string().regex(day).nullable(),
  disclosed: z.string().regex(day),
  opening: z.enum(OPENINGS),
  openingNote: L.optional(),
  // the organization's own name for the opening, when it is not "VPN"
  openingLabel: L.optional(),
  // one-line caveat on how the opening is known, shown in the index table
  openingQualifier: L.optional(),
  product: L.nullable(),
  cve: z.array(z.string().regex(/^CVE-\d{4}-\d{4,}$/)),
  vectorWording: L,
  vectorSource: id,
  cause: L,
  summary: L,
  after: L,
  impact: L,
  impactShort: L,
  analysis: z.array(PointSchema).min(1),
  conclusion: L,
  recommendations: z.object({
    by: L,
    items: z.array(L),
    sources: z.array(id),
  }),
  events: z.array(EventSchema).min(2),
  sources: z.array(id).min(1),
});

export type Case = z.infer<typeof CaseSchema>;
export type CaseEvent = z.infer<typeof EventSchema>;

export const CASES: Case[] = z.array(CaseSchema).parse(raw);

export function caseBySlug(slug: string): Case {
  const c = CASES.find((x) => x.slug === slug);
  if (!c) throw new Error(`unknown case: ${slug}`);
  return c;
}

// Japan first, then global; inside each, the order of the file (by attack date).
export function ordered(): Case[] {
  return [...CASES.filter((c) => c.region === "jp"), ...CASES.filter((c) => c.region === "global")];
}

// Position of a case in the chapter, used for figure numbers (4-<n>-1).
export function caseNumber(slug: string): number {
  const i = ordered().findIndex((c) => c.slug === slug);
  if (i < 0) throw new Error(`unknown case: ${slug}`);
  return i + 1;
}

export function openingCounts(list: Case[] = CASES): Record<Opening, number> {
  const out = { vpn: 0, rdp: 0, "network-device-unspecified": 0, other: 0 } as Record<Opening, number>;
  for (const c of list) out[c.opening] += 1;
  return out;
}

// Every source id a case cites, in one list.
export function citedIds(c: Case): string[] {
  return [
    ...new Set([
      c.vectorSource,
      ...c.analysis.map((a) => a.source),
      ...c.recommendations.sources,
      ...c.events.map((e) => e.source),
      ...c.sources,
    ]),
  ];
}
