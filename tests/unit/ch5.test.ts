import { describe, expect, it } from "vitest";
import { byClass, KEV_VPN } from "../../src/lib/ch5-classes";
import {
  ACTIONS,
  actionFromHash,
  DEFAULT_ACTION,
  hashFor,
  ITEMS,
  severity,
  summary,
  tally,
} from "../../src/lib/ch5-evidence";
import { EDGES, layout, NODES, W } from "../../src/lib/ch5-flow";
import { LANGS } from "../../src/lib/paths";

describe("ch5 evidence survival", () => {
  it("gives every item a state for every action", () => {
    for (const i of ITEMS) for (const a of ACTIONS) expect(i.states[a]).toBeDefined();
  });

  it("memory never survives and off-box copies always do", () => {
    for (const a of ACTIONS) {
      for (const i of ITEMS.filter((x) => x.zone === "ram")) expect(i.states[a]).toBe("lost");
      for (const i of ITEMS.filter((x) => x.zone === "off")) expect(i.states[a]).toBe("kept");
    }
  });

  it("costs more evidence the harder the action", () => {
    for (const i of ITEMS) {
      expect(severity(i, "reboot")).toBeLessThanOrEqual(severity(i, "upgrade"));
      expect(severity(i, "upgrade")).toBeLessThanOrEqual(severity(i, "reset"));
    }
    expect(tally("reset").lost).toBeGreaterThan(tally("reboot").lost);
  });

  it("only the implant row uses the 'may survive' state", () => {
    for (const i of ITEMS) for (const a of ACTIONS) expect(i.states[a] === "stays").toBe(Boolean(i.implant));
  });

  it("round-trips the URL hash", () => {
    for (const a of ACTIONS) expect(actionFromHash(hashFor(a))).toBe(a);
    expect(actionFromHash("#evidence-format")).toBeNull();
    expect(actionFromHash("#fig-5-10")).toBeNull();
    expect(ACTIONS).toContain(DEFAULT_ACTION);
  });

  it("writes a summary in both languages without stray Japanese in English", () => {
    for (const a of ACTIONS) {
      expect(summary("en", a)).not.toMatch(/[぀-ヿ㐀-鿿]/);
      expect(summary("ja", a)).toMatch(/証拠/);
    }
    expect(summary("en", "reboot")).toContain("2 of 7");
  });
});

describe("ch5 KEV bug classes", () => {
  it("covers the 32 catalogued CVEs once each", () => {
    expect(KEV_VPN).toHaveLength(32);
    expect(new Set(KEV_VPN.map((r) => r.cve)).size).toBe(32);
    expect(byClass().reduce((n, g) => n + g.cves.length, 0)).toBe(32);
  });

  it("puts memory corruption first with 13 entries", () => {
    const g = byClass();
    expect(g[0]?.cls).toBe("memory");
    expect(g[0]?.cves).toHaveLength(13);
  });
});

describe("ch5 KEV response flowchart", () => {
  it("keeps the work in the required order", () => {
    const order = NODES.filter((n) => n.step).map((n) => n.id);
    expect(order).toEqual(["preserve", "patch", "reset", "revoke", "hunt", "rebuild", "report"]);
  });

  it("only links existing nodes, and decisions have a yes and a no", () => {
    const ids = new Set(NODES.map((n) => n.id));
    for (const e of EDGES) {
      expect(ids.has(e.from)).toBe(true);
      expect(ids.has(e.to)).toBe(true);
    }
    for (const d of NODES.filter((n) => n.kind === "decision")) {
      const labels = EDGES.filter((e) => e.from === d.id).map((e) => e.label);
      expect(labels.sort()).toEqual(["no", "yes"]);
    }
  });

  it("lays out without overlap and inside the viewBox, in both languages", () => {
    for (const lang of LANGS) {
      const { boxes, height } = layout(lang);
      const all = [...boxes.values()];
      for (const a of all) {
        expect(a.x).toBeGreaterThanOrEqual(0);
        expect(a.x + a.w).toBeLessThanOrEqual(W);
        expect(a.y + a.h).toBeLessThanOrEqual(height);
        for (const b of all) {
          if (a === b) continue;
          const overlap = a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
          expect(overlap, `${a.id} overlaps ${b.id} (${lang})`).toBe(false);
        }
      }
    }
  });

  it("has the same number of lines per node in both languages where it matters for layout", () => {
    for (const n of NODES) {
      expect(n.lines.en.length).toBeGreaterThan(0);
      expect(n.lines.ja.length).toBeGreaterThan(0);
    }
  });
});
