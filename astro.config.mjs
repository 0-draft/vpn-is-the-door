// @ts-check
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import bizUdpGothicSubset from "./scripts/font-subset.ts";

// GitHub Pages project site: https://0-draft.github.io/vpn-is-the-door/
export default defineConfig({
  site: process.env.SITE_URL ?? "https://0-draft.github.io",
  base: process.env.BASE_PATH ?? "/vpn-is-the-door",
  trailingSlash: "always",
  integrations: [
    mdx(),
    sitemap({
      i18n: { defaultLocale: "en", locales: { en: "en", ja: "ja" } },
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
