// BIZ UDPGothic, subset to the characters the built site actually uses.
// Fontsource ships the family as ~120 unicode-range chunks per weight, and a
// Japanese page pulled ~57 of them (~800 KiB). After `astro build` this collects
// every character in the built HTML/CSS/JS per language, cuts one woff2 per
// language and weight from the full Google Fonts TTFs, names each by content
// hash, and points the pages' @font-face (written by Base.astro as
// `__fonts/biz-udpgothic-<lang>-<weight>.woff2`) at it. The build fails if a
// page uses a character the font has but its subset lacks.
// `astro dev` serves the full TTF at the placeholder URL instead.
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import type { AstroIntegration } from "astro";
import fontverter from "fontverter";
import subsetFont from "subset-font";

const LANGS = ["en", "ja"] as const;
const WEIGHTS = { 400: "400Regular/BIZUDPGothic_400Regular.ttf", 700: "700Bold/BIZUDPGothic_700Bold.ttf" } as const;
type Lang = (typeof LANGS)[number];
type Weight = keyof typeof WEIGHTS;
const PLACEHOLDER = /__fonts\/biz-udpgothic-(en|ja)-(400|700)\.woff2/g;

// Always kept: printable ASCII and the punctuation Japanese and English prose reach for.
const BASE_CHARS =
  Array.from({ length: 0x7f - 0x20 }, (_, i) => String.fromCodePoint(0x20 + i)).join("") +
  " ©·×–—‘’“”•…←↑→↓−" +
  "　、。「」『』【】〜・ー！％（）＋，－．／：；？～";

const require = createRequire(import.meta.url);
const ttfPath = (w: Weight) => require.resolve(`@expo-google-fonts/biz-udpgothic/${WEIGHTS[w]}`);

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const NAMED: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

