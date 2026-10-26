// Data gate for everything the site publishes as fact:
//  - every source entry is well formed and https, ids and URLs are unique
//  - every source id cited anywhere exists, and every source is cited
//  - English and Japanese pages are structural twins (path, figures, sections)
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

// ---- sources ---------------------------------------------------------------

const SRC_DIR = "src/data/sources";
const SOURCES = readdirSync(SRC_DIR)
  .filter((f) => f.endsWith(".json"))
  .flatMap((f) => {
    const r = z.array(SourceSchema).safeParse(JSON.parse(readFileSync(join(SRC_DIR, f), "utf8")));
    if (!r.success) {
      fail(`${SRC_DIR}/${f}: ${r.error.message}`);
      return [];
    }
    return r.data;
  });
const ids = new Set<string>();
const urls = new Map<string, string>();
for (const s of SOURCES) {
  if (ids.has(s.id)) fail(`duplicate source id "${s.id}"`);
  ids.add(s.id);
  // One id per document; pages or sheets cited from it go in its locator.
  const prev = urls.get(s.url);
  if (prev) fail(`same document under two ids: "${prev}" and "${s.id}" (${s.url})`);
  urls.set(s.url, s.id);
}

// ---- references --------------------------------------------------------------

const files = walk("src").filter((f) => /\.(astro|mdx|ts|json)$/.test(f) && !f.startsWith(SRC_DIR));
const used = new Set<string>();
const cite = (id: string, where: string) => {
  used.add(id);
  if (!ids.has(id)) fail(`${where}: unknown source id "${id}"`);
};
const quoted = (s: string) => [...s.matchAll(/["']([a-z0-9-]+)["']/g)].map((m) => m[1] as string);

// Any JSON key that names a source (source, sources, vectorSource, …) holds ids.
function jsonRefs(node: unknown, where: string) {
  if (Array.isArray(node)) for (const v of node) jsonRefs(v, where);
  else if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) {
      if (/sources?$/i.test(k)) {
        for (const id of [v].flat()) if (typeof id === "string" && !/^https?:/.test(id)) cite(id, `${where} (${k})`);
      }
      jsonRefs(v, where);
    }
  }
}

for (const f of files) {
  const text = readFileSync(f, "utf8");
  if (f.endsWith(".json")) {
    jsonRefs(JSON.parse(text), f);
    continue;
  }
  for (const m of text.matchAll(/\b(?:sources|ids)=\{\s*\[([^\]]*)\]/g))
    for (const id of quoted(m[1] ?? "")) cite(id, f);
  for (const m of text.matchAll(/\bsources:\s*\[([^\]]*)\]/g)) for (const id of quoted(m[1] ?? "")) cite(id, f);
  for (const m of text.matchAll(/\b(?:source|src)(?:Id)?(?:=|:\s*|\(\s*)["']([a-z0-9-]+)["']/g))
    cite(m[1] as string, f);
  for (const m of text.matchAll(/<Cite\s+id=["']([a-z0-9-]+)["']/g)) cite(m[1] as string, f);
}
for (const id of ids) if (!used.has(id)) fail(`source "${id}" is never cited`);

// ---- EN/JA parity --------------------------------------------------------------

const CH = "src/content/chapters";
const front = (t: string, k: string) => new RegExp(`^${k}:\\s*(.+)$`, "m").exec(t)?.[1]?.trim();
const figs = (t: string) => [...t.matchAll(/\bn=["']([\d-]+)["']/g)].map((m) => m[1]).join(",");
const heads = (t: string) => t.split("\n").filter((l) => /^#{2,3} /.test(l)).length;
const enFiles = readdirSync(join(CH, "en")).filter((f) => f.endsWith(".mdx"));
const jaFiles = new Set(readdirSync(join(CH, "ja")).filter((f) => f.endsWith(".mdx")));
for (const f of enFiles) {
  if (!jaFiles.has(f)) {
    fail(`${CH}/ja/${f}: missing Japanese twin`);
    continue;
  }
  jaFiles.delete(f);
  const en = readFileSync(join(CH, "en", f), "utf8");
  const ja = readFileSync(join(CH, "ja", f), "utf8");
  for (const k of ["path", "chapter", "parent"]) {
    if (front(en, k) !== front(ja, k)) fail(`${f}: frontmatter "${k}" differs between en and ja`);
  }
  if (figs(en) !== figs(ja)) fail(`${f}: figures differ (en ${figs(en)} / ja ${figs(ja)})`);
  if (heads(en) !== heads(ja)) fail(`${f}: section count differs (en ${heads(en)} / ja ${heads(ja)})`);
}
for (const f of jaFiles) fail(`${CH}/en/${f}: missing English twin`);

// ---- no Japanese in English fields -------------------------------------------------

const JA = /[぀-ヿ㐀-鿿＀-￯]/;
function checkEnglish(obj: unknown, path: string) {
  if (Array.isArray(obj)) {
    for (const [i, v] of obj.entries()) checkEnglish(v, `${path}[${i}]`);
  } else if (obj && typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) {
      if ((k === "en" || k.endsWith("_en") || k.endsWith("En")) && typeof v === "string" && JA.test(v))
        fail(`${path}.${k}: Japanese in English text`);
      checkEnglish(v, `${path}.${k}`);
    }
  }
}
for (const f of files.filter((x) => x.endsWith(".json"))) checkEnglish(JSON.parse(readFileSync(f, "utf8")), f);

if (errors.length) {
  console.error(errors.map((e) => `✗ ${e}`).join("\n"));
  console.error(`\n${errors.length} problem(s)`);
  process.exit(1);
}
console.log(
  `data ok: ${SOURCES.length} sources, all cited; ${enFiles.length} page pairs in parity; ${files.length} files scanned`,
);
