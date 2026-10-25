# Brief: writing a part of vpn-is-the-door

Repo: `/Users/takumaniwa/vpn-is-the-door` (Astro 7 static site, GitHub Pages under `/vpn-is-the-door/`, English at `/`, Japanese at `/ja/`). The owner demands two things above all: it must be visually obvious ("視覚的にわかりやすく"), and it must not look or read as AI-generated or templated.

## Read first

- `research/design.md`: the decided design. Concept: a break-in investigation report with a floor plan. One fictional company, 港精密株式会社 / Minato Precision Co., Ltd. (280 staff, head office + factory). Depth is signalled by drawing scale: `S=1:500` executives, `S=1:100` IT managers, `S=1:5` engineers.
- Research (primary-sourced, with caveats you must respect): `research/stats.md`, `research/vulns.md` + `vulns.json`, `research/incidents.md` + `incidents.json`, `research/mechanics.md`, `research/glossary.json`. Anything marked UNVERIFIED there stays out of the site or is labelled as such.
- Existing pages to match in tone and structure: `src/views/Home.astro`, `src/content/chapters/{en,ja}/after-the-door.mdx`.

## Story order (do not change)

Home (stat + summary) → 1 Where they came in (the 2025 NPA statistic) → 2 After the door opens (what an intruder does) → 3 The doors (famous products and their vulnerabilities) → 4 Cases (recent real incidents) → 5 For engineers → 6 What to do. Each page starts plain for executives and goes deeper; the switch to the engineer layer is marked with `<SectionCut lang=".." />`.

## Building blocks (read the source for exact props)

- Page content is MDX: `src/content/chapters/{en,ja}/<slug>.mdx`, frontmatter `title`, `description` (≤220 chars, used as the lede), `chapter` (`where|after|doors|cases|engineering|what|sources|glossary`), `path` (e.g. `/where-they-came-in/`), optional `parent` (slug of the parent page, for sub-pages) and `order`. EN and JA files must have the same slug, path, sections and figures in the same order.
- Components (import with relative paths from the MDX file, e.g. `../../../components/Fig.astro`): `Summary` (boxed 要旨 at the top of every page, 2–4 short paragraphs or a list, includes the decision it implies), `Fig` (numbered figure with caption, `sources` ids, `composite`/`nts` tags, optional `slot="data"` table), `FloorPlan` (`mode="tally"|"route"`, `show` tokens, see `src/lib/plan.ts`, `src/lib/steps.ts`), `RouteBars`, `Scale` (`s="1:500"` etc., put it inside an `##` heading: `## <Scale s="1:100" /> Heading`), `SectionCut`, `IntruderRoute` + `Step`, `SourceLine`.
- Every number must cite a source id. Add the sources you need to your own file `src/data/sources/<your-chapter>.json` (schema: `src/data/source-schema.ts`; ids lowercase-hyphen; `title` verbatim in the original language; `locator` = page/sheet). Do not edit `core.json` or other agents' files; reuse ids already in `core.json`.
- Styles: tokens in `src/styles/global.css`. Hand-drawn SVG uses `<svg class="dg" viewBox=...>` and the classes there (`thick`, `thin`, `dash`, `chain`, `route`, `label`, `muted`, `mono`, `hot-text`, `safe-bar`, `safe-text`, `caution-tag`, `unit`, `unit hot`). Red (`--intruder`) means the intruder or something compromised and nothing else. Green only for a defense that holds. Yellow only as a filled tag with ink text. Blue only links/instructions. No other colours, no gradients, shadows, icons, emoji, rounded cards.
- SVG text must render at ≥14px: if a figure is wider than ~700 units, provide a second narrow layout or keep it simple enough to stay readable at 360px wide. Wide tables go in `<div class="table-scroll" tabindex="0">`. The page body must never scroll horizontally at 390px.
- Interactive figures: vanilla TypeScript in an Astro `<script>` (no React). Pure logic goes in `src/lib/<name>.ts` with unit tests in `tests/unit/<name>.test.ts`. State that matters gets a URL hash. Native controls only (`button`, `input`, `select`), visible focus, works with keyboard, respects `prefers-reduced-motion` and `:root[data-motion="off"]`.

## Writing rules

- English: plain, precise, short sentences, present tense, American spelling. No hype ("seamless", "robust", "crucial", "leverage", "delve", "landscape", "in today's world"), no "In this chapter we will…", no closing paragraph that repeats the page, no rhetorical questions as headings ("What is a VPN?"), no ALL-CAPS headings, no emoji, no exclamation marks, no fear copy ("You could be next").
- Japanese: natural technical Japanese, だ・である調, written for Japanese readers (not a translation of the English). Short sentences. No 「〜することが重要です」「〜と言えるでしょう」「いかがでしたか」 filler, no 体言止め chains, no excessive カタカナ when a Japanese word exists. Numbers and units: `61件`, `66.3%`, `2025年`.
- Headings state a finding or an object ("Backups go first", "受付は気づかない"), not a topic label ("Overview", "概要").
- Prose explains the figure; every `##` section carries a visual (figure, plan state, table or annotated specimen). Executive sections: one idea each, concrete, with the business consequence. Engineer sections: real identifiers (log names, ATT&CK IDs, advisory IDs, CVE IDs, config concepts) with a link to the advisory.
- Safety: describe vulnerability classes conceptually. No exploit code, payloads, request paths that trigger a bug, or step-by-step attack instructions. Defang hostnames. Do not name a real organisation for anything the research did not confirm from its own statement or an official report. Neutral, no blame.
- Honesty: say "the report says", "NPA counted", "UNVERIFIED" where needed. The composite company is labelled as fictional in every figure where it appears (`composite` prop).

## MDX gotchas

- `{` `}` and `<` in prose must be escaped or put in inline code. SVG attributes inside MDX must be kebab-case (`stroke-dasharray`, `text-anchor`, `font-size`), use `class`, not `className`.
- Components need `lang="en"` / `lang="ja"` passed explicitly.
- Straight quotes in text nodes become curly; that is fine.

## Verify (all must pass before you report)

Use your own dev server for looking at pages; do not run `pnpm build` (another agent may be building, it overwrites `dist/`).

```bash
cd /Users/takumaniwa/vpn-is-the-door
pnpm exec astro dev --port <YOUR_PORT> --host 127.0.0.1   # background; stop it when done
pnpm exec astro check
pnpm exec biome check --write <your files> && pnpm exec biome ci <your files>
pnpm exec vitest run tests/unit/<your tests>
node scripts/validate-data.ts
```

Screenshots: `SEL=<css selector> node scripts/shot.ts <scratch dir> http://127.0.0.1:<YOUR_PORT>/vpn-is-the-door/ <path> ja/<path>` writes desktop (1280) and phone (390) PNGs, plus one PNG per matching element. Look at every figure at both widths in both languages and fix overlaps, clipped labels, text under 14px, and anything that does not match the text. Commands that write inside the repo need the sandbox disabled.

Do not edit files you do not own (listed in your task). If a shared component blocks you, describe the change you need in your final reply instead of editing it. Do not commit or push; the owner of the session does that.

Final reply: files written, figures added (with one line on what each shows), sources added, and anything in the research you found wrong or could not use.
