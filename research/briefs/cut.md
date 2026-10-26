# Brief: cut the prose

The owner read the site and called it AI-like, over-explained, lecturing and posturing. He is right. Your job is to cut, not to rewrite in a new voice. Facts, numbers, sources and figures stay; the talk around them goes.

## Delete on sight

| Pattern | Real example from this site | What to do |
| --- | --- | --- |
| Announcing what comes next | 「以下、手順ごとに、記録がどう見えるかと…をまとめる。」 | Delete. The headings already say it. |
| Explaining how a figure was built | 「図 2-2 は三つの出典を一本の時間軸に並べたものである。起点は出典ごとに違い…最初の4時間は実寸で描き…」 | Delete. If the reader needs one fact to read the figure correctly (an axis break), put it in the caption in a few words. |
| Stacked disclaimers | 「例は典型的なパターンで、港精密で起きた出来事ではない。」「この表は防御側から見えるものを書いたもので、技術の実行方法は扱わない。」 | Delete. The composite tag on the figure already says it. Keep a caveat only when the claim itself is uncertain (推定, the report says). |
| Punchlines and aphorisms | 「問題は、日曜日の午前3時にそのログを誰も見ていないことである。」「修理で扉は閉まったが、誰が通ったかの記録も消えた。」 | Delete, or replace with the plain fact if it carries one. |
| Lecturing the reader | 「平日だけの監視体制も、月に一度のパッチ適用も、この速さには追いつかない。」, 「ここから導かれる判断は〜」, "The decision this implies" | Delete. The what-to-do chapter is where actions live; elsewhere state facts and let the reader conclude. |
| Restating what a figure or the previous sentence just showed | A paragraph that repeats the numbers in the table above it | Delete. |
| Three numbers where one makes the point | "Sophos: 72.98 h (2024), 78.83 h (2025); CISA: just over 2 hours; …" | Keep the one that supports the sentence; the rest can stay in the figure's data table. |
| Dramatic headings | 「ある病院は、同じ経路をたどった」 | Plain heading that names the thing: 「大阪急性期・総合医療センターの経過」. |
| Contrast flourishes | "not X, but Y", 「〜ではなく〜だ」 used for effect | Say the positive statement once. |
| Metaphor re-explained | Re-describing the door/reception metaphor on every page | Explain it once (home and chapter 1). Elsewhere just use the words. |

## Keep

- Every number with its source, every figure and table, every link to an advisory or report.
- Caveats that change what a claim means (推定, the organization did not say VPN, n=36).
- The composite tag on figures of the fictional company.
- EN/JA parity: same headings count, same figures in the same order (`node scripts/validate-data.ts` checks this).

## Style after the cut

- Short. Most paragraphs 1–3 sentences. A section that is only a figure plus one sentence is fine.
- Japanese: plain written Japanese. Don't end five sentences in a row with 「である。」; use 「だ。」 and plain verb endings too. No 体言止め chains, no 口語.
- English: plain, no rhythm tricks, no em dashes for drama.
- Summary boxes (要旨): two or three sentences of fact. No instructions to the reader except on the what-to-do page.
- Target: about 30–40% fewer characters on each page. Report before/after character counts per file (`wc -m`).

## Rules

- Edit only the files assigned to you. Use the Edit tool for targeted changes; re-read a file before editing it.
- Do not add claims. Do not change numbers, quotes, source ids, figure numbers or component props other than human-language strings.
- Verify: `pnpm exec astro check`, `pnpm exec biome check --write <changed .ts/.astro/.json> && pnpm exec biome ci src`, `pnpm exec vitest run`, `node scripts/validate-data.ts`. Commands that write in the repo need the sandbox disabled. Don't build, don't commit.
- Final reply: per file, chars before → after, and three before/after examples of the biggest cuts.
