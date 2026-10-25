// Serve dist/ the way GitHub Pages does: under /vpn-is-the-door/, index.html
// for directories, 404.html for misses. Used by Playwright and local checks.
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

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
    res.writeHead(404, { "content-type": TYPES[".html"] });
    if (existsSync(nf)) createReadStream(nf).pipe(res);
    else res.end("not found");
    return;
  }
  res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(res);
}).listen(port, "127.0.0.1", () => console.log(`serving dist at http://127.0.0.1:${port}${BASE}/`));
