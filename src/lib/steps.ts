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
