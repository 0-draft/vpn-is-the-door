// Dev helper: screenshot pages at desktop and phone widths.
// node scripts/shot.ts <outDir> <baseUrl> <path> [path...]   (env THEME=dark for dark mode)
import { mkdirSync } from "node:fs";
import { chromium } from "@playwright/test";

const [outDir, baseUrl, ...paths] = process.argv.slice(2);
if (!outDir || !baseUrl || paths.length === 0) throw new Error("usage: shot.ts <outDir> <baseUrl> <path>...");
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
for (const [name, width, height] of [
  ["desktop", 1280, 900],
  ["phone", 390, 844],
] as const) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    colorScheme: process.env.THEME === "dark" ? "dark" : "light",
  });
  const page = await ctx.newPage();
  for (const p of paths) {
    await page.goto(new URL(p.replace(/^\//, ""), baseUrl).href, { waitUntil: "networkidle" });
    const slug = p.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "") || "home";
    await page.screenshot({ path: `${outDir}/${slug}-${name}.png`, fullPage: true });
    // SEL=<css>: also capture each matching element on its own
    if (process.env.SEL) {
      const els = page.locator(process.env.SEL);
      const n = await els.count();
      for (let i = 0; i < n; i++) {
        const el = els.nth(i);
        if (await el.isVisible()) await el.screenshot({ path: `${outDir}/${slug}-${name}-el${i}.png` });
      }
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 0) console.log(`horizontal overflow ${overflow}px on ${p} (${name})`);
  }
  await ctx.close();
}
await browser.close();
