import { describe, expect, it } from "vitest";
import { alternatePath, joinBase, langFromPath, localePath, stripBase, stripLocale } from "../../src/lib/paths";

const BASE = "/vpn-is-the-door/";

describe("paths", () => {
  it("joins the deploy base without doubling slashes", () => {
    expect(joinBase(BASE, "/")).toBe("/vpn-is-the-door/");
    expect(joinBase("/vpn-is-the-door", "deep/")).toBe("/vpn-is-the-door/deep/");
    expect(joinBase("/", "/ja/")).toBe("/ja/");
  });

  it("puts English at the root and Japanese under /ja/", () => {
    expect(localePath("en", "/", BASE)).toBe("/vpn-is-the-door/");
    expect(localePath("ja", "/", BASE)).toBe("/vpn-is-the-door/ja/");
    expect(localePath("ja", "/deep/after-the-door/", BASE)).toBe("/vpn-is-the-door/ja/deep/after-the-door/");
  });

  it("strips base and locale", () => {
    expect(stripBase("/vpn-is-the-door/ja/deep/", BASE)).toBe("/ja/deep/");
    expect(stripBase("/vpn-is-the-door", BASE)).toBe("/");
    expect(stripBase("/other/", BASE)).toBe("/other/");
    expect(stripLocale("/ja/deep/")).toBe("/deep/");
    expect(stripLocale("/ja")).toBe("/");
    expect(stripLocale("/japan/")).toBe("/japan/");
  });

  it("detects the language from the path", () => {
    expect(langFromPath("/ja/")).toBe("ja");
    expect(langFromPath("/ja")).toBe("ja");
    expect(langFromPath("/japan/")).toBe("en");
    expect(langFromPath("/")).toBe("en");
  });

  it("links each page to its other-language twin", () => {
    expect(alternatePath("/vpn-is-the-door/", BASE)).toEqual({ lang: "ja", href: "/vpn-is-the-door/ja/" });
    expect(alternatePath("/vpn-is-the-door/ja/deep/x/", BASE)).toEqual({
      lang: "en",
      href: "/vpn-is-the-door/deep/x/",
    });
  });
});
