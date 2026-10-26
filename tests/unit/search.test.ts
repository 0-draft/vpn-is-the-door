import { describe, expect, it } from "vitest";
import { countLabel, inLang, isKind, pageKind } from "../../src/components/search/results";

describe("pageKind", () => {
  it("classifies pages for the search chip", () => {
    expect(pageKind("home", "/")).toBe("summary");
    expect(pageKind("glossary", "/glossary/")).toBe("glossary");
    expect(pageKind("sources", "/sources/")).toBe("sources");
    expect(pageKind("cases", "/cases/")).toBe("chapter");
    expect(pageKind("cases", "/cases/nagoya-port/")).toBe("case");
    expect(pageKind("doors", "/the-doors/")).toBe("chapter");
  });

  it("only accepts known kinds from index metadata", () => {
    expect(isKind("case")).toBe(true);
    expect(isKind("api")).toBe(false);
    expect(isKind(undefined)).toBe(false);
  });
});

describe("inLang", () => {
  const b = "/vpn-is-the-door/";
  it("keeps results in the reader's language", () => {
    expect(inLang("/vpn-is-the-door/the-doors/", "en", b)).toBe(true);
    expect(inLang("/vpn-is-the-door/ja/the-doors/", "en", b)).toBe(false);
    expect(inLang("/vpn-is-the-door/ja/", "ja", b)).toBe(true);
    expect(inLang("/vpn-is-the-door/", "ja", b)).toBe(false);
    expect(inLang("/ja/x/", "ja", "/")).toBe(true);
    expect(inLang("/japan/", "ja", "/")).toBe(false);
  });
});

it("formats the result count", () => {
  expect(countLabel(1, "1 result", "{n} results")).toBe("1 result");
  expect(countLabel(7, "1 result", "{n} results")).toBe("7 results");
});
