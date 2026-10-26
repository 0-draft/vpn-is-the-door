import { describe, expect, it } from "vitest";
import {
  CONTROL_IDS,
  type Controls,
  ENTRIES,
  type Entry,
  EXPLOIT_DAY,
  evaluate,
  fromQuery,
  NO_CONTROLS,
  NOTE_STATION,
  NOTE_TEXT,
  type NoteId,
  noteText,
  PATCH_DAYS,
  planState,
  summaryRows,
  toQuery,
} from "../../src/lib/sandbox";

const run = (entry: Entry, c: Partial<Controls> = {}) => evaluate(entry, { ...NO_CONTROLS, ...c });
const ALL_REACHED = { door: true, keys: true, backups: true, exfil: true, encrypt: true };
const NONE_REACHED = { door: false, keys: false, backups: false, exfil: false, encrypt: false };

describe("no controls", () => {
  it.each(ENTRIES)("%s: the whole route runs", (entry) => {
    const o = run(entry);
    expect(o.cutAt).toBeNull();
    expect(o.cuts).toEqual([]);
    expect(o.reached).toEqual(ALL_REACHED);
    expect(o.exfil).toBe("all");
    expect(o.recoverable).toBe(false);
    expect(o.notes).toEqual([]);
  });
});

// design §8.2, one block per row of the switch table
describe("patch within X days", () => {
  it("stops a pre-auth flaw only when the deadline is shorter than the exploit date", () => {
    expect(EXPLOIT_DAY).toBe(5);
    const fast = run("preauth", { patch: 3 });
    expect(fast.cutAt).toBe("door");
    expect(fast.reached).toEqual(NONE_REACHED);
    expect(fast.notes).toEqual(["patch.cut"]);
    for (const d of [14, 60] as const) {
      const late = run("preauth", { patch: d });
      expect(late.cutAt).toBeNull();
      expect(late.reached).toEqual(ALL_REACHED);
      expect(late.notes).toEqual(["patch.late"]);
    }
  });

  it("does not stop a password stolen before the patch", () => {
    for (const d of PATCH_DAYS) {
      const o = run("password", { patch: d });
      expect(o.reached.door).toBe(true);
      expect(o.notes).toEqual(["patch.password"]);
    }
  });

  it("does not stop a zero-day, even with a 3-day deadline", () => {
    for (const d of PATCH_DAYS) {
      const o = run("zeroday", { patch: d });
      expect(o.cutAt).toBeNull();
      expect(o.reached).toEqual(ALL_REACHED);
      expect(o.notes).toEqual(["patch.zeroday"]);
    }
  });

  it("a 60-day deadline against a zero-day: still breached", () => {
    expect(run("zeroday", { patch: 60 }).reached).toEqual(ALL_REACHED);
  });
});

describe("MFA on the VPN", () => {
  it("stops credential reuse at the door", () => {
    const o = run("password", { mfa: true });
    expect(o.cutAt).toBe("door");
    expect(o.reached).toEqual(NONE_REACHED);
    expect(o.exfil).toBe("none");
    expect(o.notes).toEqual(["mfa.cut"]);
  });

  it.each(["preauth", "zeroday"] as const)("does nothing against a pre-auth flaw (%s): still breached", (entry) => {
    const o = run(entry, { mfa: true });
    expect(o.cutAt).toBeNull();
    expect(o.reached).toEqual(ALL_REACHED);
    expect(o.notes).toEqual(["mfa.preauth"]);
  });
});

describe("remove unused accounts", () => {
  it("stops the unused-account (Colonial-type) entry", () => {
    const o = run("password", { unused: true });
    expect(o.cutAt).toBe("door");
    expect(o.notes).toEqual(["unused.cut"]);
  });

  it.each(["preauth", "zeroday"] as const)("does not stop an exploit (%s)", (entry) => {
    const o = run(entry, { unused: true });
    expect(o.reached.door).toBe(true);
    expect(o.notes).toEqual(["unused.preauth"]);
  });
});

describe("tiered admin accounts", () => {
  it.each(ENTRIES)("%s: keys stay in the safe, entry and a limited leak still happen", (entry) => {
    const o = run(entry, { tiered: true });
    expect(o.cutAt).toBe("keys");
    expect(o.cuts).toEqual(["keys"]);
    expect(o.reached).toEqual({ door: true, keys: false, backups: false, exfil: true, encrypt: false });
    expect(o.exfil).toBe("limited");
    expect(o.notes).toEqual(["tiered.cut"]);
  });
});

describe("offline or immutable backup", () => {
  it.each(ENTRIES)("%s alone: backups survive, the leak still happens", (entry) => {
    const o = run(entry, { backup: true });
    expect(o.cutAt).toBe("backups");
    expect(o.reached).toEqual({ door: true, keys: true, backups: false, exfil: true, encrypt: true });
    expect(o.exfil).toBe("all");
    expect(o.recoverable).toBe(true);
    expect(o.notes).toEqual(["backup.cut"]);
  });
});

