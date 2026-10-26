import { describe, expect, it } from "vitest";
import { LATEST, REVISIONS } from "../../src/data/revisions";
import { SITE } from "../../src/i18n/ui";

describe("revision history", () => {
  it("is newest first with consecutive numbers and ordered dates", () => {
    for (let i = 1; i < REVISIONS.length; i++) {
      const newer = REVISIONS[i - 1]!;
      const older = REVISIONS[i]!;
      expect(newer.rev).toBe(older.rev + 1);
      expect(newer.date >= older.date).toBe(true);
    }
    expect(REVISIONS.at(-1)?.rev).toBe(1);
  });

  it("drives the header and footer", () => {
    expect(SITE.revision).toBe(LATEST.rev);
    expect(SITE.updated).toBe(LATEST.date);
  });
});
