import { describe, expect, it } from "vitest";
import { FIVE_YEAR, HEADLINE, latest, pct, ROUTE_YEARS, ROUTES_2026H1, routeSum } from "../../src/data/stats";

describe("NPA route data", () => {
  it("each year's counts add up to its valid responses", () => {
    for (const y of [...ROUTE_YEARS, ROUTES_2026H1]) expect(routeSum(y), String(y.year)).toBe(y.n);
  });

  it("five-year totals equal the sum of 2021-2025", () => {
    const sum = (k: "vpn" | "rdp" | "mail" | "other") => ROUTE_YEARS.reduce((s, y) => s + (y.counts[k] ?? 0), 0);
    expect(sum("vpn")).toBe(FIVE_YEAR.vpn);
    expect(sum("rdp")).toBe(FIVE_YEAR.rdp);
    expect(sum("mail")).toBe(FIVE_YEAR.mail);
    expect(sum("other")).toBe(FIVE_YEAR.other);
    expect(ROUTE_YEARS.reduce((s, y) => s + y.n, 0)).toBe(FIVE_YEAR.n);
  });

  it("matches the published 2025 headline", () => {
    const y = latest();
    expect(y.year).toBe(2025);
    expect(pct(y.counts.vpn ?? 0, y.n)).toBe("66.3");
    expect(pct(y.counts.rdp ?? 0, y.n)).toBe("20.7");
    expect(pct(y.counts.mail ?? 0, y.n)).toBe("2.2");
    expect(pct(y.counts.other ?? 0, y.n)).toBe("10.9");
    expect(pct(HEADLINE.sme2025, HEADLINE.reports2025, 0)).toBe("63");
  });

  it("matches NPA's own rounded shares for 2022 and 2023", () => {
    const [, y22, y23] = ROUTE_YEARS;
    expect(pct(y22?.counts.vpn ?? 0, y22?.n ?? 1, 0)).toBe("62");
    expect(pct(y23?.counts.vpn ?? 0, y23?.n ?? 1, 0)).toBe("63");
  });

  it("rejects a zero denominator", () => {
    expect(() => pct(1, 0)).toThrow();
  });
});
