# vpn-is-the-door: design decision

Status: decided (research pass, 2026-10-25). One concept, no menu. Everything below is meant to be implementable without follow-up questions; items that still need a fact check are collected in the last section.

## 0. Decision in one paragraph

The site is a **break-in investigation report with a floor plan**: the genre of a police 実況見分調書 with its 見取図 and of a JTSB / NTSB accident report, applied to one company that got ransomware through its VPN. The company is drawn as an architectural floor plan (JIS A 0150 conventions). The VPN appliance is a door in the outer wall. The 2025 NPA statistic is drawn *on the building* as tallies stacked outside each opening (door = VPN, window = RDP, reception = mail, other). The reader goes deeper by **zooming the drawing scale**: S=1:500 site summary for executives, S=1:100 floor plan for IT managers, S=1:5 detail drawing of the door itself for engineers, where the building metaphor dissolves into the real components (sslvpnd, `/remote/...`, session cookies). The deepening boundary is drawn as a section-cut line (A–A).

## 1. References studied

Fetched in this pass unless marked. The technique column is the one thing worth taking, not a summary.

| Reference | What I actually read | Technique to steal |
|---|---|---|
| [Nikkei Visual Data: JAL機炎上、そのとき何が](https://vdata.nikkei.com/newsgraphics/haneda-runway-collision/) | Full text via reader | Timestamp beats as the spine (`午後5時43分02秒` in prose, `17:43:02` in the table), relative anchors ("衝突の2分前", "その3秒後"), a 4-column transcript table (time / speaker / content / situation), question-form subheads in the analysis section ("なぜ…？"), hedged reconstruction language (可能性が高い / 否定できない), and a closing methodology section. This is the template for every incident page. |
| [Nikkei: 日本を狙うサイバー攻撃](https://vdata.nikkei.com/newsgraphics/barchart-race-cyber-attack/) | Full text via reader | A method note up front that defines the measured thing narrowly ("origin = last hop, not nationality"). We do the same for "侵入経路が判明した事案 n=92". Date-stamped section heads (`2016/9 中国からが2割`): headline states the finding, not the topic. |
| [Washington Post: The anatomy of a ransomware attack (2021)](https://www.washingtonpost.com/technology/2021/07/09/how-ransomware-attack-works/) | Text via reader (graphics not visible) | A persistent chapter strip ("The Hackers / The Hack / The Negotiation / The Payment / The Aftermath") repeated at the top of each chapter, and one real incident anchoring each chapter (Colonial's ransom note "just before 5 a.m. on May 7" as a cold open). |
| [FT: Can you negotiate your way out of a ransomware attack?](https://ig.ft.com/ransomware-game/) + [launch thread](https://threadreaderapp.com/thread/1572437647204970496.html) | Landing + thread only; game itself not fetchable | Put the executive in the role ("you are the CEO… seven days… $1.7mn"). We borrow the second-person framing for the counterfactual figure, not the game format. |
| [Bloomberg: corporate hacks graphic](https://www.bloomberg.com/graphics/corporate-hacks-cyber-attacks/index.html) | Text via reader | Fixed labelled fields per incident ("Target: / Attacker: / Date of attack: / Why it's noteworthy:"). Our incident index uses fixed fields: 組織 / 侵入口 / 製品・CVE / 判明日 / 影響 / 出典. |
| [Bloomberg: Colonial breached via one VPN password](https://www.bloomberg.com/news/articles/2021-06-04/hackers-breached-colonial-pipeline-using-compromised-password) | Search summary | The single-sentence cause an executive remembers ("a VPN account no longer in use, no MFA"). Every incident page leads with one such sentence. |
| [Tailscale: How NAT traversal works](https://tailscale.com/blog/how-nat-traversal-works) | Full text | One obstacle per section, each solved before the next is added; consistent placeholder identities across the whole piece (2.2.2.2, 7.7.7.7); a "for nerds" appendix so the main line stays readable. We use one fictional company everywhere and park depth in S=1:5 sections. |
| [tls13.xargs.org](https://tls13.xargs.org/) | Full text | Every claim is reproducible next to the value it explains (commands sit beside the bytes). Our S=1:5 sections put the literal request path, log line or config key next to the sentence that explains it, with a pinned source link. |
| [Bartosz Ciechanowski: Mechanical Watch](https://ciechanow.ski/mechanical-watch/) | Full text | One control per figure, figure placed right after the sentence that introduces it, part names in prose colour-matched to the figure, parts shown floating before being assembled, a global "pause all animations" control near the top. |
| [samwho: Load balancing](https://samwho.dev/load-balancing/) | Full text | Show the failure first, then the fix, under identical parameters; play / pause / reset under each simulation; colour shifts encode waiting without numbers. |
| [Nicky Case: How I make an explorable explanation](https://blog.ncase.me/how-i-make-an-explorable-explanation/) | Full text | "BUT / THEREFORE" chaining between sections, start concrete, end in a sandbox. Our last chapter ends with the counterfactual plan the reader can operate. ([explorabl.es](https://explorabl.es/) for the "learn by playing" framing; ncase.me/trust did not render in the fetcher.) |
| [The Pudding: Storytelling](https://pudding.cool/process/how-to-make-dope-shit-part-3/) | Full text | Simple finding → open with the sledgehammer stat; complex finding → open with one person/case. We do the stat on Home and a case at the top of chapter 2. "One point, one chart" per section; always ship a method section. |
| [The Pudding: Responsive scrollytelling](https://pudding.cool/process/responsive-scrollytelling/) | Full text | Scroll only where the transition means something; no click-steppers or swipe; step heights in px from `window.innerHeight`, not `vh`; keep the number of steps small; replace hover with fixed labels on touch. |
| [Krebs on Security](https://krebsonsecurity.com/) | Home + latest post | Evidence discipline: captioned screenshots, defanged domains (`example[.]com`), named sources vs "sources say", dated updates appended to the post. We adopt defanging and an appended 改訂履歴 per page. |
| [NTSB AAR-20/01 report](https://www.ntsb.gov/investigations/AccidentReports/Reports/AAR2001.pdf) | PDF pages 1–4 | Front matter order: Abstract → Executive Summary → Probable Cause → Findings → Recommendations, *then* 1. Factual Information (1.1, 1.2…). Executives get the whole answer before the evidence. Report number + adopted date block top-right. |
| [JTSB report structure](https://jtsb.mlit.go.jp/aircraft/rep-acci/AA2020-1-2-JA200G.pdf) (search summary of AA2020-1 / AA2009-7) | Search result excerpts | Japanese chapter set 1 経過 / 2 事実情報 / 3 分析 / 4 結論 / 5 再発防止策, and the preface line that the report is "not for assigning blame". We use the same chapter words on incident pages and a no-blame line. |
| [NPA: アンケート調査結果及び対策 leaflet (令和8年1月)](https://www.npa.go.jp/bureau/cyber/pdf/R7countermeasures_leaflet.pdf) | PDF page 1 rendered | Primary data (H1 2025: VPN機器 62.2%, RDP 22.2%; 52% of VPN users unpatched; 39.8% ID+password only). Also the **counter-example**: gradient banners, four donuts, red-everything emphasis. We redraw the same data as unit charts and plain bars. |
| [NPA 住まいる防犯110番: 侵入窃盗の侵入口](https://www.npa.go.jp/safetylife/seianki26/theme_a/a_d_1_main.html) | Full text | Police already rank burglary by 侵入口 (窓 / 表出入口 / その他出入口). Borrow the exact word 侵入口 and the ranked-openings framing for the hero figure. |
| [JIS A 0150 建築製図通則](https://kikakurui.com/a0/A0150-1999-01.html) (via search excerpt) | Search excerpt of §13.3 | A hinged door is drawn as a leaf at 90° with a quarter arc (or 30° without arc); thick vs thin solid lines. Gives the plan real drawing grammar instead of clip-art. |
| [JIS Z 9103:2018 safety colours: recommended values](https://safetycolor.jp/shiteichi/) + [Wikipedia JIS安全色](https://ja.wikipedia.org/wiki/JIS%E5%AE%89%E5%85%A8%E8%89%B2) | Full text | 2018 universal-design values (赤 #FF4B00, 黄 #F2E700, 緑 #00B06B, 青 #1971FF) and meanings (赤 = 禁止・危険・停止, 黄 = 注意警告, 緑 = 安全状態, 青 = 指示). Used as semantic anchors, darkened for text contrast. |
| [JIS Z 8210 案内用図記号](https://kikakurui.com/z8/Z8210-2020-01.html) (search only) | Not read in full | Only the principle: pictograms are a black figure on a field, one meaning each. We do not reuse JIS pictograms (licensing + they would read as signage clip-art). |
| [デジタル庁デザインシステム: Typography](https://design.digital.go.jp/foundations/typography/) | Full text | 16 CSS px floor for body/UI, 14 px absolute minimum, body line-height 1.7–1.75, headings 1.4–1.5, letter-spacing 0.02em at body sizes, unitless line-height in CSS. |
| [Morisawa: BIZ UD on Google Fonts](https://en.morisawa.co.jp/about/news/6772) + [repo](https://github.com/googlefonts/morisawa-biz-ud-gothic) | Search summary | UD gothic validated by end-user readability testing, OFL, proportional (P) and full-width kana variants. |
| [Public Sans (USWDS)](https://github.com/uswds/public-sans) | README | Fork of Libre Franklin (Franklin Gothic lineage = newspaper-graphics sans), neutral, tabular figures for data, OFL. Caveat: the project is no longer maintained (v2.001 frozen). |
| [Cloudflare Learning: What is a VPN?](https://www.cloudflare.com/learning/access-management/what-is-a-vpn/) | Text via reader | **Counter-example.** SEO question-H2s ("What is a VPN?", "How does a VPN work?"), a summary box, generic diagrams, product CTA at the end. Readable, forgettable. We never title a section with a definitional question. |
| Darknet Diaries ([home](https://darknetdiaries.com/)) | Home text only; visuals not extractable | Only the tagline discipline ("True stories from the dark side of the Internet"): the site says what it is in one line. Visual style not verified, nothing borrowed. |
| Stripe Press, Linear changelog, Increase ([press.stripe.com](https://press.stripe.com/), [linear.app/changelog](https://linear.app/changelog), [increase.com](https://increase.com/)) | Text only; styling not extractable | Avoid-list only (see §11). Stripe Press: object-craft is great for books, wrong register for an incident. Linear: product-screenshot hero + dark gradient feed = the SaaS default this site must not resemble. |
| NHK ransomware special ([2021 プリンターが止まらない](https://news.web.nhk/news/special/sci_cul/2021/11/special/ransomcrisis)) | Lead only (body behind NHK ONE gate) | Cold open on a physical scene ("プリンターから、突如、大量の紙が出てきた。止まらない。") before any term is defined. Chapter 2 opens on a physical scene the same way. |

Not found / not verifiable in this pass (do not cite these as influences): a NYT SolarWinds interactive, a Reuters Graphics ransomware piece, a Bloomberg Colonial Pipeline *graphic*, an Asahi デジタル特集 on ransomware, and a Nikkei Visual Data ransomware piece. Searches returned only articles or nothing. Paywalled graphics (WaPo, FT) were read as text only, so nothing here depends on how they look.

## 2. Relationship to athenz-man: share the rules, diverge on the surface

The sibling ([design-direction.md](/Users/takumaniwa/.claude/skills/oss-visual-explainer/references/design-direction.md)) is a mechanical drawing set with a title block, LINE Seed JP + IBM Plex Mono and a crimson #C8241B. It serves engineers looking up an API.

**Share (house rules):** line weight carries meaning (thick = main path, thin = labels, dashed = async/out-of-band, chain = boundary), real identifiers in deep sections, motion only when it encodes a change of state, JIS semantic colours, 16px floor, URL hash per state, Esc closes, no scroll-entrance animation, Pagefind command palette (reuse it, restyle only).

**Diverge (surface):** different document genre (investigation report + architectural plan, no title block), different typefaces (Public Sans + BIZ UDPGothic + Atkinson Hyperlegible Mono), different red (JIS 2018 vermilion, not crimson), and a scroll-driven narrative where athenz-man is a reference manual. Someone who sees both should read them as siblings by method, not as the same template.

## 3. Concept: 侵入事案調査報告書 / Break-in investigation report

- **Genre:** a published investigation report. Report-number block top-right on every page (`VITD-2026-01 · 改訂 3 · 2026-11-02`), real dates, real revision history at the foot of each page. No fake "CONFIDENTIAL" stamps.
- **Subject:** one fictional but typical company used everywhere: **港精密株式会社 / Minato Precision Co., Ltd.**, a 280-person parts maker with one head office and one factory, i.e. the SME profile that makes up most victims. Its head office floor plan is the anchor figure for chapters 1–3. Real incidents (chapter 4) are real and sourced; the fictional company is never mixed into a real incident.
- **Metaphor contract:** the building is the company network; the outer wall is the internet edge; openings in the wall are the ways in; the VPN appliance is a door built *so that staff can get in from outside without passing reception*. That last clause is the whole argument for executives and must be drawn, not just said: reception (mail/web filtering) sits at the main entrance, and the VPN door opens into the corridor behind it.
- **Depth = drawing scale.** Three levels, signalled the way drawings signal them (`S=1:500`, `S=1:100`, `S=1:5`):
  - S=1:500 配置図 (site plan): the company as one block with its openings. Executive layer. Plain words, no product names beyond "VPN".
  - S=1:100 平面図 (floor plan): rooms, the intruder's route, what is taken where. IT manager layer. Terms appear with one-line glosses (Active Directory = 鍵の保管庫).
  - S=1:5 詳細図 (detail): the door itself, cut open. Engineer layer. The metaphor labels are replaced by real component names and literal artifacts.
- **Why not reuse the drawing-set concept as is:** this story's audience starts with executives, and its subject is a physical-feeling event (someone walked in). A floor plan with a door is understood by anyone in one second; a title-blocked API sheet is not.

## 4. Signature visuals

### 4.1 侵入口図 (point-of-entry plan) on Home: the statistic drawn on the building

What it is: an SVG floor plan of 港精密 head office at S=1:100 styling, marked `NTS / 縮尺なし` (honest: schematic). Outside the outer wall, at each opening, a stack of unit squares, one square per case with a known route.

- Openings and counts (full-year 2025, n=92; see §13 for verification): VPN door 61, RDP window 19, other 10, reception (mail) 2.
- Unit squares: 10×10 px, 2 px gap, columns of 10 growing outward from the wall, perpendicular to it. VPN squares filled `--intruder`; others filled `--ink-2` at 100% (not tints of red: only the VPN is the story).
- Direct labels at the end of each stack, two lines: `VPN機器 61件` / `66.3%` (EN: `VPN appliance 61` / `66.3%`). No legend.
- Under the plan, one sentence and a source line: `出典: 警察庁「令和7年におけるサイバー空間をめぐる脅威の情勢等について」（2026年3月）。侵入経路が判明した92件。`
- A small multiples strip below it: VPN share by year as five dots on one line (2021–2025), each labelled, y-axis 0–100%. No line chart smoothing, no area fill.
- The hero numeral `66.3%` is set once, large, beside the plan (desktop) or above it (mobile). It is the only display-size number on the site.

Static by default. Hover/focus on a stack shows nothing new; all labels are always visible (Pudding: replace hover with fixed labels).

### 4.2 侵入経路図 (intruder route), chapter 2: the sticky scrolly

The same plan, now at S=1:100 with rooms named. Sticky on the right (desktop, plan column 58% width) or top (mobile, plan height = `min(innerHeight × 0.5, 420px)`), step text scrolls past. Seven steps, each a URL hash (`#step-1` … `#step-7`), each a circled station number on the plan in police 見取図 style (①②③).

| Step | Plan state change | Text (exec voice, one short paragraph) |
|---|---|---|
| 1 `#step-1` | Neutral plan. Rooms: 受付 (reception, mail filter), 事務室 (PCs), 情報システム室 with 鍵保管庫 (Active Directory), サーバ室 (file server), 書庫 (backup NAS), 工場への連絡通路 (to OT). VPN door closed. | Cold open on a physical scene (NHK technique): Monday 07:40, the printer in 事務室 will not stop printing ransom notes. Then rewind. |
| 2 `#step-2` | VPN door swings 0°→90° (arc draws). Station ① at the door. | They did not break a window. They used the door built for staff. |
| 3 `#step-3` | Red dashed route ①→② enters the corridor behind reception. Reception gets a thin `--caution` outline label: `ここを通らない` / `bypasses reception`. | Why mail filtering and antivirus at the entrance never saw them. |
| 4 `#step-4` | Route ②→③ into 情報システム室. 鍵保管庫 fills `--intruder-tint`; every interior door symbol on the plan flips from closed (leaf in wall line) to open (leaf at 90°), one after another, 60 ms apart. | Taking the master keys (domain admin) opens every inner door at once. |
| 5 `#step-5` | Route ③→④ to 書庫. Backup NAS gets cross-hatch (45°, 1.5 px, 6 px pitch) and label `削除` / `wiped`. | Backups are removed before anything is encrypted. |
| 6 `#step-6` | Route ④→①: a box glyph with `xxx GB` travels back out the same door. | Data leaves through the same door, before encryption (double extortion: 136 of 153 cases where the method was known, per NPA, verify). |
| 7 `#step-7` | All rooms except corridors get hatch + tint. A clock glyph at the door stops. Station labels show elapsed time T+0 … T+n from a cited real case. | Encryption is the last step, not the attack. Everything that mattered happened at steps 2–6. |

Rules: the route is drawn progressively with `stroke-dashoffset` (600 ms per segment, `ease-out`); scrolling back reverses state instantly (no reverse animation). Timestamps on stations are **only** shown when they come from a cited incident report; otherwise stations show order only. Below 720 px width the same seven states are also rendered as seven static small plans if `prefers-reduced-motion: reduce` or the user hits the page-level 「動きを止める / Pause motion」 toggle.

### 4.3 扉の詳細図 (door detail) and 建具表 (door schedule), chapter 3

Transition into chapter 3 is a section-cut line across the bottom of the plan: a chain line with `A` arrowheads at both ends and the label `A–A 断面へ / to section A–A`. The next figure is the door cut open at S=1:5.

Parts of the door, each a labelled region with a leader line; the metaphor name is the primary label at the top of the chapter and the real component name replaces it in the S=1:5 subsections:

| Region on drawing | Metaphor label | Real component (S=1:5 label) |
|---|---|---|
| Intercom panel on the outside face | インターホン / intercom | Pre-auth web portal: login page, static assets, language files, SAML endpoints, anything reachable before authentication |
| Lock cylinder | 錠 / lock | Authentication: password, MFA, SAML/RADIUS |
| Key ring hanging inside | 合鍵 / issued keys | Session cookies / tokens issued after login |
| Frame and hinges | 枠と蝶番 / frame and hinges | The appliance OS and daemons (e.g. sslvpnd), management interface, filesystem |
| Camera above the door | 防犯カメラ / camera | Appliance logs (often local, rotated, or wiped) |

The single most important idea for executives in this chapter, drawn as one arrow: **a pre-auth flaw goes through the intercom straight to the frame, so the lock (MFA) is never consulted.** In the figure the route bypasses the lock cylinder in a curve; the lock stays drawn intact and labelled `MFA: 素通り / not reached`.

The 建具表 (door schedule) is a table styled as an architectural fittings schedule: door marks `SD-1` … `SD-5` (SD = steel door, the real drawing abbreviation), one row group per product (FortiGate SSL-VPN, Ivanti Connect Secure, Citrix NetScaler, Palo Alto GlobalProtect, SonicWall SSL-VPN), one row per famous vulnerability. Columns: 記号 / 製品 / CVE / 壊れる部位 (which region in the detail drawing) / 認証前? (yes/no) / 攻撃者が得るもの / KEV 登録日 / パッチだけで閉まるか. See §8.3 for the interaction.

### 4.4 経過表 (sequence-of-events table), chapter 4 incident pages

Each real incident is a short report using the JTSB chapter words (1 概要 / 2 事実情報 / 3 分析 / 4 結論 / 5 再発防止策) with NTSB ordering (summary and probable cause first). The 経過表 copies the Nikkei Haneda transcript table: columns 時刻 / 主体 / 出来事 / 出典. Times in `YYYY-MM-DD HH:MM` with tabular figures; relative anchors in prose ("侵入から9日後"). Each incident page also gets a 1:500 site block showing only which opening was used, so the reader sees the same door on every case.

## 5. Information architecture

English at `/`, Japanese at `/ja/` with identical slugs. Persistent chapter strip (WaPo technique) at the top of every chapter page, current chapter in ink, others in `--ink-3`, each with its scale tag.

| # | Path | Title (EN / JA) | Scale layers present | Content |
|---|---|---|---|---|
| 0 | `/` | The door is the VPN / 扉はVPNだった | 1:500 | Report cover block, 要旨 (5 sentences: finding, why, what to decide), 侵入口図 (§4.1), 66.3% numeral, year strip, 目次 (contents list in NTSB style with dotted leaders and chapter scale tags). An executive who reads only this page has the answer and the three decisions. |
| 1 | `/where-they-came-in/` | Where they came in / 侵入口 | 1:500 → 1:100 | Method note (what n=92 means, what "判明" excludes), the four openings explained one per section (Tailscale: one obstacle per section), H1 2025 vs full-year numbers, 2021–2025 series, company-size breakdown. |
| 2 | `/after-the-door/` | After the door opens / 扉が開いた後 | 1:100 | §4.2 scrolly; then one stacked section per step with the real technique name in a gloss line (initial access, credential theft, lateral movement, backup deletion, exfiltration, encryption). |
| 3 | `/the-doors/` | The doors / 建具表 | 1:100 → 1:5 | Why these appliances are attractive (internet-facing, pre-auth surface, run as root, poor logging, long patch lag), §4.3 detail drawing, 建具表 with all CVE rows. Section-cut line marks the start of S=1:5. |
| 4 | `/cases/` and `/cases/<slug>/` | Cases / 事例 | 1:500 + 1:100 | Index table with fixed fields (Bloomberg). Each case page per §4.4. Candidate cases, all to be sourced: Colonial Pipeline 2021 (VPN account no longer in use; MFA status to verify), 半田病院 2021, 大阪急性期・総合医療センター 2022 (via a contractor's VPN appliance), 名古屋港 2023, plus 2025 Japanese cases where the route is officially stated. |
| 5 | `/engineering/` | For engineers / 技術者向け | 1:5 | Sub-pages: `pre-auth-surface/` (what is reachable before login, how to enumerate it on your own device), `patching-is-not-closing/` (credential reset, session invalidation, integrity check, persistence surviving upgrades), `evidence/` (what logs exist on each appliance, how to preserve them before reboot). |
| 6 | `/what-to-do/` | What to do / 再発防止策 | 1:500 / 1:100 / 1:5 | Three blocks in this order: 経営者が決めること (budget, ownership, replacement), 情報システム担当がやること, 技術者が確認すること. Ends with the §8.2 counterfactual plan. |
| 7 | `/sources/` | Sources and method / 出典と方法 | — | Every number with its document, page, date; definitions; what is a composite; revision history. |

Deepening signals, all of them, so nobody has to guess what level they are on:

1. Scale tag left of every H2: `S=1:500`, `S=1:100`, `S=1:5` in mono 14px, `--ink-3`, with a 1 px box. The tag is also in the chapter strip and in the 目次.
2. Section-cut divider before the first S=1:5 section of any page: full-width chain line (`stroke-dasharray: 12 3 2 3`), `A` arrowheads at both ends, label right-aligned: `ここから技術者向け: 断面 A–A` / `Engineers from here: section A–A`. Executives are told explicitly that stopping here is fine.
3. In S=1:5 sections, literal artifacts appear (mono), and metaphor labels in figures are replaced by component names. Prose stays proportional.
4. Each chapter opens with a boxed 要旨 / Summary (NTSB executive summary): 3–5 sentences, includes the decision it implies.

## 6. Typography

All families are on Google Fonts (verified via the CSS2 API in this pass). Self-host the woff2 files (Astro `public/fonts/`) with `font-display: swap`; subset BIZ UDPGothic per page with the JP glyphs actually used if bundle size matters (it is about 4 MB per weight unsubsetted).

| Role | EN pages | JA pages |
|---|---|---|
| Headings + body + UI | **Public Sans** (variable 100–900) | **BIZ UDPGothic** 400 / 700 |
| Numerals in figures, stats, tables | Public Sans with `font-variant-numeric: tabular-nums lining-nums` | Same: Public Sans for digits via a `.num` class (do not mix fonts inside running Japanese prose) |
| Literal artifacts (CVE IDs, paths, log lines, config keys, versions) | **Atkinson Hyperlegible Mono** 400 / 600, fallback **BIZ UDGothic** (full-width kana) for Japanese inside logs | Same |

Rationale: Public Sans is a Franklin Gothic descendant (the newspaper-graphics sans) built for government documents with tabular figures; BIZ UDPGothic is a readability-tested UD gothic of the kind used in Japanese public documents. Both are gothic: no Mincho anywhere, per the owner. Atkinson Hyperlegible Mono is built for character disambiguation (0/O, 1/l/I), which matters for CVE IDs and paths. Risk: Public Sans is no longer maintained; it is stable and OFL, so pin the files. If `tnum` turns out missing in the Google Fonts build, take the OTF/woff2 from the uswds/public-sans v2.001 release instead.

Font stacks:

```css
--font-en: "Public Sans", "BIZ UDPGothic", system-ui, sans-serif;
--font-ja: "BIZ UDPGothic", "Public Sans", sans-serif;
--font-mono: "Atkinson Hyperlegible Mono", "BIZ UDGothic", ui-monospace, monospace;
```

Scale (desktop / mobile ≤ 720px). Line-heights unitless. JA values follow the Digital Agency spec (16px floor, body 1.7–1.75, headings 1.4–1.5, 0.02em tracking at body sizes).

| Token | EN | JA |
|---|---|---|
| `display` (66.3% only) | Public Sans 800, `clamp(72px, 14vw, 168px)` / 0.95, tracking −0.02em, tabular | same font and size (numeral only) |
| `h1` | 800, 46 / 34 px, lh 1.12 | 700, 38 / 28 px, lh 1.4 |
| `h2` | 750, 30 / 25 px, lh 1.2 | 700, 28 / 23 px, lh 1.45 |
| `h3` | 700, 21 / 19 px, lh 1.3 | 700, 20 / 18 px, lh 1.5 |
| `body` | 400, 18 / 17 px, lh 1.6, measure 66ch | 400, 17 / 16 px, lh 1.8, tracking 0.02em, measure 38em (≈38字) |
| `lede` (要旨 box) | 400, 21 / 19 px, lh 1.5 | 400, 19 / 17 px, lh 1.75 |
| `caption` / figure source | 400, 15 px, lh 1.5 | 400, 15 px, lh 1.6 |
| `label` (in SVG, at 1× render) | 500, 14 px | 400/700, 14 px |
| `mono` | 0.9em of context, lh 1.5 | same |
| `tag` (scale tag, report number) | mono 14 px | mono 14 px |

Nothing below 14px anywhere (Digital Agency absolute minimum), including SVG labels. SVG labels must be sized in CSS px at the rendered width: if the plan scales down on mobile, switch to the mobile label set rather than letting text shrink below 14px.

## 7. Palette

Neutral report paper (cool, not cream), ink, and the JIS 2018 safety colours with fixed meanings. Exactly one saturated colour dominates any figure: intruder red. JIS signage hexes (`#FF4B00`, `#F2E700`, `#00B06B`, `#1971FF`) are used as **fills with ink outlines/labels**; strokes and text use the darkened variants.

| Token | Semantics | Light | Dark |
|---|---|---|---|
| `--paper` | page background | `#F4F5F3` | `#101214` |
| `--sheet` | report body, figure ground | `#FFFFFF` | `#171A1D` |
| `--ink` | text, walls in light mode | `#17191C` | `#E9EBED` |
| `--ink-2` | secondary text, non-VPN unit squares | `#4A5058` | `#AEB4BA` |
| `--ink-3` | captions, tags, inactive chapter strip | `#5E656D` | `#8E959C` |
| `--line` | meaningful thin rules, leaders, furniture | `#80878F` | `#6E767E` |
| `--hair` | dividers, grid (decorative only) | `#D3D7DA` | `#2B3034` |
| `--room` | room floor fill | `#ECEEEF` | `#1F2327` |
| `--wall` | wall poché | `#23272B` | `#C9CED3` |
| `--intruder` | 赤 = 危険 / 侵入: route, compromised, VPN tally (strokes, small marks) | `#E03A00` | `#FF5A1F` |
| `--intruder-fill` | JIS 赤 fill for large areas, always with ink edge | `#FF4B00` | `#FF5A1F` |
| `--intruder-tint` | encrypted/compromised room fill (under hatch) | `#FFE9DF` | `#3A1A10` |
| `--intruder-text` | red text (labels like 削除) | `#C2340A` | `#FF7A4D` |
| `--caution` | 黄 = 注意: unpatched / exposed. Fill only, black text on it, never yellow text or yellow strokes | `#F2E700` | `#F2E700` |
| `--safe` | 緑 = 安全状態: a defense that holds, route cut | fill `#00B06B`, stroke/text `#00764A` | `#2FC488` / text `#45D198` |
| `--instruct` | 青 = 指示: links, "what to do" markers | fill `#1971FF`, text/link `#1757C9` | `#5C95FF` / link `#86AFFF` |
| `--marker` | search hit / hash-target highlight | `#FFF6B0` | `rgba(242,231,0,.16)` |

Rules: red never means "important", only "the intruder / compromised". Green appears only in chapter 6 and the counterfactual figure. Blue is links and instructions only, never decoration. Yellow appears only as a filled tag (`未適用 / unpatched`, `露出 / exposed`) with ink text and a 1 px ink border.

## 8. Interaction patterns (build these three, nothing else)

### 8.1 Intruder route scrolly (chapter 2)

Specified in §4.2. Implementation: vanilla island, IntersectionObserver on step elements (threshold 0.5), state = integer 0–7, applied by toggling `data-step` on the SVG root and letting CSS drive visibility. Step element min-height = `round(innerHeight × 0.85)` px set in JS on load/resize (not `vh`). Keyboard: steps are real headings in the DOM, so Tab/scroll both work; `#step-n` deep-links set state and scroll. A "すべての段階を見る / Show all steps" link swaps to the static seven-frame grid.

### 8.2 Counterfactual plan: 扉を閉める / Close the door (end of chapter 6, the sandbox)

Same plan, full route drawn. Five switches (real `<input type="checkbox">` with labels), each mapped to the station where it actually stops the route, and only there:

| Switch | Stops the route at | Does **not** stop | Note shown when toggled |
|---|---|---|---|
| 公開から X 日以内にパッチ / Patch within X days (select: 3 / 14 / 60) | ① only if the case's exploit date is after the patch window | stolen credentials already exfiltrated before patching | "パッチ前に盗まれた認証情報は、パッチ後も有効" |
| VPN に多要素認証 / MFA on the VPN | ① for credential-reuse entry | pre-auth exploit (route curves around the lock, as in §4.3), stolen session tokens | "認証前の欠陥は錠を通らない" |
| 使っていないアカウントの削除 / Remove unused accounts | ① for the Colonial-type entry | exploits | |
| 管理者権限の分離 / Tiered admin accounts | ③ (keys stay in the room) | entry, exfiltration of what the first account could reach | |
| オフライン/変更不能バックアップ / Offline or immutable backup | ④ (backup survives; recovery possible) | entry, exfiltration (double extortion still happens) | "暗号化からは戻れる。流出は戻らない" |

A selector above the plan chooses the entry type (`盗まれたパスワード / stolen password` vs `認証前の脆弱性 / pre-auth vulnerability`), because the honest answer differs. When a switch cuts the route, the remaining downstream segments turn `--line` grey and a `--safe` bar is drawn across the corridor at that station. Every combination has a URL (`?entry=preauth&mfa=1&backup=1`) so it can be pasted into a board slide. This is the Nicky Case sandbox and the samwho "same parameters, different fix" comparison in one figure.

### 8.3 建具表 explorer (chapter 3)

The door schedule table (§4.3) plus the detail drawing beside it (sticky on desktop, above the table on mobile). Selecting a row (click, Enter, or `#cve-2023-4966`) highlights the 壊れる部位 region in the drawing (`--intruder-fill` at 20% opacity + 2 px `--intruder` outline) and draws the attacker's path from intercom to the part reached. Filters: product (5 buttons), `認証前のみ / pre-auth only`, `パッチだけでは閉まらない / patch is not enough`. The last column renders `いいえ / No` with a `--caution` tag and a one-line reason (e.g. "セッションの強制失効が必要", "認証情報の全リセットが必要"). Each CVE ID links to NVD and the CISA KEV entry. No hover-only content; the selected row's full record also appears as text below the drawing for screen readers.

Candidate rows (all to be verified against NVD/KEV/vendor advisories before publishing, see §13): FortiOS SSL-VPN CVE-2018-13379, CVE-2022-42475, CVE-2024-21762; Citrix CVE-2019-19781, CVE-2023-4966 (Citrix Bleed); Ivanti Connect Secure CVE-2023-46805 + CVE-2024-21887, CVE-2025-0282; PAN-OS GlobalProtect CVE-2024-3400; SonicWall CVE-2024-40766.

## 9. Figure and diagram rules

- **Plan grammar (JIS A 0150):** walls as filled poché `--wall` (wall thickness 8 px outer, 5 px inner at the desktop render), doors as leaf + quarter arc (leaf 1.5 px, arc 1 px), closed doors as leaf in the wall line, windows as three thin parallel lines in the wall, room names centred, 14px `--ink-2`. North arrow omitted; scale label `NTS / 縮尺なし` bottom-right with the figure number.
- **Line semantics (shared with athenz-man):** 2 px solid = structure and the main path; 1 px solid = leaders and labels; 1 px dashed = out-of-band (exfil channel, C2); chain line = boundaries and section cuts. The intruder route alone is 3 px dashed (`8 4`) `--intruder` with a filled 30° arrowhead at each station.
- **Station marks:** circled numbers ①–⑦ (police 見取図 convention), 22 px circles, white fill, 1.5 px `--intruder` stroke, number in Public Sans 700 14px.
- **Hatching:** compromised/encrypted = 45° lines, 1.5 px, 6 px pitch, `--intruder` over `--intruder-tint`. Wiped = cross-hatch. Never solid red fills for rooms.
- **Charts:** unit charts and horizontal bars only, directly labelled, no legends, no pies or donuts (NPA leaflet is the counter-example), no 3D, y-axes start at 0, percentages always shown with n. Every chart has a sibling `<table>` (visually hidden or in a `<details>` labelled データ / Data) with the same numbers.
- **Captions:** `図 2-1　港精密本社 平面図（侵入経路）` / `Fig. 2-1  Minato Precision head office, intruder route`, then a source line starting `出典:` / `Source:`. Figure numbers are chapter-scoped and stable (used in deep links `#fig-2-1`).
- **Real identifiers at S=1:5 only:** request paths, daemon names, log formats, exact versions, with a pinned vendor-advisory or NVD link. Defang hostnames (`example[.]com`, Krebs). No exploit payloads; describe the class, link the advisory.
- **Composite honesty:** the 港精密 scenario is labelled `複合事例（実在しない会社）/ composite, fictional company` in every caption where it appears. Elapsed times on it come from a named real report or are omitted.
- **Prose ↔ figure colour match (Ciechanowski):** a room or part named in prose is wrapped in a span that carries the same colour token as in the figure, plus underline-on-hover that highlights the region (pointer only; not required to understand the text).

## 10. Motion rules

- Allowed: door swing (400 ms), route segment draw (600 ms per segment), inner doors flipping open in sequence (60 ms stagger, 160 ms each), exfil box travelling the route (1.2 s, once), counterfactual cut bar appearing (160 ms). All `ease-out`, only `transform`, `opacity`, `stroke-dashoffset`.
- UI state changes (filters, row selection, palette): 120–160 ms opacity/transform.
- Not allowed: scroll-entrance fades, parallax, counters that tick up to 66.3, looping ambient animation, scroll-jacking, smooth-scroll overrides.
- `prefers-reduced-motion: reduce`: every state renders its final frame instantly; the scrolly still changes state on scroll but without tweening; the exfil box is drawn at the door. A page-level 「動きを止める / Pause motion」 toggle (Ciechanowski, Pudding) does the same and persists in `localStorage`.
- Scrolling backwards never replays animation; it snaps to the earlier state.

## 11. Avoid

- Hooded hacker, skulls, padlocks, shields, keyholes as icons, binary/Matrix rain, glitch text, red-on-black terminal hero, fake terminal typing, world map with attack arcs, "live threat" counters, hazard-tape stripes, siren red flashing.
- Stock photos and 3D isometric servers; AI-generated illustration of any kind.
- Donut/pie charts, gradient banners, everything-in-red emphasis (the NPA leaflet style).
- Definitional question H2s ("What is a VPN?"), summary-box + CTA SEO layout (Cloudflare Learning).
- SaaS defaults: Inter/system everywhere, purple-blue gradients, glassmorphism, glow, three icon cards, `rounded-2xl` + shadow, dark gradient changelog feed (Linear), product-screenshot hero, lucide icons, emoji, decorative 01/02/03, fake window dots.
- Cream + terracotta, black + acid green, Mincho headings, all-caps Latin headings, mono for prose.
- Fake document theatre: CONFIDENTIAL stamps, redaction bars over nothing, coffee rings, paper textures, typewriter fonts.
- Fear copy ("Your company is next!"), countdown timers, vendor shaming beyond what advisories say, any product recommendation or affiliate link.
- Stretching the metaphor: no "hallways = VPN tunnels", no "rooms = VLANs" at S=1:5. When the metaphor stops being exact, switch to real names.
- Click-steppers and swipe navigation for the story (Pudding: they override normal scrolling).

## 12. Accessibility constraints

Contrast (WCAG 2.x, computed in this pass with the relative-luminance formula):

| Pair | Light | Dark | Requirement |
|---|---|---|---|
| `--ink` on `--paper` / `--sheet` | 16.11 / 17.61 | 15.71 / 14.62 | 4.5 text |
| `--ink-2` on `--paper` / `--sheet` | 7.44 / 8.14 | 8.97 / 8.35 | 4.5 text |
| `--ink-3` on `--paper` / `--room` | 5.40 / 5.07 | 6.19 / 5.22 | 4.5 text |
| `--intruder-text` on `--sheet` / `--intruder-tint` | 5.54 / 4.74 | 6.77 / 6.10 | 4.5 text |
| `--safe` text on `--sheet` | 5.69 (`#00764A`) | 9.01 (`#45D198`) | 4.5 text |
| `--instruct` link on `--sheet` | 6.48 (`#1757C9`) | 7.98 (`#86AFFF`) | 4.5 text |
| `--intruder` stroke on `--room` / `--sheet` | 3.78 / 4.40 | 5.07 / 5.60 | 3.0 graphics |
| `--line` on `--room` / `--sheet` | 3.12 / 3.63 | 3.43 / 3.79 | 3.0 graphics |
| `--wall` on `--room` | 12.92 | 9.98 | 3.0 graphics |
| ink text on `--caution` fill | 13.59 | 14.37 (`#111315`) | 4.5 text |
| ink text on `--intruder-fill` | 5.25 | 5.65 (`#101214`) | 4.5 text; never white on JIS red (3.36) |
| ink text on `--safe` fill `#00B06B` | 6.23 | 8.38 | 4.5 text |
| white on `--instruct` fill `#1971FF` | 4.33 | — | large text only (≥ 18.66px bold); otherwise use ink |

Known failures, by design and therefore restricted: JIS `#FF4B00` as a stroke on `--room` (2.88) and JIS `#00B06B` as a stroke (2.43–2.83) fail 3:1 in light mode, which is why strokes use the darkened tokens. `--hair` and `--room` are decorative only and must never be the only carrier of meaning.

Other constraints:

- Colour is never the only channel: intruder route = red + dashed + numbered stations; compromised = tint + hatch; caution = yellow + text label; cut = green + bar shape.
- Every SVG figure: `role="img"`, `aria-labelledby` pointing at its `figcaption`, plus a text equivalent (step list or data table). The scrolly's step text already narrates every state; the SVG itself is `aria-hidden="true"` inside the scrolly to avoid double announcement.
- Keyboard: all controls are native elements; visible focus ring 2 px `--instruct` offset 2 px; Esc closes the search palette and any expanded detail; `#hash` restores state on load.
- Body text never below 16px (JA) / 17px (EN mobile); labels never below 14px at render size; zoom to 200% without horizontal scroll (plan figures switch to stacked mobile layout).
- Language: `lang="en"` / `lang="ja"` on `<html>`, `hreflang` alternates; Japanese prose uses BIZ UDPGothic and is not set in Public Sans.
- `prefers-color-scheme` respected, with a manual toggle; both themes pass the table above.

## 13. Facts to verify before the figures ship

- Full-year 2025 route split (VPN機器 66.3% / RDP 20.7% / その他 10.9% / 不審メール 2.2%, n=92, total 226 cases, SMEs 143, double extortion 136 of 153) comes from a secondary source ([tsukaeru.net](https://www.tsukaeru.net/blog/ransomware-statistics-2026/)) and search summaries; the 27 MB NPA PDF was too large to fetch here. Pull the exact table and page number from the [NPA original](https://www.npa.go.jp/publications/statistics/cybersecurity/index.html) before drawing the tallies. The H1 2025 figures (62.2% / 22.2%) are confirmed from the [NPA leaflet](https://www.npa.go.jp/bureau/cyber/pdf/R7countermeasures_leaflet.pdf).
- The 2021–2024 VPN share series (54 / 62 / 63 / 55%) is from a search summary only; recheck each year's NPA report.
- Every CVE row in §8.3 and every case in chapter 4: confirm against NVD, CISA KEV, vendor advisories and the official investigation reports (半田病院 有識者会議報告書, 大阪急性期 調査報告書, 名古屋港運協会 発表).
- Confirm Public Sans `tnum` works in the served build (`font-feature-settings: "tnum"` visual check on `111.1` vs `888.8`).

## Sources

- [Nikkei: JAL機炎上、そのとき何が](https://vdata.nikkei.com/newsgraphics/haneda-runway-collision/)
- [Nikkei: 日本を狙うサイバー攻撃](https://vdata.nikkei.com/newsgraphics/barchart-race-cyber-attack/)
- [Nikkei Visual Data index](https://vdata.nikkei.com/)
- [Washington Post: The anatomy of a ransomware attack](https://www.washingtonpost.com/technology/2021/07/09/how-ransomware-attack-works/)
- [FT ransomware game](https://ig.ft.com/ransomware-game/) and [FT thread](https://threadreaderapp.com/thread/1572437647204970496.html)
- [Bloomberg: corporate hacks graphic](https://www.bloomberg.com/graphics/corporate-hacks-cyber-attacks/index.html)
- [Bloomberg: Colonial Pipeline compromised password](https://www.bloomberg.com/news/articles/2021-06-04/hackers-breached-colonial-pipeline-using-compromised-password)
- [Tailscale: How NAT traversal works](https://tailscale.com/blog/how-nat-traversal-works)
- [tls13.xargs.org](https://tls13.xargs.org/)
- [Ciechanowski: Mechanical Watch](https://ciechanow.ski/mechanical-watch/)
- [samwho: Load balancing](https://samwho.dev/load-balancing/)
- [Nicky Case: How I make an explorable explanation](https://blog.ncase.me/how-i-make-an-explorable-explanation/)
- [Explorable Explanations](https://explorabl.es/)
- [The Pudding: storytelling](https://pudding.cool/process/how-to-make-dope-shit-part-3/)
- [The Pudding: responsive scrollytelling](https://pudding.cool/process/responsive-scrollytelling/)
- [Krebs on Security](https://krebsonsecurity.com/)
- [Darknet Diaries](https://darknetdiaries.com/)
- [Cloudflare Learning: What is a VPN?](https://www.cloudflare.com/learning/access-management/what-is-a-vpn/)
- [NTSB AAR-20/01](https://www.ntsb.gov/investigations/AccidentReports/Reports/AAR2001.pdf)
- [JTSB AA2020-1](https://jtsb.mlit.go.jp/aircraft/rep-acci/AA2020-1-2-JA200G.pdf)
- [NPA leaflet 令和8年1月](https://www.npa.go.jp/bureau/cyber/pdf/R7countermeasures_leaflet.pdf)
- [NPA cyber threat reports index](https://www.npa.go.jp/publications/statistics/cybersecurity/index.html)
- [NPA 住まいる防犯110番](https://www.npa.go.jp/safetylife/seianki26/theme_a/a_d_1_main.html)
- [JIS A 0150 (kikakurui)](https://kikakurui.com/a0/A0150-1999-01.html)
- [JIS safety colour recommended values](https://safetycolor.jp/shiteichi/)
- [Wikipedia: JIS安全色](https://ja.wikipedia.org/wiki/JIS%E5%AE%89%E5%85%A8%E8%89%B2)
- [JIS Z 8210 (kikakurui)](https://kikakurui.com/z8/Z8210-2020-01.html)
- [Digital Agency design system: typography](https://design.digital.go.jp/foundations/typography/)
- [Morisawa BIZ UD on Google Fonts](https://en.morisawa.co.jp/about/news/6772)
- [googlefonts/morisawa-biz-ud-gothic](https://github.com/googlefonts/morisawa-biz-ud-gothic)
- [uswds/public-sans](https://github.com/uswds/public-sans)
- [Braille Institute: Atkinson Hyperlegible Next](https://www.brailleinstitute.org/about-us/news/braille-institute-launches-enhanced-atkinson-hyperlegible-font-to-make-reading-easier/)
- [NHK: プリンターが止まらない](https://news.web.nhk/news/special/sci_cul/2021/11/special/ransomcrisis)
- [tsukaeru.net ransomware statistics 2026](https://www.tsukaeru.net/blog/ransomware-statistics-2026/)
