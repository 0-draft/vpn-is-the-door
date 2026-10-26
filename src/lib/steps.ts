// Plan state per scrolly step (chapter 2). Each step adds to the previous one;
// tokens are matched by FloorPlan's CSS ([data-show~="token"]).
export const STEP_TOKENS: Record<number, string[]> = {
  1: [],
  2: ["door"],
  3: ["in", "bypass"],
  4: ["toKeys", "keys"],
  5: ["toBackup", "wiped"],
  6: ["out"],
  7: ["encrypt"],
};

export const STEP_COUNT = Object.keys(STEP_TOKENS).length;

export function showFor(step: number): string {
  if (!Number.isInteger(step) || step < 0 || step > STEP_COUNT) throw new Error(`no step ${step}`);
  const out: string[] = [];
  for (let i = 1; i <= step; i++) out.push(...(STEP_TOKENS[i] ?? []));
  return out.join(" ");
}

export function stepFromHash(hash: string): number | null {
  const m = /^#step-(\d+)$/.exec(hash);
  if (!m) return null;
  const n = Number(m[1]);
  return n >= 1 && n <= STEP_COUNT ? n : null;
}

// "Show all steps" (design §8.1): #all-steps swaps the scrolly for the static
// grid; a #step-n link goes back to the scroll version. With no hash, readers
// who turned motion off on a narrow screen get the grid (design §4.2).
export const ALL_STEPS_HASH = "#all-steps";
export type RouteView = "scroll" | "grid";

export function viewFor(hash: string, preferStatic: boolean): RouteView {
  if (hash === ALL_STEPS_HASH) return "grid";
  if (stepFromHash(hash) !== null) return "scroll";
  return preferStatic ? "grid" : "scroll";
}

// Step titles from the rendered step list (Step.astro markup), so the grid
// captions cannot drift from the headings the reader scrolls past.
export function titlesFromHtml(html: string): Record<number, string> {
  const out: Record<number, string> = {};
  const item = /<li\b[^>]*\bdata-step="(\d+)"[^>]*>([\s\S]*?)<\/li>/g;
  for (const m of html.matchAll(item)) {
    const h = /<h3\b[^>]*>([\s\S]*?)<\/h3>/.exec(m[2] ?? "");
    if (!h) continue;
    const text = (h[1] ?? "")
      .replace(/<span\b[^>]*aria-hidden="true"[^>]*>[\s\S]*?<\/span>/, "")
      .replace(/<[^>]+>/g, "")
      .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
      .replace(/&#x([0-9a-f]+);/gi, (_, d) => String.fromCodePoint(Number.parseInt(d, 16)))
      .replace(/&quot;/g, '"')
      .replace(/&#39;|&apos;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .trim();
    out[Number(m[1])] = text;
  }
  return out;
}
