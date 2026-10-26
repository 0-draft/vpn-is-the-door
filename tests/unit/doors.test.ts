import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  anchor,
  cveFromHash,
  DoorsSchema,
  exploitGap,
  kevGap,
  kevUrl,
  matches,
  nvdUrl,
  PRODUCTS,
  period,
  scheduleStats,
  segmentsFor,
  skipsLock,
  VULNS,
} from "../../src/data/doors";
import raw from "../../src/data/doors.json";

describe("door schedule data", () => {
  it("parses against the schema", () => {
    expect(() => DoorsSchema.parse(raw)).not.toThrow();
    expect(VULNS.length).toBe(31);
  });

  it("rejects a malformed CVE id and a non-https source", () => {
    const first = VULNS[0]!;
    const bad = structuredClone(raw) as { vulns: Record<string, unknown>[] };
    bad.vulns[0] = { ...first, cve: "CVE-23-1" };
    expect(DoorsSchema.safeParse(bad).success).toBe(false);
    bad.vulns[0] = { ...first, sources: ["http://example.com/a", "https://example.com/b"] };
    expect(DoorsSchema.safeParse(bad).success).toBe(false);
  });

  it("uses well-formed, unique CVE ids", () => {
    for (const v of VULNS) expect(v.cve).toMatch(/^CVE-\d{4}-\d{4,}$/);
    expect(new Set(VULNS.map((v) => v.cve)).size).toBe(VULNS.length);
  });

  it("keeps the excluded rows out", () => {
    for (const x of (raw as { excluded: { cve: string }[] }).excluded)
      expect(VULNS.some((v) => v.cve === x.cve)).toBe(false);
  });

  it("has only https sources, NVD first and the KEV entry second", () => {
    for (const v of VULNS) {
      for (const u of v.sources) expect(u.startsWith("https://"), `${v.cve} ${u}`).toBe(true);
      expect(v.sources[0]).toBe(nvdUrl(v.cve));
      expect(v.sources[1]).toBe(kevUrl(v.cve));
    }
  });

  it("orders dates: disclosed on or before KEV added", () => {
    for (const v of VULNS) expect(period(v.disclosed).start, v.cve).toBeLessThanOrEqual(period(v.kevAdded).start);
  });

  it("puts zero-day exploitation before disclosure and n-day after", () => {
    for (const v of VULNS) {
      const g = exploitGap(v);
      if (!g || !v.exploited) continue;
      // check the raw dates, not exploitGap's clipped output
      if (v.exploited.zeroDay)
        expect(period(v.exploited.date).start, v.cve).toBeLessThanOrEqual(period(v.disclosed).start);
      else expect(g.to, v.cve).toBeGreaterThanOrEqual(-31);
      expect(g.from).toBeLessThanOrEqual(g.to);
    }
  });

  it("gives a reason and a known source whenever patching is not enough", () => {
    const dir = "src/data/sources";
    const ids = new Set(
      readdirSync(dir)
        .filter((f) => f.endsWith(".json"))
        .flatMap((f) => (JSON.parse(readFileSync(`${dir}/${f}`, "utf8")) as { id: string }[]).map((s) => s.id)),
    );
    for (const v of VULNS)
      if (!v.patch.enough) expect(ids.has(v.patch.source), `${v.cve} ${v.patch.source}`).toBe(true);
  });

  it("names a real product for every row and one door mark per product", () => {
    const marks = PRODUCTS.map((p) => p.mark);
    expect(new Set(marks).size).toBe(marks.length);
    for (const v of VULNS) expect(PRODUCTS.some((p) => p.id === v.product)).toBe(true);
  });

  it("chains post-auth rows behind a pre-auth row in the table", () => {
    for (const v of VULNS.filter((x) => !x.preauth)) {
      const front = VULNS.find((x) => x.cve === v.chainedBehind);
      expect(front?.preauth, v.cve).toBe(true);
    }
  });

  it("reads honest parts for the well-known cases", () => {
    const by = (id: string) => VULNS.find((v) => v.cve === id)!;
    expect(by("CVE-2023-4966").part).toEqual(["intercom", "keys"]);
    expect(by("CVE-2018-13379").part).toEqual(["intercom", "keys"]);
    expect(by("CVE-2022-42475").part).toEqual(["intercom", "frame"]);
    expect(by("CVE-2023-20269").part).toEqual(["lock"]);
    expect(by("CVE-2018-13379").ransomware).toBe("Known");
    expect(by("CVE-2025-6543").ransomware).toBe("Unknown");
  });
});

describe("door schedule helpers", () => {
  it("expands month precision to the whole month", () => {
    const p = period("2024-02");
    expect(p.end - p.start).toBe(28);
    expect(period("2023-10-10").start).toBe(period("2023-10-10").end);
  });

  it("computes exploitation and KEV gaps against disclosure", () => {
    const v = VULNS.find((x) => x.cve === "CVE-2024-3400")!;
    expect(exploitGap(v)).toEqual({ from: -17, to: -17, open: false });
    expect(kevGap(v)).toBe(0);
    const bleed = VULNS.find((x) => x.cve === "CVE-2023-4966")!;
    const g = exploitGap(bleed)!;
    expect(g.from).toBe(-70);
    expect(g.to).toBe(-40);
    expect(exploitGap(VULNS.find((x) => x.cve === "CVE-2025-68686")!)).toBeNull();
  });

  it("builds route segments from the street through each part", () => {
    expect(segmentsFor(["intercom", "frame"])).toEqual(["o-intercom", "intercom-frame"]);
    expect(segmentsFor(["lock", "frame", "camera"])).toEqual(["o-lock", "lock-frame", "frame-camera"]);
    expect(segmentsFor(["keys"])).toEqual(["o-keys"]);
  });

  it("knows which routes never reach the lock", () => {
    expect(skipsLock(VULNS.find((x) => x.cve === "CVE-2024-3400")!)).toBe(true);
    expect(skipsLock(VULNS.find((x) => x.cve === "CVE-2023-20269")!)).toBe(false);
  });

  it("filters by product, pre-auth and patch", () => {
    const all = { product: "all", preauthOnly: false, patchNotEnough: false } as const;
    expect(VULNS.filter((v) => matches(v, all)).length).toBe(VULNS.length);
    const citrix = VULNS.filter((v) => matches(v, { ...all, product: "citrix" }));
    expect(citrix.every((v) => v.product === "citrix")).toBe(true);
    expect(VULNS.filter((v) => matches(v, { ...all, preauthOnly: true })).every((v) => v.preauth)).toBe(true);
    expect(VULNS.filter((v) => matches(v, { ...all, patchNotEnough: true })).every((v) => !v.patch.enough)).toBe(true);
  });

  it("round-trips the URL hash", () => {
    expect(anchor("CVE-2023-4966")).toBe("cve-2023-4966");
    expect(cveFromHash("#cve-2023-4966")).toBe("CVE-2023-4966");
    expect(cveFromHash("#CVE-2026-104935")).toBe("CVE-2026-104935");
    expect(cveFromHash("#cve-1999-0001")).toBeNull();
    expect(cveFromHash("#fig-3-1")).toBeNull();
  });
});

describe("schedule stats", () => {
  it("matches the counts the chapter text relies on", () => {
    const s = scheduleStats();
    expect(s).toMatchObject({ total: 31, preauth: 29, zeroDay: 19, sameDayKev: 11, patchNotEnough: 17 });
    expect(s.byPart.intercom).toBe(19);
  });
});
