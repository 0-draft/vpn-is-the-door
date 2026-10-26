import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

const BASE = "/vpn-is-the-door/";
const hrefs = (page: Page) =>
  page
    .locator("[data-search-results] [role=option]")
    .evaluateAll((els) => els.map((e) => e.getAttribute("data-href") ?? ""));

async function search(page: Page, q: string) {
  await page.locator("[data-search-input]").fill(q);
  await expect.poll(async () => (await hrefs(page)).length).toBeGreaterThan(0);
  return hrefs(page);
}

test.describe("search palette", () => {
  test("opens from the header button; an English query lists only English pages", async ({ page }) => {
    await page.goto("the-doors/");
    const dlg = page.locator("[data-search]");
    await expect(dlg).toBeHidden();
    await page.getByRole("button", { name: "Search" }).click();
    await expect(dlg).toBeVisible();
    await expect(page.locator("[data-search-input]")).toBeFocused();
    // "VPN" is on every page in both languages, so the filter has something to drop.
    const urls = await search(page, "VPN");
    expect(urls.every((u) => u.startsWith(BASE) && !u.startsWith(`${BASE}ja/`))).toBe(true);
  });

  test("a Japanese query lists only /ja/ pages", async ({ page }) => {
    await page.goto("ja/the-doors/");
    await page.getByRole("button", { name: "検索" }).click();
    for (const q of ["VPN", "侵入"]) {
      const urls = await search(page, q);
      expect(urls.every((u) => u.startsWith(`${BASE}ja/`))).toBe(true);
    }
  });

  test("keyboard: / and Ctrl-K open, arrows move, Enter follows, Escape closes", async ({ page }) => {
    await page.goto("");
    const dlg = page.locator("[data-search]");
    const input = page.locator("[data-search-input]");
    await page.locator("body").press("/");
    await expect(dlg).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dlg).toBeHidden();

    await page.keyboard.press("Control+k");
    await expect(dlg).toBeVisible();
    await search(page, "Citrix");
    // Escape with text in the field still closes (type=search would only clear it).
    await page.keyboard.press("Escape");
    await expect(dlg).toBeHidden();

    await page.keyboard.press("Control+k");
    await expect(input).toHaveValue("Citrix");
    await input.press("ArrowDown");
    const selected = page.locator("[data-search-results] [role=option][aria-selected=true]");
    await expect(selected).toHaveCount(1);
    await expect(input).toHaveAttribute("aria-activedescendant", "search-opt-0");
    await input.press("ArrowDown");
    await expect(input).toHaveAttribute("aria-activedescendant", "search-opt-1");
    await input.press("ArrowUp");
    const target = await selected.getAttribute("data-href");
    expect(target).toBeTruthy();
    await input.press("Enter");
    await expect(page).toHaveURL((u) => target !== null && u.pathname === target.split("#")[0]);
  });

  for (const path of ["", "ja/"]) {
    test(`no axe violations with the palette open and results shown: /${path}`, async ({ page }) => {
      await page.goto(path);
      await page.locator("[data-search-open]").click();
      await search(page, "VPN");
      await page.locator("[data-search-input]").press("ArrowDown");
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(", ")}`)).toEqual([]);
    });
  }
});