describe("combinations", () => {
  it("MFA + pre-auth + backup: still breached, data still leaks, recovery possible", () => {
    const o = run("preauth", { mfa: true, backup: true });
    expect(o.reached.door).toBe(true);
    expect(o.reached.exfil).toBe(true);
    expect(o.recoverable).toBe(true);
    expect(o.notes).toEqual(["mfa.preauth", "backup.cut"]);
  });

  it("a door cut makes the downstream controls untested", () => {
    const o = run("password", { mfa: true, tiered: true, backup: true });
    expect(o.cuts).toEqual(["door"]);
    expect(o.notes).toEqual(["mfa.cut", "tiered.moot", "backup.moot"]);
  });

  it("tiered + backup: one bar at the keys, backup never tested", () => {
    const o = run("zeroday", { tiered: true, backup: true });
    expect(o.cuts).toEqual(["keys"]);
    expect(o.notes).toEqual(["tiered.cut", "backup.moot"]);
  });

  it("every switch on still lets a zero-day in", () => {
    const o = run("zeroday", { patch: 3, mfa: true, unused: true, tiered: true, backup: true });
    expect(o.reached.door).toBe(true);
    expect(o.exfil).toBe("limited");
    expect(o.notes).toHaveLength(5);
  });

  it("every combination yields one note per switched-on control and consistent reach", () => {
    for (const entry of ENTRIES)
      for (const patch of [0, ...PATCH_DAYS] as const)
        for (let bits = 0; bits < 16; bits++) {
          const c: Controls = {
            patch,
            mfa: Boolean(bits & 1),
            unused: Boolean(bits & 2),
            tiered: Boolean(bits & 4),
            backup: Boolean(bits & 8),
          };
          const o = evaluate(entry, c);
          const onCount = CONTROL_IDS.filter((k) => Boolean(c[k])).length;
          expect(o.notes).toHaveLength(onCount);
          // a stage is only reached if the one before it was
          if (!o.reached.door) expect(o.reached.keys).toBe(false);
          if (!o.reached.keys) expect(o.reached.backups || o.reached.encrypt).toBe(false);
          expect(o.reached.exfil).toBe(o.reached.door);
          expect(o.cutAt).toBe(o.cuts[0] ?? null);
          // URL round trip
          expect(fromQuery(toQuery({ entry, controls: c }))).toEqual({ entry, controls: c });
        }
  });
});

describe("plan state", () => {
  it("draws the full route and greys what is never walked", () => {
    expect(planState(run("password")).grey).toEqual([]);
    expect(planState(run("password")).show.split(" ")).toEqual(
      expect.arrayContaining(["door", "in", "bypass", "keys", "wiped", "out", "encrypt"]),
    );
    const door = planState(run("password", { mfa: true }));
    expect(door.grey).toEqual(["in", "toKeys", "toBackup", "out"]);
    expect(door.show).not.toMatch(/keys|wiped|encrypt|bypass/);
    const keys = planState(run("preauth", { tiered: true }));
    expect(keys.grey).toEqual(["toBackup", "out"]);
    expect(keys.limitedExfil).toBe(true);
    const backup = planState(run("preauth", { backup: true }));
    expect(backup.grey).toEqual([]);
    expect(backup.show.split(" ")).not.toContain("wiped");
    expect(backup.show.split(" ")).toContain("encrypt");
  });
});

describe("URL state", () => {
  it("restores the example from the design", () => {
    expect(fromQuery("?entry=preauth&mfa=1&backup=1")).toEqual({
      entry: "preauth",
      controls: { ...NO_CONTROLS, mfa: true, backup: true },
    });
  });

  it("falls back on junk", () => {
    expect(fromQuery("?entry=window&patch=7&mfa=yes")).toEqual({ entry: "password", controls: NO_CONTROLS });
    expect(fromQuery("")).toEqual({ entry: "password", controls: NO_CONTROLS });
  });

  it("writes only what is on", () => {
    expect(toQuery({ entry: "zeroday", controls: { ...NO_CONTROLS, patch: 14, tiered: true } })).toBe(
      "?entry=zeroday&patch=14&tiered=1",
    );
  });
});

describe("text", () => {
  it("every note has both languages, a station and no unfilled placeholder", () => {
    for (const id of Object.keys(NOTE_TEXT) as NoteId[]) {
      expect(NOTE_STATION[id]).toBeDefined();
      for (const lang of ["en", "ja"] as const) {
        expect(NOTE_TEXT[id][lang].length).toBeGreaterThan(0);
        expect(noteText(id, lang, { ...NO_CONTROLS, patch: 14 })).not.toContain("{");
      }
    }
    expect(noteText("patch.late", "en", { ...NO_CONTROLS, patch: 14 })).toContain("14-day");
  });

  it("the outcome summary reads the backup-only case honestly", () => {
    const rows = summaryRows(run("password", { backup: true }), "en");
    expect(rows.map((r) => [r.stage, r.bad])).toEqual([
      ["door", true],
      ["keys", true],
      ["backups", false],
      ["exfil", true],
      ["encrypt", true],
    ]);
    expect(rows.at(-1)?.value).toMatch(/restorable/);
  });
});
