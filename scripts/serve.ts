// Serve dist/ the way GitHub Pages does: under /vpn-is-the-door/, index.html
// for directories, 404.html for misses, gzip for text. Used by Playwright,
// scripts/lighthouse.ts and local checks.
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { extname, join, normalize } from "node:path";
import { createGzip } from "node:zlib";

const BASE = "/vpn-is-the-door";
const ROOT = join(import.meta.dirname, "..", "dist");
const port = Number(process.env.PORT ?? 4322);
const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".json": "application/json",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".woff2": "font/woff2",
};

// Pages gzips text responses; fonts and images go out as they are.
const COMPRESS = new Set([".html", ".css", ".js", ".svg", ".json", ".xml", ".txt"]);
function send(req: IncomingMessage, res: ServerResponse, status: number, file: string): void {
  const ext = extname(file);
  const headers: Record<string, string> = { "content-type": TYPES[ext] ?? "application/octet-stream" };
  const gzip = COMPRESS.has(ext) && /\bgzip\b/.test(String(req.headers["accept-encoding"] ?? ""));
  if (gzip) Object.assign(headers, { "content-encoding": "gzip", vary: "Accept-Encoding" });
  res.writeHead(status, headers);
  const body = createReadStream(file);
  (gzip ? body.pipe(createGzip()) : body).pipe(res);
}

createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://x");
  if (!url.pathname.startsWith(BASE)) {
    res.writeHead(404).end();
    return;
  }
  const rel = normalize(decodeURIComponent(url.pathname.slice(BASE.length) || "/"));
  if (rel.includes("..")) {
    res.writeHead(400).end();
    return;
  }
  let file = join(ROOT, rel);
  if (existsSync(file) && statSync(file).isDirectory()) {
    if (!url.pathname.endsWith("/")) {
      res.writeHead(301, { location: `${url.pathname}/` }).end();
      return;
    }
    file = join(file, "index.html");
  }
  if (!existsSync(file)) {
    const nf = join(ROOT, "404.html");
    if (existsSync(nf)) send(req, res, 404, nf);
    else res.writeHead(404, { "content-type": TYPES[".html"] }).end("not found");
    return;
  }
  send(req, res, 200, file);
}).listen(port, "127.0.0.1", () => console.log(`serving dist at http://127.0.0.1:${port}${BASE}/`));
