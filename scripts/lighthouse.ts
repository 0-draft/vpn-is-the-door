// Performance gate: Lighthouse (mobile emulation, simulated throttling, the
// default config) against the built site, served by scripts/serve.ts under
// /vpn-is-the-door/. Each page runs RUNS times; every assertion uses the median.
// Usage: pnpm build && node scripts/lighthouse.ts [path ...]   (CI: the `lighthouse` job)
// Chrome comes from CHROME_PATH (CI pins Chrome for Testing in ci.yml) or chrome-launcher's lookup.
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";

const PORT = Number(process.env.LH_PORT ?? 4323);
const ORIGIN = `http://127.0.0.1:${PORT}/vpn-is-the-door`;
const RUNS = 3;
const OUT = join(import.meta.dirname, "..", "lighthouse-report");

// Transfer budgets in KiB (text gzipped, as Pages serves it): the medians measured
// on 2026-10-26 (210.7, 370.6, 226.4, 282.6, 222.1) plus ~20% headroom. A Japanese
// page carries both ~157 KiB BIZ UDPGothic subsets (scripts/font-subset.ts).
const PAGES: { path: string; budgetKiB: number }[] = [
  { path: "/", budgetKiB: 255 },
  { path: "/ja/", budgetKiB: 445 },
  { path: "/after-the-door/", budgetKiB: 275 },
  { path: "/the-doors/", budgetKiB: 340 },
  { path: "/what-to-do/", budgetKiB: 270 },
];
const MIN_SCORE = { performance: 0.9, accessibility: 1, "best-practices": 0.95, seo: 0.95 } as const;
const MAX_CLS = 0.05;

const median = (xs: number[]): number => {
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)] ?? Number.NaN;
};

async function waitForServer(): Promise<void> {
  for (let i = 0; i < 50; i++) {
    try {
      if ((await fetch(`${ORIGIN}/`)).ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error(`server at ${ORIGIN}/ did not come up`);
}

const server = spawn(process.execPath, [join(import.meta.dirname, "serve.ts")], {
  env: { ...process.env, PORT: String(PORT) },
  stdio: "ignore",
});
const chrome = await launch({
  chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"],
});
const failures: string[] = [];
const rows: string[] = [];
try {
  await waitForServer();
  mkdirSync(OUT, { recursive: true });
  const only = process.argv.slice(2);
  for (const { path, budgetKiB } of PAGES.filter((p) => only.length === 0 || only.includes(p.path))) {
    const url = `${ORIGIN}${path}`;
    const runs: NonNullable<Awaited<ReturnType<typeof lighthouse>>>["lhr"][] = [];
    for (let i = 0; i < RUNS; i++) {
      const result = await lighthouse(url, { port: chrome.port, output: "html", logLevel: "error" });
      if (!result) throw new Error(`lighthouse returned nothing for ${url}`);
      const { lhr } = result;
      if (lhr.runtimeError) throw new Error(`${url}: ${lhr.runtimeError.message}`);
      runs.push(lhr);
      const slug = path.replaceAll("/", "_") || "_";
      writeFileSync(join(OUT, `${slug}run${i + 1}.html`), String(result.report));
      writeFileSync(join(OUT, `${slug}run${i + 1}.json`), JSON.stringify(lhr));
    }
    const scores = Object.fromEntries(
      Object.keys(MIN_SCORE).map((k) => [k, median(runs.map((r) => r.categories[k]?.score ?? 0))]),
    ) as Record<keyof typeof MIN_SCORE, number>;
    const cls = median(runs.map((r) => r.audits["cumulative-layout-shift"]?.numericValue ?? Number.NaN));
    const kib = median(runs.map((r) => r.audits["total-byte-weight"]?.numericValue ?? Number.NaN)) / 1024;
    for (const [k, min] of Object.entries(MIN_SCORE) as [keyof typeof MIN_SCORE, number][]) {
      if (!(scores[k] >= min)) failures.push(`${path}: ${k} ${scores[k]} < ${min}`);
    }
    if (!(cls <= MAX_CLS)) failures.push(`${path}: CLS ${cls.toFixed(3)} > ${MAX_CLS}`);
    if (!(kib <= budgetKiB)) failures.push(`${path}: transfer ${kib.toFixed(1)} KiB > budget ${budgetKiB} KiB`);
    rows.push(
      `${path.padEnd(18)} perf ${scores.performance} a11y ${scores.accessibility} bp ${scores["best-practices"]} seo ${scores.seo} CLS ${cls.toFixed(3)} transfer ${kib.toFixed(1)}/${budgetKiB} KiB`,
    );
    console.log(rows.at(-1));
  }
} finally {
  chrome.kill();
  server.kill();
}
writeFileSync(join(OUT, "summary.txt"), `${rows.join("\n")}\n`);
if (failures.length) {
  console.error(`\nLighthouse gate failed (median of ${RUNS} runs):\n${failures.join("\n")}`);
  process.exit(1);
}
