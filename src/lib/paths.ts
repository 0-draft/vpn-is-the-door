export const LANGS = ["en", "ja"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "en";

// English lives at the site root, Japanese under /ja/. Every path is prefixed
// with the deploy base (GitHub Pages serves this repo under /vpn-is-the-door/).
export function joinBase(base: string, path: string): string {
  const b = base.endsWith("/") ? base.slice(0, -1) : base;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
}

export function localePath(lang: Lang, path: string, base = "/"): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  const local = lang === DEFAULT_LANG ? p : `/${lang}${p === "/" ? "/" : p}`;
  return joinBase(base, local);
}

export function stripBase(pathname: string, base = "/"): string {
  const b = base.endsWith("/") ? base.slice(0, -1) : base;
  if (b && (pathname === b || pathname.startsWith(`${b}/`))) return pathname.slice(b.length) || "/";
  return pathname || "/";
}

export function stripLocale(path: string): string {
  return path.replace(/^\/ja(?=\/|$)/, "") || "/";
}

export function langFromPath(path: string): Lang {
  return /^\/ja(\/|$)/.test(path) ? "ja" : "en";
}

// The same page in the other language.
export function alternatePath(pathname: string, base = "/"): { lang: Lang; href: string } {
  const local = stripBase(pathname, base);
  const lang = langFromPath(local);
  const other: Lang = lang === "en" ? "ja" : "en";
  return { lang: other, href: localePath(other, stripLocale(local), base) };
}
