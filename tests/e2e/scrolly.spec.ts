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

test.describe("show all steps", () => {
  test("#all-steps swaps the scrolly for a grid of seven plan states, and back", async ({ page }) => {
    await page.goto("after-the-door/");
    const views = page.locator("[data-route]");
    await expect(views).toHaveAttribute("data-view", "scroll");
    await page.getByRole("link", { name: "Show all steps" }).click();
    await expect(page).toHaveURL(/#all-steps$/);
    await expect(views).toHaveAttribute("data-view", "grid");
    const items = page.locator("#all-steps .sg-item");
    await expect(items).toHaveCount(7);
    await expect(page.locator(".scrolly-sticky")).toBeHidden();
    await expect(items.nth(0)).toContainText("Monday, 07:40");
    await expect(items.nth(6).locator(".plan")).toHaveAttribute("data-show", /\bencrypt\b/);
    await expect(items.nth(1).locator(".plan")).toHaveAttribute("data-show", "door");
    await page.getByRole("link", { name: "Back to the scrolling plan" }).click();
    await expect(views).toHaveAttribute("data-view", "scroll");
    await expect(page.locator(".scrolly-sticky")).toBeVisible();
  });

  test("the grid loads from its hash in Japanese, labels readable", async ({ page }) => {
    await page.goto("ja/after-the-door/#all-steps");
    await expect(page.locator("[data-route]")).toHaveAttribute("data-view", "grid");
    await expect(page.locator("#all-steps .sg-item").first()).toContainText("月曜日");
    const min = await page.evaluate(() => {
      let m = 99;
      for (const t of document.querySelectorAll<SVGTextElement>("#all-steps svg text")) {
        if (!t.getClientRects().length || !t.textContent?.trim()) continue;
        const k = t.getScreenCTM()?.a ?? 1;
        m = Math.min(m, Number.parseFloat(getComputedStyle(t).fontSize) * k);
      }
      return m;
    });
    expect(min).toBeGreaterThanOrEqual(14);
  });

  test("with motion paused on a phone the grid is the default", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript(() => localStorage.setItem("motion", "off"));
    await page.goto("after-the-door/");
    await expect(page.locator("[data-route]")).toHaveAttribute("data-view", "grid");
    await page.goto("after-the-door/#step-3");
    await expect(page.locator("[data-route]")).toHaveAttribute("data-view", "scroll");
  });

  test("reduced motion on a phone gets the grid", async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto(new URL("after-the-door/", test.info().project.use.baseURL).href);
    await expect(page.locator("[data-route]")).toHaveAttribute("data-view", "grid");
    await ctx.close();
  });
});

test.describe("scrolly keeps the VPN door label in view on phones", () => {
  for (const viewport of [
    { width: 360, height: 640 },
    { width: 390, height: 844 },
    { width: 412, height: 915 },
  ]) {
    test(`steps 4 and 7 at ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("after-the-door/");
      for (const n of [4, 7]) {
        await page.evaluate((n) => {
          const el = document.getElementById(`step-${n}`);
          if (!el) return;
          const r = el.getBoundingClientRect();
          window.scrollTo(0, r.top + window.scrollY + r.height / 2 - window.innerHeight * 0.6);
        }, n);
        await expect(page.locator(`#step-${n}`)).toHaveAttribute("data-active", "");
        await expect
          .poll(() =>
            page.evaluate(() => {
              const win = document.querySelector(".scrolly-win")?.getBoundingClientRect();
              const svg = [...document.querySelectorAll<SVGSVGElement>("[data-scrolly] .plan-svg")].find(
                (s) => getComputedStyle(s).display !== "none",
              );
              const labels = [...(svg?.querySelectorAll(".opening-vpn text") ?? [])].map((t) =>
                t.getBoundingClientRect(),
              );
              if (!win || labels.length === 0) return false;
              return labels.every(
                (b) => b.top >= win.top - 1 && b.bottom <= Math.min(win.bottom, window.innerHeight) + 1,
              );
            }),
          )
          .toBe(true);
      }
    });
  }
});
