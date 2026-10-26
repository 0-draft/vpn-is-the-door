import type { Case, Opening } from "../../data/cases";
import type { Lang } from "../../lib/paths";

// What the drawing calls each kind of opening. "Unspecified" and "other" keep
// the organization's own words (openingLabel) and never say VPN.
const NAME: Record<Opening, Record<Lang, string>> = {
  vpn: { en: "VPN", ja: "VPN 機器" },
  rdp: { en: "Remote desktop", ja: "リモートデスクトップ" },
  "network-device-unspecified": { en: "Network device", ja: "ネットワーク機器" },
  other: { en: "Other", ja: "その他" },
};

const TAG: Partial<Record<Opening, Record<Lang, string>>> = {
  "network-device-unspecified": { en: "type undisclosed", ja: "種類は非公表" },
  other: { en: "device not named", ja: "機器名の記載なし" },
};

export function openingName(lang: Lang, c: Pick<Case, "opening" | "openingLabel">): string {
  return c.openingLabel?.[lang] ?? NAME[c.opening][lang];
}

export function openingTag(lang: Lang, o: Opening): string | undefined {
  return TAG[o]?.[lang];
}

export const STATUS: Record<"stated" | "presumed" | "unknown", Record<Lang, string>> = {
  stated: { en: "Stated", ja: "記載" },
  presumed: { en: "Presumed", ja: "推定" },
  unknown: { en: "Unknown", ja: "不明" },
};

// "2021-10-31 08:55" stays as is; approximate times get a mark.
export function stamp(lang: Lang, date: string, approx = false): string {
  if (!approx) return date;
  return lang === "ja" ? `${date}ごろ` : `c. ${date}`;
}

// Break a label into lines of at most `max` characters, at spaces when there are any.
export function wrap(text: string, max: number): string[] {
  if (text.length <= max) return [text];
  const words = text.split(" ");
  if (words.length === 1) {
    const out: string[] = [];
    for (let i = 0; i < text.length; i += max) out.push(text.slice(i, i + max));
    return out;
  }
  const out: string[] = [];
  let line = "";
  for (const w of words) {
    if (line && `${line} ${w}`.length > max) {
      out.push(line);
      line = w;
    } else line = line ? `${line} ${w}` : w;
  }
  if (line) out.push(line);
  return out;
}
