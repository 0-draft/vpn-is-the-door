import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import cases from "../../src/data/cases.json" with { type: "json" };

const SLUGS = cases.map((c) => c.slug);

for (const prefix of ["", "ja/"]) {
  test.describe(`cases index /${prefix}cases/`, () => {
    test("draws one block per case and lists every case once", async ({ page }) => {
      await page.goto(`${prefix}cases/`);
      await expect(page.locator(".cm-grid li")).toHaveCount(SLUGS.length);
      await expect(page.locator(".cm-grid svg.cb")).toHaveCount(SLUGS.length);
      await expect(page.locator("table.ci th.ci-org")).toHaveCount(SLUGS.length);
      // an undisclosed device is never drawn as a door
      const unspecified = page.locator('svg.cb[data-opening="network-device-unspecified"]');
      await expect(unspecified.locator(".cb-leaf")).toHaveCount(0);
      await expect(unspecified.locator(".caution-tag")).toHaveCount(
        cases.filter((c) => c.opening === "network-device-unspecified").length,
      );
    });

    test("no horizontal scroll and no axe violations", async ({ page }) => {
      await page.goto(`${prefix}cases/`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(", ")}`)).toEqual([]);
    });
  });

  for (const slug of SLUGS) {
    test(`case page /${prefix}cases/${slug}/`, async ({ page }) => {
      await page.goto(`${prefix}cases/${slug}/`);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator(".ch-kicker a")).toHaveAttribute("href", new RegExp(`/${prefix}cases/$`));
      await expect(page.locator(".ch-nav")).toHaveCount(0);
      const c = cases.find((x) => x.slug === slug);
      await expect(page.locator("table.ev tbody tr")).toHaveCount(c?.events.length ?? -1);
      await expect(page.locator("figure svg.cb")).toHaveCount(1);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
}

test("a case page passes axe in both themes", async ({ page }) => {
  for (const scheme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto("ja/cases/anabuki/");
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  }
});
