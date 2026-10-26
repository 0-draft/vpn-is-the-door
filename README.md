# The door was the VPN

**English** | [日本語](README.ja.md)

In 2025, 61 of the 92 Japanese ransomware victims that could say how the attacker got in named their VPN appliance. Email accounted for two. This site explains why, drawn as a break-in investigation report about one fictional company, and is written for the executive who reads the first page and the engineer who reads the last.

**Read it:** <https://0-draft.github.io/vpn-is-the-door/> (日本語: <https://0-draft.github.io/vpn-is-the-door/ja/>)

## How it is put together

The company is Minato Precision Co., Ltd. (港精密株式会社), 280 staff, drawn as an architectural floor plan. The VPN appliance is a door in the outer wall that lets staff in without passing reception. Every chapter returns to the same drawing.

Depth is marked the way drawings mark it, by scale:

| Scale | Reader | What changes |
| --- | --- | --- |
| `S=1:500` | Executives | The building and its openings. Plain words, one decision per section. |
| `S=1:100` | IT managers | Rooms, the intruder's route, what the IT team would see. |
| `S=1:5` | Engineers | The door cut open. Real component names, ATT&CK IDs, advisories, logs. |

The chapters follow the order of an incident:

| # | Chapter | Content |
| --- | --- | --- |
| 0 | Summary | The statistic drawn on the building, one square per case, and the three decisions that belong to leadership. |
| 1 | Where they came in | What the National Police Agency counted, each opening in turn, 2021–2025. |
| 2 | After the door opens | A scroll-driven plan of the route from the door to encryption, the timing, and one hospital's report mapped onto it. |
| 3 | The doors | The products, the door detail drawing, and a filterable schedule of 31 KEV-listed vulnerabilities. |
| 4 | Cases | Incidents where the organization itself said how the attacker got in, each as a short report with a sequence-of-events table. |
| 5 | For engineers | What is reachable before login, why a patch does not close the door, what evidence survives a reboot. |
| 6 | What to do | Actions by owner, and a sandbox where each control cuts the route only at the point where it works. |

## What every number rests on

- NPA statistics are taken from the National Police Agency's own statistical workbooks (`*_jousei_data.xlsx`), cited by sheet name. Percentages are computed in one place (`src/data/stats.ts`) and unit-tested against NPA's published roundings.
- Vulnerabilities were checked field by field against the CISA Known Exploited Vulnerabilities catalog (version 2026.10.23). KEV's "Unknown" ransomware flag is shown as unknown, never as "no".
- Incidents come only from the organization's own statements or official investigation reports. Where an organization said "network device" without naming a VPN, the site says "network device".
- Minato Precision is fictional and labelled as a composite wherever it appears. It is never mixed into a real case.
- Anything the research could not confirm from a primary source is left out. The working notes, including what was excluded and why, are in [`research/`](research/).

No exploit code, payloads or attack steps appear anywhere. Vulnerability classes are described conceptually and link to the vendor advisory.

## Development

Requires Node.js 24+ and pnpm 12.

```bash
pnpm install
pnpm dev                 # http://localhost:4321/vpn-is-the-door/
pnpm build               # static site in dist/, OG images in dist/og/, then the Pagefind index in dist/pagefind/
pnpm preview             # serves dist/ under /vpn-is-the-door/ like GitHub Pages
pnpm lint                # Biome
pnpm check               # astro check
pnpm test                # Vitest (data, geometry, interaction logic)
pnpm test:e2e            # Playwright + axe on desktop and mobile (run pnpm build first)
pnpm validate:data       # sources, references, EN/JA text checks
pnpm perf                # Lighthouse (mobile, median of 3) against budgets (run pnpm build first)
```

| Path | Contents |
| --- | --- |
| `src/content/chapters/{en,ja}/` | Chapter text (MDX). English and Japanese share slugs, sections and figures. |
| `src/data/` | Statistics, vulnerabilities, cases, glossary, and `sources/*.json`, the bibliography every figure cites. |
| `src/lib/plan.ts` | Floor-plan geometry in two hand-placed layouts (desktop, phone). A unit test checks that the intruder route crosses walls only at doorways. |
| `src/components/` | The plan, the scrolly, the door schedule, the sandbox, and the figure/source primitives. |
| `research/` | Source research and the design decision behind the site. |

## CI and deployment

`.github/workflows/ci.yml` runs Biome, markdownlint, `astro check`, Vitest with coverage, the data validator, `pnpm audit`, dependency review on pull requests, the build, Playwright with axe in light and dark themes on desktop and mobile, an offline link check that also verifies `#fragments`, Lighthouse on five pages (performance ≥ 0.9, accessibility 1, CLS ≤ 0.05, a transfer budget per page), and actionlint + zizmor on the workflows. The Japanese font is subset at build time to the characters the site uses, one file per language and weight; the build fails if a page needs a glyph the subset lacks. CodeQL runs on every push and weekly. Dependabot proposes npm and Actions updates every Monday with a seven-day cooldown. `kev-drift.yml` compares the door schedule with the live KEV catalog every Monday and keeps one issue open when a listed row changed or new remote-access entries need research; rows are never added automatically. All actions are pinned by commit SHA. pnpm refuses any package release younger than two days (`minimumReleaseAge` in `pnpm-workspace.yaml`), and the Lighthouse job runs a pinned Chrome for Testing build.

A push to `main` deploys to GitHub Pages only after every check passes.

## Corrections

If a number, date or attribution is wrong, open an issue with the source that shows it. Corrections are recorded in the revision history on the [Sources and method](https://0-draft.github.io/vpn-is-the-door/sources/) page.

## License

Text and figures: [CC BY 4.0](LICENSE-CONTENT). Code: [MIT](LICENSE). Data from the sources keeps its original terms.

This is an independent explainer. It is not affiliated with any vendor or with the National Police Agency, and it recommends no product.
