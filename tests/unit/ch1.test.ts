import { describe, expect, it } from "vitest";
import { HEADLINE, pct, ROUTE_YEARS, ROUTES_2026H1 } from "../../src/data/stats";
import {
  C1,
  openingsBySize,
  PATCH_2026H1,
  PATCH_YEARS,
  remote,
  SIZE_2026H1,
  SIZE_YEARS,
  sizeTotal,
  unitBox,
  unitGrid,
} from "../../src/lib/ch1";

describe("chapter 1 data", () => {
  it("orders the 2025 openings by size: VPN, RDP, other, email", () => {
    expect(openingsBySize()).toEqual(["vpn", "rdp", "other", "mail"]);
  });

  it("email is the smallest opening in every full year", () => {
    for (const y of ROUTE_YEARS) expect(openingsBySize(y).at(-1), String(y.year)).toBe("mail");
  });

  it("VPN is the largest opening in every full year and in 2026 H1", () => {
    for (const y of [...ROUTE_YEARS, ROUTES_2026H1]) expect(openingsBySize(y)[0], String(y.year)).toBe("vpn");
  });

  it("VPN + RDP shares match research/stats.md", () => {
    expect(ROUTE_YEARS.map((y) => pct(remote(y), y.n))).toEqual(["73.7", "80.4", "81.7", "86.0", "87.0"]);
    expect(pct(remote(ROUTES_2026H1), ROUTES_2026H1.n)).toBe("75.0");
    expect(C1.remote).toBe(80);
    expect(C1.remotePct).toBe("87.0");
  });

  it("patch years add up to NPA's four-year total of 203 of 344", () => {
    expect(PATCH_YEARS.reduce((s, p) => s + p.n, 0)).toBe(HEADLINE.unpatched.n);
    expect(PATCH_YEARS.reduce((s, p) => s + p.unpatched, 0)).toBe(HEADLINE.unpatched.yes);
    expect(PATCH_YEARS.map((p) => pct(p.unpatched, p.n))).toEqual(["65.0", "60.5", "52.9", "56.3"]);
    expect(pct(PATCH_2026H1.unpatched, PATCH_2026H1.n)).toBe("58.6");
    expect(C1.unpatchedPct).toBe("59.0");
  });

  it("size breakdowns add up to each year's report total", () => {
    expect(SIZE_YEARS.map(sizeTotal)).toEqual([230, 197, 222, 226]);
    expect(sizeTotal(SIZE_2026H1)).toBe(HEADLINE.reports2026h1);
    const y25 = SIZE_YEARS.at(-1);
    expect(y25?.sme).toBe(HEADLINE.sme2025);
    expect(sizeTotal(y25 ?? SIZE_2026H1)).toBe(HEADLINE.reports2025);
    expect(C1.smePct).toBe("63.3");
  });

  it("five-year shares match research/stats.md", () => {
    expect([C1.fiveVpnPct, C1.fiveRdpPct, C1.fiveOtherPct, C1.fiveMailPct]).toEqual(["60.4", "21.6", "13.0", "4.9"]);
  });
});

describe("unit grid", () => {
  it("places one square per case, row by row", () => {
    const g = unitGrid(23, 10);
    expect(g).toHaveLength(23);
    expect(g[0]).toEqual({ x: 0, y: 0 });
    expect(g[9]).toEqual({ x: 108, y: 0 });
    expect(g[10]).toEqual({ x: 0, y: 12 });
    expect(g[22]).toEqual({ x: 24, y: 24 });
  });

  it("sizes the box to the squares without a trailing gap", () => {
    expect(unitBox(23, 10)).toEqual({ w: 118, h: 34 });
    expect(unitBox(2, 20)).toEqual({ w: 22, h: 10 });
    expect(unitBox(0, 20)).toEqual({ w: 0, h: 0 });
  });

  it("rejects a zero column count", () => {
    expect(() => unitGrid(1, 0)).toThrow();
  });
});
