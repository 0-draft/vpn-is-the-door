import { readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Every built page, so a new chapter is covered without writing a spec for it.
function pages(dir: string, root = dir): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) return pages(p, root);
    return f === "index.html" ? [`${relative(root, dir)}/`.replace(/^\/$/, "")] : [];
  });
}

const ALL = pages("dist").sort();

test("dist has both languages", () => {
  expect(ALL.length).toBeGreaterThan(40);
  expect(ALL.filter((p) => p.startsWith("ja/")).length).toBe(ALL.filter((p) => !p.startsWith("ja/")).length);
});

for (const path of ALL) {
  test(`page sweep: /${path}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    await page.goto(path);
    await expect(page.locator("h1")).toHaveCount(1);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, "horizontal scroll").toBeLessThanOrEqual(0);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(", ")}`)).toEqual([]);
    expect(errors).toEqual([]);
  });
}
