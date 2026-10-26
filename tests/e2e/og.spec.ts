// Reads the built site from disk: every page's og:image must name a PNG that
// exists in dist and is 1200×630. Runs after `pnpm build` like the other e2e specs.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { expect, test } from "@playwright/test";

const DIST = process.env.DIST_DIR ?? join(import.meta.dirname, "..", "..", "dist");
const BASE = "/vpn-is-the-door/";

const htmlFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    if (e.isDirectory()) return e.name === "pagefind" || e.name === "_astro" ? [] : htmlFiles(p);
    return e.name.endsWith(".html") ? [p] : [];
  });

const meta = (html: string, attr: "property" | "name", key: string): string | undefined =>
  html.match(new RegExp(`<meta ${attr}="${key}" content="([^"]*)"`))?.[1];

// Width and height live in the IHDR chunk, bytes 16–23 of every PNG.
function pngSize(file: string): [number, number] {
  const b = readFileSync(file);
  expect(b.subarray(1, 4).toString("latin1")).toBe("PNG");
  return [b.readUInt32BE(16), b.readUInt32BE(20)];
}

test("every built page has a 1200×630 og:image that exists in dist", ({ browserName }, info) => {
  test.skip(info.project.name !== "desktop" || browserName !== "chromium", "file checks run once");
  const pages = htmlFiles(DIST);
  expect(pages.length).toBeGreaterThan(40);
  const problems: string[] = [];
  for (const file of pages) {
    const html = readFileSync(file, "utf8");
    const page = relative(DIST, file);
    const og = meta(html, "property", "og:image");
    if (!og) {
      problems.push(`${page}: no og:image`);
      continue;
    }
    const url = new URL(og);
    if (url.protocol !== "https:" || !url.pathname.startsWith(`${BASE}og/`)) problems.push(`${page}: ${og}`);
    if (meta(html, "name", "twitter:card") !== "summary_large_image") problems.push(`${page}: twitter:card`);
    if (meta(html, "name", "twitter:image") !== og) problems.push(`${page}: twitter:image differs`);
    if (meta(html, "property", "og:image:width") !== "1200" || meta(html, "property", "og:image:height") !== "630")
      problems.push(`${page}: og:image:width/height`);
    const png = join(DIST, url.pathname.slice(BASE.length));
    if (!existsSync(png)) {
      problems.push(`${page}: missing ${png}`);
      continue;
    }
    const [w, h] = pngSize(png);
    if (w !== 1200 || h !== 630) problems.push(`${page}: ${w}×${h}`);
  }
  expect(problems).toEqual([]);
});

test("English and Japanese pages get different cards", ({ browserName }, info) => {
  test.skip(info.project.name !== "desktop" || browserName !== "chromium", "file checks run once");
  const en = readFileSync(join(DIST, "the-doors", "index.html"), "utf8");
  const ja = readFileSync(join(DIST, "ja", "the-doors", "index.html"), "utf8");
  expect(meta(en, "property", "og:image")).toMatch(/\/og\/the-doors\.png$/);
  expect(meta(ja, "property", "og:image")).toMatch(/\/og\/ja\/the-doors\.png$/);
});