// Characters a file can put on screen: its raw text plus whatever its escapes decode to.
export function charsOf(text: string): Set<string> {
  const decoded = text
    .replace(/&#x([0-9a-f]+);/gi, (_, h: string) => String.fromCodePoint(Number.parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d: string) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n: string) => NAMED[n] ?? m)
    .replace(/\\u\{([0-9a-f]+)\}|\\u([0-9a-f]{4})/gi, (_, a?: string, b?: string) =>
      String.fromCodePoint(Number.parseInt(a ?? b ?? "", 16)),
    );
  return new Set(Array.from(decoded).filter((c) => (c.codePointAt(0) ?? 0) >= 0x20));
}

// Code points mapped by a TrueType font's cmap (formats 4 and 12 cover every Unicode subtable).
export function cmapOf(font: Buffer): Set<number> {
  const tables = font.readUInt16BE(4);
  let cmap = -1;
  for (let i = 0; i < tables; i++) {
    const rec = 12 + i * 16;
    if (font.toString("latin1", rec, rec + 4) === "cmap") cmap = font.readUInt32BE(rec + 8);
  }
  if (cmap < 0) throw new Error("font has no cmap table");
  const out = new Set<number>();
  const subtables = font.readUInt16BE(cmap + 2);
  for (let i = 0; i < subtables; i++) {
    const st = cmap + font.readUInt32BE(cmap + 4 + i * 8 + 4);
    const format = font.readUInt16BE(st);
    if (format === 4) {
      const segs = font.readUInt16BE(st + 6) / 2;
      const ends = st + 14;
      const starts = ends + segs * 2 + 2;
      const deltas = starts + segs * 2;
      const offsets = deltas + segs * 2;
      for (let s = 0; s < segs; s++) {
        const end = font.readUInt16BE(ends + s * 2);
        const start = font.readUInt16BE(starts + s * 2);
        const delta = font.readUInt16BE(deltas + s * 2);
        const ro = font.readUInt16BE(offsets + s * 2);
        for (let c = start; c <= end && c !== 0xffff; c++) {
          const gid = ro === 0 ? (c + delta) & 0xffff : font.readUInt16BE(offsets + s * 2 + ro + (c - start) * 2);
          if (gid !== 0) out.add(c);
        }
      }
    } else if (format === 12) {
      const groups = font.readUInt32BE(st + 12);
      for (let g = 0; g < groups; g++) {
        const at = st + 16 + g * 12;
        for (let c = font.readUInt32BE(at); c <= font.readUInt32BE(at + 4); c++) out.add(c);
      }
    }
  }
  return out;
}

async function build(dir: string, log: (m: string) => void): Promise<void> {
  const files = walk(dir);
  const pages = files.filter((f) => f.endsWith(".html"));
  // Client CSS/JS can put strings on any page, so their characters go to both languages.
  const shared = new Set<string>(BASE_CHARS);
  for (const f of files.filter((f) => f.includes("/_astro/") && /\.(css|js)$/.test(f))) {
    for (const c of charsOf(readFileSync(f, "utf8"))) shared.add(c);
  }
  const used: Record<Lang, Set<string>> = { en: new Set(shared), ja: new Set(shared) };
  const pageChars = new Map<string, { lang: Lang; chars: Set<string> }>();
  for (const f of pages) {
    const html = readFileSync(f, "utf8");
    const lang = /<html[^>]*\blang="([a-z]+)"/.exec(html)?.[1];
    if (lang !== "en" && lang !== "ja") throw new Error(`${relative(dir, f)}: <html lang> is ${lang}, not en or ja`);
    const chars = charsOf(html);
    for (const c of chars) used[lang].add(c);
    pageChars.set(f, { lang, chars });
  }

  const urls = new Map<string, string>();
  const errors: string[] = [];
  const outside = new Set<string>();
  const jobs = LANGS.flatMap((lang) =>
    ([400, 700] as const).map(async (weight) => {
      const source = readFileSync(ttfPath(weight));
      const inFont = cmapOf(source);
      // GSUB goes: the fontsource files the site used before carry none, so text shapes the same.
      const ttf = await subsetFont(source, Array.from(used[lang]).join(""), {
        targetFormat: "truetype",
        dropTables: ["GSUB"],
      });
      const woff2 = await fontverter.convert(ttf, "woff2");
      // Read the cmap back out of the woff2 that ships, not the intermediate TTF.
      const have = cmapOf(await fontverter.convert(woff2, "truetype"));
      for (const [f, p] of pageChars) {
        if (p.lang !== lang) continue;
        for (const c of p.chars) {
          const cp = c.codePointAt(0) ?? 0;
          if (!inFont.has(cp)) outside.add(c);
          else if (!have.has(cp))
            errors.push(`${relative(dir, f)}: U+${cp.toString(16).toUpperCase()} ${c} missing from ${lang}-${weight}`);
        }
      }
      const name = `biz-udpgothic-${lang}-${weight}.${createHash("sha256").update(woff2).digest("hex").slice(0, 10)}.woff2`;
      writeFileSync(join(dir, "_astro", name), woff2);
      urls.set(`${lang}-${weight}`, `_astro/${name}`);
      log(`${name} ${(woff2.length / 1024).toFixed(1)} KiB, ${have.size} code points`);
    }),
  );
  await Promise.all(jobs);
  if (errors.length) throw new Error(`BIZ UDPGothic subset is missing characters:\n${errors.slice(0, 50).join("\n")}`);
  if (outside.size) log(`not in BIZ UDPGothic, left to the next font in the stack: ${[...outside].join(" ")}`);

  for (const f of pages) {
    const html = readFileSync(f, "utf8");
    const next = html.replace(PLACEHOLDER, (_, lang: string, weight: string) => urls.get(`${lang}-${weight}`) ?? "");
    if (next !== html) writeFileSync(f, next);
  }
}

export default function bizUdpGothicSubset(): AstroIntegration {
  return {
    name: "biz-udpgothic-subset",
    hooks: {
      "astro:server:setup": ({ server }) => {
        server.middlewares.use((req, res, next) => {
          const m = /__fonts\/biz-udpgothic-(?:en|ja)-(400|700)\.woff2$/.exec(req.url ?? "");
          if (!m) return next();
          res.setHeader("content-type", "font/ttf");
          res.end(readFileSync(ttfPath(Number(m[1]) as Weight)));
        });
      },
      "astro:build:done": async ({ dir, logger }) => {
        await build(fileURLToPath(dir), (m) => logger.info(m));
      },
    },
  };
}
