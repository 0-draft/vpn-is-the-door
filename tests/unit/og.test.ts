import { describe, expect, it } from "vitest";
import { OG_H, OG_W, renderCard, titleSize } from "../../src/components/og/card";
import { covers, fontsFor, parseRanges, subsetsFor } from "../../src/components/og/fonts";
import { chapterMeta, ogImagePath, ogSlug } from "../../src/components/og/pages";

describe("ogSlug", () => {
  it("maps page paths under the base to one file name each", () => {
    const b = "/vpn-is-the-door/";
    expect(ogSlug("/vpn-is-the-door/", b)).toBe("index");
    expect(ogSlug("/vpn-is-the-door/ja/", b)).toBe("ja/index");
    expect(ogSlug("/vpn-is-the-door/the-doors/", b)).toBe("the-doors");
    expect(ogSlug("/vpn-is-the-door/ja/cases/nagoya-port/", b)).toBe("ja/cases/nagoya-port");
    expect(ogSlug("/vpn-is-the-door/404.html", b)).toBe("404");
    expect(ogSlug("/vpn-is-the-door/404/", b)).toBe("404");
    expect(ogImagePath("/vpn-is-the-door/ja/", b)).toBe("/vpn-is-the-door/og/ja/index.png");
    expect(ogImagePath("/where-they-came-in/", "/")).toBe("/og/where-they-came-in.png");
  });
});

describe("chapterMeta", () => {
  it("labels chapters with their number and scales", () => {
    expect(chapterMeta("en", "doors")).toEqual({ label: "Chapter 3", scales: ["1:100", "1:5"] });
    expect(chapterMeta("ja", "engineering", "技術者向け")).toEqual({ label: "第5章 · 技術者向け", scales: ["1:5"] });
    expect(chapterMeta("ja", "home").scales).toEqual(["1:500"]);
    expect(chapterMeta("en", "glossary")).toEqual({ label: "Glossary", scales: [] });
  });
});

describe("fonts", () => {
  it("parses unicode-range lists", () => {
    const r = parseRanges("U+0000-00FF, U+0131,U+2000-206F");
    expect(covers(r, 0x41)).toBe(true);
    expect(covers(r, 0x131)).toBe(true);
    expect(covers(r, 0x132)).toBe(false);
  });

  it("loads only the BIZ UDPGothic chunks the text needs", () => {
    expect(subsetsFor("abc")).toContain("latin");
    expect(subsetsFor("abc")).not.toContain("0");
    const ja = subsetsFor("扉はVPNだった");
    expect(ja.length).toBeGreaterThan(0);
    expect(ja.length).toBeLessThan(10);
    expect(fontsFor("abc").fonts.every((f) => f.data.length > 1000)).toBe(true);
  });
});

describe("renderCard", () => {
  it("renders a 1200×630 PNG with Japanese text", async () => {
    const png = await renderCard({
      lang: "ja",
      title: "認証前に開いている面",
      label: "第5章",
      scales: ["1:5"],
      siteTitle: "扉はVPNだった",
      report: "VITD-2026 · 改訂 1",
      vpnLabel: "VPN機器",
      vpnPct: "66.3%",
      roomLabels: { office: "事務室", server: "サーバ室", backup: "バックアップ", reception: "受付" },
      nts: "縮尺なし",
      url: "example.org/ja/",
    });
    expect(png.subarray(1, 4).toString("latin1")).toBe("PNG");
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([OG_W, OG_H]);
  }, 60_000); // satori + resvg on a shared CI runner can take well over 5 s

  it("shrinks long titles", () => {
    expect(titleSize("en", "Cases")).toBeGreaterThan(titleSize("en", "x".repeat(60)));
    expect(titleSize("ja", "事例")).toBeGreaterThan(titleSize("ja", "あ".repeat(30)));
  });
});
