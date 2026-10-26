import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const CORE = ["npa-r7-data", "npa-r7-en", "npa-r8h1-data", "npa-leaflet-r7", "cisa-kev"];

for (const prefix of ["", "ja/"]) {
  test.describe(`reference pages /${prefix}`, () => {
    test("sources lists the core sources with unique anchors", async ({ page }) => {
      await page.goto(`${prefix}sources/`);
      for (const id of CORE) await expect(page.locator(`#src-${id}`)).toHaveCount(1);
      const ids = await page.locator('[id^="src-"]').evaluateAll((els) => els.map((e) => e.id));
      expect(ids.length).toBeGreaterThanOrEqual(CORE.length);
      expect(new Set(ids).size).toBe(ids.length);
      await expect(page.locator("#src-cisa-kev a")).toHaveAttribute("href", /^https:\/\//);
      await expect(page.locator("#rev-1")).toContainText("2026-10-25");
    });

    test("glossary has an anchor per term", async ({ page }) => {
      await page.goto(`${prefix}glossary/`);
      for (const id of ["vpn", "vpn-appliance", "session-token", "credential", "integrity-checker", "ioc", "kev"])
        await expect(page.locator(`#term-${id} dfn`)).toHaveCount(1);
      const ids = await page.locator('[id^="term-"]').evaluateAll((els) => els.map((e) => e.id));
      expect(new Set(ids).size).toBe(ids.length);
      const cite = page.locator("#term-rdp a.cite");
      await expect(cite).toHaveAttribute("href", /\/sources\/#src-npa-r7-data$/);
    });

    for (const path of ["sources/", "glossary/"]) {
      test(`no horizontal scroll and no axe violations: ${path}`, async ({ page }) => {
        await page.goto(`${prefix}${path}`);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow).toBeLessThanOrEqual(0);
        const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
        expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(", ")}`)).toEqual([]);
      });
    }
  });
}

test("glossary is alphabetical in English and in 五十音 order in Japanese", async ({ page }) => {
  await page.goto("glossary/");
  await expect(page.locator(".entry").first()).toHaveAttribute("id", "term-active-directory");
  await page.goto("ja/glossary/");
  await expect(page.locator(".entry").first()).toHaveAttribute("id", "term-rdp");
});

test("404 links to both home pages", async ({ page }) => {
  const res = await page.goto("no-such-page/");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Page not found");
  const en = page.getByRole("link", { name: "Go to the English summary" });
  const ja = page.getByRole("link", { name: "日本語の要旨へ" });
  await expect(en).toHaveAttribute("href", /\/vpn-is-the-door\/$/);
  await expect(ja).toHaveAttribute("href", /\/vpn-is-the-door\/ja\/$/);
  await ja.click();
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
});
