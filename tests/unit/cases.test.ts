import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { openingName, openingTag, STATUS, stamp, wrap } from "../../src/components/ch4/labels";
import { CASES, CaseSchema, caseNumber, citedIds, openingCounts, ordered } from "../../src/data/cases";

// Read the source files from disk so the check does not depend on what the bundler globbed.
const ids = new Set(
  readdirSync("src/data/sources")
    .filter((f) => f.endsWith(".json"))
    .flatMap((f) => (JSON.parse(readFileSync(`src/data/sources/${f}`, "utf8")) as { id: string }[]).map((s) => s.id)),
);
const JA = /[぀-ヿ㐀-鿿]/;

describe("cases.json", () => {
  it("every record matches the schema", () => {
    const raw = JSON.parse(readFileSync("src/data/cases.json", "utf8")) as unknown[];
    for (const r of raw) expect(CaseSchema.safeParse(r).success).toBe(true);
    expect(CASES.length).toBe(raw.length);
  });

  it("slugs are unique", () => {
    expect(new Set(CASES.map((c) => c.slug)).size).toBe(CASES.length);
  });

  it("every event has a source id that exists", () => {
    for (const c of CASES)
      for (const e of c.events) expect(ids.has(e.source), `${c.slug} ${e.date}: ${e.source}`).toBe(true);
  });

  it("every cited source exists and is listed in the case's own sources", () => {
    for (const c of CASES) {
      for (const id of citedIds(c)) expect(ids.has(id), `${c.slug}: ${id}`).toBe(true);
      const listed = new Set(c.sources);
      for (const e of c.events) expect(listed.has(e.source), `${c.slug}: event cites unlisted ${e.source}`).toBe(true);
      expect(listed.has(c.vectorSource), `${c.slug}: vectorSource unlisted`).toBe(true);
    }
  });

  it("events are in time order", () => {
    for (const c of CASES) {
      // a date-only entry ("that night") may follow a timed entry on the same day
      const days = c.events.map((e) => e.date.slice(0, 10));
      expect(days, c.slug).toEqual([...days].sort());
    }
  });

  it("English text has no Japanese", () => {
    for (const c of CASES) {
      for (const e of c.events) expect(JA.test(e.event_en), `${c.slug} ${e.date}`).toBe(false);
      for (const v of [c.org, c.cause, c.summary, c.vectorWording, c.after, c.impact, c.impactShort])
        expect(JA.test(v.en), `${c.slug}: ${v.en.slice(0, 40)}`).toBe(false);
    }
  });

  it("dates are consistent", () => {
    for (const c of CASES) {
      if (c.detected) expect(c.detected >= c.attacked.date.slice(0, c.detected.length), c.slug).toBe(true);
      expect(c.disclosed.length).toBeGreaterThanOrEqual(7);
    }
  });

  it("non-ransomware cases say so, and unspecified devices are never called VPN in the cause", () => {
    for (const c of CASES) {
      if (c.kind === "not-ransomware") expect(c.kindNote.en).toMatch(/^Not ransomware/);
      if (c.opening === "network-device-unspecified") {
        expect(c.cause.en).not.toMatch(/VPN/);
        expect(c.cause.ja).not.toMatch(/VPN/);
        expect(c.openingNote, c.slug).toBeDefined();
      }
    }
  });

  it("does not publish credentials quoted in the reports", () => {
    const text = readFileSync("src/data/cases.json", "utf8");
    expect(text).not.toMatch(/P@ssw0rd/i);
  });

  it("Japan comes first in the chapter order and numbers follow it", () => {
    const o = ordered();
    const firstGlobal = o.findIndex((c) => c.region === "global");
    expect(o.slice(firstGlobal).every((c) => c.region === "global")).toBe(true);
    expect(caseNumber(o[0]?.slug ?? "")).toBe(1);
    expect(() => caseNumber("nope")).toThrow();
  });

  it("labels keep the organization's words and never call an undisclosed device a VPN", () => {
    for (const c of CASES) {
      if (c.opening !== "vpn") {
        expect(openingName("en", c)).not.toMatch(/VPN/);
        expect(openingName("ja", c)).not.toMatch(/VPN/);
      }
    }
    expect(openingTag("en", "network-device-unspecified")).toBe("type undisclosed");
    expect(openingTag("en", "vpn")).toBeUndefined();
  });

  it("wraps labels and marks approximate times", () => {
    expect(wrap("Communications equipment", 14)).toEqual(["Communications", "equipment"]);
    expect(wrap("VPN", 14)).toEqual(["VPN"]);
    expect(wrap("社外からのアクセスです", 9)).toEqual(["社外からのアクセス", "です"]);
    expect(stamp("ja", "2024-05-20 06:15", true)).toBe("2024-05-20 06:15ごろ");
    expect(stamp("en", "2024-05-20 06:15", true)).toBe("c. 2024-05-20 06:15");
    expect(stamp("en", "2024-05-20")).toBe("2024-05-20");
  });

  it("follows the victims' own words: Nagoya and Kantsu are devices of undisclosed type, not VPNs", () => {
    const expected = { "nagoya-port": "リモート接続機器", kantsu: "外部ネットワークとの接続口" } as const;
    for (const [slug, label] of Object.entries(expected)) {
      const c = CASES.find((x) => x.slug === slug);
      expect(c?.opening, slug).toBe("network-device-unspecified");
      expect(c?.openingLabel?.ja, slug).toBe(label);
      expect(c?.vectorWording.ja, slug).not.toMatch(/VPN/);
      expect(c?.vectorWording.en, slug).not.toMatch(/VPN/);
    }
    const n = openingCounts();
    expect(n.vpn).toBe(9);
    expect(n["network-device-unspecified"]).toBe(5);
    expect(n.other).toBe(1);
  });

  it("labels a sentence as stated only when the source states it", () => {
    expect(STATUS.stated.ja).toBe("記載");
  });

  it("opening counts add up", () => {
    const n = openingCounts();
    expect(Object.values(n).reduce((a, b) => a + b, 0)).toBe(CASES.length);
  });
});
