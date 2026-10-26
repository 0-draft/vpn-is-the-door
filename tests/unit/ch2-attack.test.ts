import { describe, expect, it } from "vitest";
import { ATTACK_ROWS, attackUrl, eventUrl } from "../../src/lib/ch2-attack";

describe("ch2 ATT&CK table", () => {
  it("builds technique URLs, including sub-techniques", () => {
    expect(attackUrl("T1190")).toBe("https://attack.mitre.org/techniques/T1190/");
    expect(attackUrl("T1552.001")).toBe("https://attack.mitre.org/techniques/T1552/001/");
    expect(() => attackUrl("T15")).toThrow();
    expect(() => attackUrl("t1190")).toThrow();
  });

  it("covers every technique the chapter brief names", () => {
    const ids = new Set(ATTACK_ROWS.flatMap((r) => r.techniques.map((t) => t.id)));
    for (const id of [
      "T1190",
      "T1133",
      "T1078",
      "T1552.001",
      "T1539",
      "T1087.002",
      "T1003",
      "T1021.001",
      "T1021.002",
      "T1562.001",
      "T1490",
      "T1048",
      "T1567",
      "T1486",
    ])
      expect(ids.has(id), id).toBe(true);
  });

  it("keeps rows in scrolly order, steps 2 to 7", () => {
    const steps = ATTACK_ROWS.map((r) => r.step);
    expect(steps).toEqual([...steps].sort((a, b) => a - b));
    expect(Math.min(...steps)).toBe(2);
    expect(Math.max(...steps)).toBe(7);
  });

  it("has both languages and links only Security log events", () => {
    for (const r of ATTACK_ROWS) {
      expect(r.telemetry.en.length).toBeGreaterThan(40);
      expect(r.telemetry.ja.length).toBeGreaterThan(20);
      expect(r.telemetry.en).not.toMatch(/[぀-ヿ㐀-鿿]/);
      for (const e of r.events) {
        const u = eventUrl(e);
        if (e.kind === "security") expect(u).toMatch(/\/auditing\/event-\d{4}$/);
        else expect(u).toBeNull();
      }
    }
  });
});
