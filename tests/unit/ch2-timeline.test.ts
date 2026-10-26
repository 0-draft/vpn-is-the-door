import { describe, expect, it } from "vitest";
import {
  A_FRAC,
  axisPos,
  breakSpan,
  clockSpanHours,
  END_H,
  LANES,
  MARKS,
  marksByTime,
  OFF_HOURS_PCT,
  SPLIT_H,
  spread,
  TICKS,
} from "../../src/lib/ch2-timeline";

describe("ch2 timeline axis", () => {
  it("is piecewise linear with a break after the split", () => {
    expect(axisPos(0, 1000)).toBe(0);
    expect(axisPos(SPLIT_H, 1000)).toBeCloseTo(A_FRAC * 1000);
    expect(axisPos(END_H, 1000)).toBeCloseTo(1000);
    const [a, b] = breakSpan(1000);
    expect(a).toBeCloseTo(axisPos(SPLIT_H, 1000));
    expect(axisPos(SPLIT_H + 0.001, 1000)).toBeGreaterThan(b - 0.01);
  });

  it("is strictly increasing over the ticks", () => {
    const xs = TICKS.map((t) => axisPos(t.h, 900));
    for (let i = 1; i < xs.length; i++) expect(xs[i]).toBeGreaterThan(xs[i - 1] as number);
  });

  it("rejects hours outside the axis", () => {
    expect(() => axisPos(-1, 100)).toThrow();
    expect(() => axisPos(END_H + 1, 100)).toThrow();
    expect(() => axisPos(Number.NaN, 100)).toThrow();
  });
});

describe("ch2 timeline data", () => {
  it("keeps the sourced values from research/mechanics.md", () => {
    const h = Object.fromEntries(MARKS.map((m) => [m.id, m.h]));
    expect(h.scan).toBeCloseTo(5 / 60);
    expect(h.fastest).toBeCloseTo(55 / 60);
    expect(h.under4).toBe(4);
    expect(h.ad).toBe(3.4);
    expect(h["ad-2024"]).toBe(11);
    expect(h["exfil-2024"]).toBe(72.98);
    expect(h.exfil).toBe(78.83);
    expect(OFF_HOURS_PCT).toBe(88.1);
  });

  it("computes the Handa span across midnight", () => {
    expect(clockSpanHours("23:57", "03:04")).toBeCloseTo(3 + 7 / 60);
    expect(clockSpanHours("01:00", "02:30")).toBe(1.5);
    expect(() => clockSpanHours("3:04", "04:00")).toThrow();
  });

  it("gives every mark a lane with a source and both languages", () => {
    const lanes = new Set(LANES.map((l) => l.id));
    for (const m of MARKS) {
      expect(lanes.has(m.lane)).toBe(true);
      expect(m.text.en.length).toBe(m.text.ja.length);
    }
    for (const l of LANES) expect(l.source).toMatch(/^[a-z0-9-]+$/);
  });

  it("sorts marks by time", () => {
    const hs = marksByTime().map((m) => m.h);
    expect(hs).toEqual([...hs].sort((a, b) => a - b));
  });
});

describe("spread", () => {
  it("pushes overlapping labels down and keeps free ones", () => {
    expect(spread([0, 10, 200], [50, 50, 50])).toEqual([0, 50, 200]);
    expect(spread([0, 10, 20], [30, 30, 30])).toEqual([0, 30, 60]);
    expect(spread([], [])).toEqual([]);
  });

  it("rejects mismatched input", () => {
    expect(() => spread([1, 2], [1])).toThrow();
  });
});
