import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PAGES = ["the-doors/", "ja/the-doors/"];

test.describe("door schedule", () => {
  test("lists every row and selects CitrixBleed from its hash", async ({ page }) => {
    await page.goto("the-doors/#cve-2023-4966");
    const ex = page.locator("[data-explorer]");
    await expect(ex.locator("tr.ex-row")).toHaveCount(31);
    const row = ex.locator("#cve-2023-4966");
    await expect(row).toHaveAttribute("data-selected", "");
    await expect(row.locator(".ex-pick")).toHaveAttribute("aria-pressed", "true");
    const svg = ex.locator("svg.door");
    await expect(svg).toHaveAttribute("data-hot", "intercom keys");
    await expect(svg).toHaveAttribute("data-skip", "1");
    await expect(ex.locator("#rec-cve-2023-4966")).toBeVisible();
    await expect(ex.locator("#rec-cve-2024-3400")).toBeHidden();
    await expect(row.getByRole("link", { name: "NVD" })).toHaveAttribute(
      "href",
      "https://nvd.nist.gov/vuln/detail/CVE-2023-4966",
    );
  });

  test("row selection updates the drawing and the hash", async ({ page }) => {
    await page.goto("the-doors/");
    const ex = page.locator("[data-explorer]");
    await ex.locator("#cve-2023-20269 .ex-pick").click();
    await expect(page).toHaveURL(/#cve-2023-20269$/);
    const svg = ex.locator("svg.door");
    await expect(svg).toHaveAttribute("data-hot", "lock");
    await expect(svg).not.toHaveAttribute("data-skip", "1");
    await expect(ex.locator("#rec-cve-2023-20269")).toBeVisible();
  });

  test("keyboard: Enter on a row button selects it", async ({ page }) => {
    await page.goto("the-doors/");
    const btn = page.locator("#cve-2024-3400 .ex-pick");
    await btn.focus();
    await page.keyboard.press("Enter");
    await expect(btn).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("[data-explorer] svg.door")).toHaveAttribute("data-hot", "intercom frame");
  });

  test("filters by product, pre-auth and patch", async ({ page }) => {
    await page.goto("the-doors/");
    const ex = page.locator("[data-explorer]");
    const visible = ex.locator("tr.ex-row:visible");
    await ex.locator('button[data-product="citrix"]').click();
    await expect(visible).toHaveCount(7);
    await expect(ex.locator("[data-count]")).toHaveText("Showing 7 of 31");
    await ex.locator('button[data-product="all"]').click();
    await ex.locator('[data-filter="preauth"]').check();
    await expect(visible).toHaveCount(29);
    await ex.locator('[data-filter="patch"]').check();
    const n = await visible.count();
    expect(n).toBeGreaterThan(0);
    for (const r of await visible.all()) await expect(r).toHaveAttribute("data-patch", "0");
  });

  test("a link to a row the filters hide clears the filters and shows it", async ({ page }) => {
    await page.goto("the-doors/");
    const ex = page.locator("[data-explorer]");
    await ex.locator('[data-filter="preauth"]').check();
    await expect(page.locator("#cve-2024-21887")).toBeHidden();
    await page.evaluate(() => {
      location.hash = "#cve-2024-21887";
    });
    await expect(page.locator("#cve-2024-21887")).toBeVisible();
    await expect(page.locator("#cve-2024-21887")).toHaveAttribute("data-selected", "");
    await expect(ex.locator('[data-filter="preauth"]')).not.toBeChecked();
    await expect(ex.locator("[data-count]")).toHaveText("Showing 31 of 31");
  });

  test("Japanese page shows KEV Unknown as 不明, never as no", async ({ page }) => {
    await page.goto("ja/the-doors/");
    const row = page.locator("#cve-2025-6543");
    await expect(row).toContainText("ランサムウェア: 不明");
  });
});

for (const path of PAGES) {
  test(`no horizontal scroll and no axe violations: /${path}`, async ({ page }) => {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(", ")}`)).toEqual([]);
  });

  test(`dark theme passes axe: /${path}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });
}

test.describe("door schedule drawing follows the selection below 70em", () => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 820, height: 1180 },
  ]) {
    test(`a row far down shows the drawing next to it at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("the-doors/");
      const ex = page.locator("[data-explorer]");
      const row = ex.locator("tr.ex-row").last();
      await row.locator(".ex-pick").click();
      await expect(row).toHaveAttribute("data-selected", "");
      const svg = ex.locator("svg.door");
      await expect(svg).toBeInViewport({ ratio: 0.9 });
      await expect(row).toBeInViewport();
      // the drawing sits inside the selected record, not at the top of the explorer
      await expect(ex.locator(`#rec-${await row.getAttribute("id")} svg.door`)).toHaveCount(1);
    });
  }

  test("desktop keeps the drawing in its sticky column", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("the-doors/");
    const ex = page.locator("[data-explorer]");
    const row = ex.locator("tr.ex-row").last();
    await row.locator(".ex-pick").click();
    await expect(ex.locator(".ex-fig svg.door")).toHaveCount(1);
    await expect(ex.locator("svg.door")).toBeInViewport({ ratio: 0.9 });
  });
});
