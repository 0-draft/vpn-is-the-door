import { ROOM_LABEL } from "../../i18n/plan";
// One 1200×630 Open Graph PNG per page and language, rendered at build time.
// Base.astro points og:image at /og/<ogSlug(path)>.png; tests/e2e/og.spec.ts
// checks that every built page's image exists and has that size.

import { getCollection } from "astro:content";
import type { APIRoute, GetStaticPaths } from "astro";
import { renderCard } from "../../components/og/card";
import { chapterMeta, type OgPage, ogSlug } from "../../components/og/pages";
import { CASES } from "../../data/cases";
import { latest, pct } from "../../data/stats";
import { SITE, t } from "../../i18n/ui";
import { LANGS, type Lang, localePath } from "../../lib/paths";

async function pages(): Promise<OgPage[]> {
  const out: OgPage[] = [];
  const add = (lang: Lang, path: string, title: string, chapter: string, parentTitle?: string) =>
    out.push({ slug: ogSlug(localePath(lang, path)), lang, title, ...chapterMeta(lang, chapter, parentTitle) });

  const entries = await getCollection("chapters");
  const casesIndex: Partial<Record<Lang, string>> = {};
  for (const lang of LANGS) {
    add(lang, "/", t(lang, "site.title"), "home");
    add(lang, "/glossary/", t(lang, "nav.glossary"), "glossary");
    add(lang, "/sources/", t(lang, "nav.sources"), "sources");
    const mine = entries.filter((e) => e.id.startsWith(`${lang}/`));
    for (const e of mine) {
      const parent = e.data.parent ? mine.find((p) => p.id === `${lang}/${e.data.parent}`) : undefined;
      add(lang, e.data.path, e.data.title, e.data.chapter, parent?.data.title);
      if (e.data.path === "/cases/") casesIndex[lang] = e.data.title;
    }
    for (const c of CASES) add(lang, `/cases/${c.slug}/`, c.org[lang], "cases", casesIndex[lang]);
  }
  // The bilingual 404 page.
  out.push({ slug: "404", lang: "en", title: "Page not found · ページが見つからない", label: "404", scales: [] });
  return out;
}

const siteUrl = (lang: Lang) => {
  const u = new URL(localePath(lang, "/", import.meta.env.BASE_URL), import.meta.env.SITE);
  return `${u.host}${u.pathname}`;
};

export const getStaticPaths = (async () =>
  (await pages()).map((p) => ({ params: { slug: p.slug }, props: { page: p } }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const { lang, title, label, scales } = (props as { page: OgPage }).page;
  const y = latest();
  const png = await renderCard({
    lang,
    title,
    label,
    scales,
    siteTitle: t(lang, "site.title"),
    report: `${SITE.report} · ${t(lang, "site.rev")} ${SITE.revision}`,
    vpnLabel: t(lang, "og.vpn"),
    vpnPct: `${pct(y.counts.vpn ?? 0, y.n)}%`,
    roomLabels: {
      office: ROOM_LABEL.office[lang],
      server: ROOM_LABEL.server[lang],
      backup: ROOM_LABEL.backup[lang],
      reception: ROOM_LABEL.reception[lang],
    },
    nts: t(lang, "og.nts"),
    url: siteUrl(lang),
  });
  return new Response(new Uint8Array(png), { headers: { "content-type": "image/png" } });
};
