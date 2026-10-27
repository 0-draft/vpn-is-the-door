// @ts-check
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import bizUdpGothicSubset from "./scripts/font-subset.ts";
import { stripBase, stripLocale } from "./src/lib/paths.ts";
import { lastModified } from "./src/lib/seo.ts";

// GitHub Pages project site: https://0-draft.github.io/vpn-is-the-door/
const site = process.env.SITE_URL ?? "https://0-draft.github.io";
const base = process.env.BASE_PATH ?? "/vpn-is-the-door";

// Sitemap lastmod: the newest revision that touched the page (src/data/revisions.ts),
// the same date as the page's revision list and its JSON-LD dateModified.
/** @param {string} url */
const lastmod = (url) => lastModified(stripLocale(stripBase(new URL(url).pathname, base)));

export default defineConfig({
  site,
  base,
  trailingSlash: "always",
  integrations: [
    mdx(),
    sitemap({
      i18n: { defaultLocale: "en", locales: { en: "en", ja: "ja" } },
      serialize: (item) => ({ ...item, lastmod: lastmod(item.url) }),
    }),
    bizUdpGothicSubset(),
  ],
  markdown: {
    shikiConfig: {
      themes: { light: "github-light-high-contrast", dark: "github-dark-high-contrast" },
    },
  },
  prefetch: { defaultStrategy: "hover" },
});
