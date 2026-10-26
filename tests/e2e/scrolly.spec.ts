import { expect, test } from "@playwright/test";

test.describe("chapter 2 scrolly", () => {
  test("#step-n deep link sets the plan to that step", async ({ page }) => {
    await page.goto("after-the-door/#step-4");
    const plan = page.locator("[data-scrolly] .plan");
    await expect(plan).toHaveAttribute("data-show", /\bkeys\b/);
    await expect(plan).not.toHaveAttribute("data-show", /\bencrypt\b/);
  });

  test("scrolling to the last step reaches encryption, and back snaps to earlier states", async ({ page }) => {
    await page.goto("after-the-door/");
    const plan = page.locator("[data-scrolly] .plan");
    await page.locator("#step-7").scrollIntoViewIfNeeded();
    await page.evaluate(() => {
      const el = document.getElementById("step-7");
      if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.5);
    });
    await expect(plan).toHaveAttribute("data-show", /\bencrypt\b/);
    await page.evaluate(() => {
      const el = document.getElementById("step-2");
      if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.5);
    });
    await expect(plan).toHaveAttribute("data-show", "door");
  });

  test("the scrolly plan is not announced twice", async ({ page }) => {
    await page.goto("after-the-door/");
    for (const svg of await page.locator("[data-scrolly] .plan svg").all()) {
      await expect(svg).toHaveAttribute("aria-hidden", "true");
    }
  });
});
