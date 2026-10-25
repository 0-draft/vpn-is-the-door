import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PAGES = ["", "ja/"];

test.describe("home", () => {
  test("English is the default and links to Japanese", async ({ page }) => {
    await page.goto("");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("The door was the VPN");
    await page.getByRole("link", { name: /Switch to Japanese/ }).click();
    await expect(page).toHaveURL(/\/vpn-is-the-door\/ja\/$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "ja");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("扉はVPNだった");
  });

  test("the entry-point plan draws one square per case", async ({ page }) => {
    await page.goto("");
    const plan = page.locator(".plan svg:visible");
    await expect(plan).toHaveCount(1);
    await expect(plan.locator(".tally-vpn .unit")).toHaveCount(61);
    await expect(plan.locator(".tally-rdp .unit")).toHaveCount(19);
    await expect(plan.locator(".tally-other .unit")).toHaveCount(10);
    await expect(plan.locator(".tally-mail .unit")).toHaveCount(2);
  });

  test("theme toggle cycles and persists", async ({ page }) => {
    await page.goto("");
    const btn = page.locator("[data-theme-toggle]");
    await btn.click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await btn.click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
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
