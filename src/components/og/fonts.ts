// Font data for the OG renderer. Satori reads TTF/OTF/WOFF (not WOFF2), so this
// takes the .woff files the @fontsource packages ship next to the .woff2 the site
// uses. BIZ UDPGothic is split into ~120 unicode-range chunks; only the chunks
// that cover the text on the card are loaded.
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";

export type Weight = 400 | 700 | 800;
export interface FontData {
  name: string;
  data: Buffer;
  weight: Weight;
  style: "normal";
}

// Resolve from the project, not from this module: during `astro build` the
// module runs from a bundled chunk inside the output directory.
const require = createRequire(join(process.cwd(), "package.json"));
const file = (spec: string): Buffer => readFileSync(require.resolve(spec));

type Range = [number, number];

export function parseRanges(css: string): Range[] {
  return css.split(",").map((part) => {
    const [a, b] = part.trim().replace(/^U\+/i, "").split("-");
    const lo = Number.parseInt(a ?? "", 16);
    return [lo, b ? Number.parseInt(b, 16) : lo];
  });
}

export function covers(ranges: Range[], cp: number): boolean {
  return ranges.some(([lo, hi]) => cp >= lo && cp <= hi);
}

let jaRanges: [string, Range[]][] | undefined;
function jaSubsets(): [string, Range[]][] {
  jaRanges ??= Object.entries(
    JSON.parse(readFileSync(require.resolve("@fontsource/biz-udpgothic/unicode.json"), "utf8")) as Record<
      string,
      string
    >,
  ).map(([key, css]) => [key.replace(/^\[|\]$/g, ""), parseRanges(css)]);
  return jaRanges;
}

// The fontsource subset keys whose ranges contain at least one character of `text`.
export function subsetsFor(text: string, subsets: [string, Range[]][] = jaSubsets()): string[] {
  const cps = new Set([...text].map((ch) => ch.codePointAt(0) ?? 0));
  return subsets.filter(([, ranges]) => [...cps].some((cp) => covers(ranges, cp))).map(([key]) => key);
}

const cache = new Map<string, Buffer>();
const cached = (spec: string): Buffer => {
  let b = cache.get(spec);
  if (!b) {
    b = file(spec);
    cache.set(spec, b);
  }
  return b;
};

// Satori uses one font file per family name and weight, so each BIZ UDPGothic
// chunk gets its own family name and the card lists them all as fallbacks.
export function fontsFor(text: string): { fonts: FontData[]; ja: string } {
  const latin: FontData[] = [
    {
      name: "Public Sans",
      weight: 400,
      data: cached("@fontsource/public-sans/files/public-sans-latin-400-normal.woff"),
    },
    {
      name: "Public Sans",
      weight: 700,
      data: cached("@fontsource/public-sans/files/public-sans-latin-700-normal.woff"),
    },
    {
      name: "Public Sans",
      weight: 800,
      data: cached("@fontsource/public-sans/files/public-sans-latin-800-normal.woff"),
    },
    {
      name: "Atkinson Hyperlegible Mono",
      weight: 400,
      data: cached("@fontsource/atkinson-hyperlegible-mono/files/atkinson-hyperlegible-mono-latin-400-normal.woff"),
    },
  ].map((f) => ({ ...f, weight: f.weight as Weight, style: "normal" as const }));
  const keys = subsetsFor(text);
  const ja: FontData[] = keys.flatMap((key) =>
    ([400, 700] as const).map((weight) => ({
      name: `BIZ UDPGothic ${key}`,
      weight,
      style: "normal" as const,
      data: cached(`@fontsource/biz-udpgothic/files/biz-udpgothic-${key}-${weight}-normal.woff`),
    })),
  );
  return { fonts: [...latin, ...ja], ja: keys.map((k) => `BIZ UDPGothic ${k}`).join(", ") || "Public Sans" };
}
