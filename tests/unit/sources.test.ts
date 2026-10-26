import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { SOURCES, source } from "../../src/data/sources";

const DIR = "src/data/sources";
const onDisk = readdirSync(DIR)
  .filter((f) => f.endsWith(".json"))
  .flatMap((f) => JSON.parse(readFileSync(join(DIR, f), "utf8")) as { id: string }[]);

describe("sources registry", () => {
  it("loads every source file", () => {
    expect(SOURCES.length).toBe(onDisk.length);
  });

  it("has unique ids", () => {
    expect(new Set(SOURCES.map((s) => s.id)).size).toBe(SOURCES.length);
  });

  it("looks up by id and rejects unknown ids", () => {
    expect(source("npa-r7-data").publisher.en).toBe("National Police Agency");
    expect(() => source("nope")).toThrow();
  });
});
