import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const sandbox = (page: import("@playwright/test").Page) => page.locator("[data-sandbox]");

test.describe("chapter 6: close the door", () => {
  test("the full route runs with no controls", async ({ page }) => {
    await page.goto("what-to-do/");
    await expect(sandbox(page)).toHaveAttribute("data-cut", "");
    await expect(sandbox(page).locator('[data-stage="door"]')).toHaveAttribute("data-bad", "true");
    await expect(sandbox(page).locator('[data-stage="encrypt"] dd')).toHaveText("Company-wide, no way back");
  });

  test("MFA stops a stolen password at the door and writes the URL", async ({ page }) => {
    await page.goto("what-to-do/");
    await page.getByLabel("MFA on the VPN").check();
    await expect(sandbox(page)).toHaveAttribute("data-cut", "door");
    await expect(sandbox(page).locator(".sb-ov svg:visible .sb-bar-door")).toHaveCSS("opacity", "1");
    await expect(page).toHaveURL(/\?entry=password&mfa=1/);
    await expect(sandbox(page).locator('[data-stage="exfil"] dd')).toHaveText("None");
  });

  test("MFA does nothing against a pre-auth flaw; state restores from the URL", async ({ page }) => {
    await page.goto("what-to-do/?entry=preauth&mfa=1&backup=1");
    await expect(page.getByRole("radio", { name: /Pre-auth vulnerability exploited from day 5/ })).toBeChecked();
    await expect(page.getByLabel("MFA on the VPN")).toBeChecked();
    await expect(sandbox(page)).toHaveAttribute("data-cut", "backups");
    await expect(sandbox(page).locator('[data-stage="door"]')).toHaveAttribute("data-bad", "true");
    await expect(sandbox(page).locator('[data-stage="exfil"]')).toHaveAttribute("data-bad", "true");
    await expect(sandbox(page).locator("[data-sb-notes]")).toContainText("MFA is never asked");
  });

  test("keyboard: the patch deadline works without a pointer", async ({ page }) => {
    await page.goto("what-to-do/?entry=preauth");
    await page.locator("#sb-patch").focus();
    await page.keyboard.press("Space");
    await expect(page.locator("#sb-patch")).toBeChecked();
    await expect(sandbox(page)).toHaveAttribute("data-cut", "");
    await page.locator('select[name="days"]').selectOption("3");
    await expect(sandbox(page)).toHaveAttribute("data-cut", "door");
    await expect(page).toHaveURL(/patch=3/);
  });

  test("Japanese page has the same figure", async ({ page }) => {
    await page.goto("ja/what-to-do/?entry=zeroday&patch=3");
    await expect(sandbox(page)).toHaveAttribute("data-cut", "");
    await expect(sandbox(page).locator("[data-sb-notes]")).toContainText("修正版はなかった");
  });

  for (const path of ["what-to-do/?entry=password&tiered=1", "ja/what-to-do/"]) {
    test(`no horizontal scroll and no axe violations: /${path}`, async ({ page }) => {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(", ")}`)).toEqual([]);
    });
  }
});
