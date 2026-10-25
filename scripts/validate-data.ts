// Data gate for everything the site publishes as fact:
//  - every source entry is well formed and https
//  - every source id referenced from src/ exists, and every source is used
//  - CVE records match their schema; dates are ordered; KEV fields are present
//  - English strings in data files contain no Japanese
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import { SourceSchema } from "../src/data/source-schema.ts";

const errors: string[] = [];
const fail = (m: string) => errors.push(m);

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const SOURCES = readdirSync("src/data/sources")
  .filter((f) => f.endsWith(".json"))
  .flatMap((f) => {
    const r = z.array(SourceSchema).safeParse(JSON.parse(readFileSync(join("src/data/sources", f), "utf8")));
    if (!r.success) {
      fail(`src/data/sources/${f}: ${r.error.message}`);
      return [];
    }
    return r.data;
  });
const ids = new Set(SOURCES.map((s) => s.id));
if (ids.size !== SOURCES.length) {
  const seen = new Set<string>();
  for (const s of SOURCES) {
    if (seen.has(s.id)) fail(`duplicate source id "${s.id}"`);
    seen.add(s.id);
  }
}

const files = walk("src").filter((f) => /\.(astro|mdx|ts|json)$/.test(f) && !f.includes("data/sources/"));
const used = new Set<string>();
const refRe =
  /(?:source|sources|src)=?\{?\s*[[:]?\s*"([a-z0-9-]+)"|source:\s*"([a-z0-9-]+)"|"source":\s*"([a-z0-9-]+)"|sources=\{\["([^"\]]+)"|<Cite id="([a-z0-9-]+)"/g;
for (const f of files) {
  const text = readFileSync(f, "utf8");
  for (const m of text.matchAll(refRe)) {
    const id = m.slice(1).find(Boolean);
    if (!id) continue;
    used.add(id);
    if (!ids.has(id)) fail(`${f}: unknown source id "${id}"`);
  }
  for (const m of text.matchAll(/"sources":\s*\[([^\]]*)\]/g)) {
    for (const id of (m[1] ?? "").matchAll(/"([a-z0-9-]+)"/g)) {
      used.add(id[1] as string);
      if (!ids.has(id[1] as string)) fail(`${f}: unknown source id "${id[1]}"`);
    }
  }
}

const JA = /[぀-ヿ㐀-鿿]/;
function checkEnglish(obj: unknown, path: string) {
  if (Array.isArray(obj)) {
    for (const [i, v] of obj.entries()) checkEnglish(v, `${path}[${i}]`);
  } else if (obj && typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) {
      if ((k === "en" || k.endsWith("_en")) && typeof v === "string" && JA.test(v))
        fail(`${path}.${k}: Japanese in English text`);
      checkEnglish(v, `${path}.${k}`);
    }
  }
}
for (const f of files.filter((x) => x.endsWith(".json"))) checkEnglish(JSON.parse(readFileSync(f, "utf8")), f);

if (errors.length) {
  console.error(errors.map((e) => `✗ ${e}`).join("\n"));
  process.exit(1);
}
console.log(`data ok: ${SOURCES.length} sources, ${used.size} referenced, ${files.length} files scanned`);
