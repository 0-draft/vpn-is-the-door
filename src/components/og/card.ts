// The Open Graph card: report masthead, chapter label with its scale tags, the
// page title, and a simplified head-office plan whose only red is the VPN door
// and its share. Rendered at build time by src/pages/og/[...slug].png.ts.
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import type { Lang } from "../../lib/paths";
import { fontsFor } from "./fonts";

export const OG_W = 1200;
export const OG_H = 630;

export interface CardInput {
  lang: Lang;
  title: string;
  label: string;
  scales: string[];
  siteTitle: string;
  report: string;
  vpnLabel: string;
  vpnPct: string;
  roomLabels: { office: string; server: string; backup: string; reception: string };
  nts: string;
  url: string;
}

// Light-theme tokens from research/design.md §7.
const C = {
  paper: "#F4F5F3",
  sheet: "#FFFFFF",
  ink: "#17191C",
  ink2: "#4A5058",
  ink3: "#5E656D",
  line: "#80878F",
  room: "#ECEEEF",
  wall: "#23272B",
  intruder: "#E03A00",
  intruderText: "#C2340A",
};

// Plan geometry, in the plan's own 500×440 box.
const P = { w: 500, h: 440, L: 170, R: 480, T: 24, B: 380, wall: 10 };

function planSvg(): string {
  const { L, R, T, B } = P;
  const wall = (d: string, w = P.wall) =>
    `<path d="${d}" fill="none" stroke="${C.wall}" stroke-width="${w}" stroke-linecap="square"/>`;
  const inner = (d: string) => wall(d, 6);
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${P.w} ${P.h}" width="${P.w}" height="${P.h}">`,
    `<rect x="${L}" y="${T}" width="${R - L}" height="${B - T}" fill="${C.room}"/>`,
    `<rect x="${L}" y="270" width="${R - L}" height="${B - 270}" fill="${C.sheet}"/>`,
    // outer walls, with gaps: window (top, 210–290), main entrance (bottom, 300–360), VPN door (left, 290–340)
    wall(`M${L} ${T} H210 M290 ${T} H${R} V${B} H360 M300 ${B} H${L} V340 M${L} 290 V${T}`),
    // window: three thin lines in the wall
    ...[T - 5, T, T + 5].map((y) => `<path d="M210 ${y} H290" stroke="${C.ink2}" stroke-width="1.5"/>`),
    // inner walls with door gaps
    inner(`M330 ${T} V270 M330 150 H${R} M${L} 270 H220 M260 270 H380 M420 270 H${R}`),
    // inner doors: leaf + quarter arc, in ink
    `<path d="M220 270 V230" stroke="${C.ink}" stroke-width="2"/>`,
    `<path d="M220 230 A40 40 0 0 1 260 270" fill="none" stroke="${C.line}" stroke-width="1.5"/>`,
    `<path d="M380 270 V230" stroke="${C.ink}" stroke-width="2"/>`,
    `<path d="M380 230 A40 40 0 0 1 420 270" fill="none" stroke="${C.line}" stroke-width="1.5"/>`,
    // main entrance: double leaf, and the reception counter behind it
    `<path d="M300 ${B} V${B - 30} M360 ${B} V${B - 30}" stroke="${C.ink}" stroke-width="2"/>`,
    `<path d="M300 ${B - 30} A30 30 0 0 1 330 ${B} M360 ${B - 30} A30 30 0 0 0 330 ${B}" fill="none" stroke="${C.line}" stroke-width="1.5"/>`,
    `<rect x="290" y="300" width="80" height="12" fill="${C.sheet}" stroke="${C.ink}" stroke-width="2"/>`,
    // the VPN door: open leaf into the corridor behind reception, in intruder red
    `<path d="M${L} 290 H${L + 50}" stroke="${C.intruder}" stroke-width="5"/>`,
    `<path d="M${L + 50} 290 A50 50 0 0 1 ${L} 340" fill="none" stroke="${C.intruder}" stroke-width="2.5"/>`,
    `<path d="M${L - 12} 290 H${L + 2} M${L - 12} 340 H${L + 2}" stroke="${C.wall}" stroke-width="3"/>`,
    "</svg>",
  ].join("");
}

type Node = { type: string; props: Record<string, unknown> };
const el = (
  type: string,
  style: Record<string, unknown>,
  children?: unknown,
  extra: Record<string, unknown> = {},
): Node => ({
  type,
  props: { style, children, ...extra },
});

export function titleSize(lang: Lang, title: string): number {
  const n = [...title].length;
  if (lang === "ja") return n <= 10 ? 66 : n <= 16 ? 58 : n <= 26 ? 50 : 42;
  return n <= 20 ? 70 : n <= 36 ? 60 : n <= 56 ? 52 : 44;
}

export function cardTree(c: CardInput, jaFamilies = "Public Sans"): Node {
  const ja = c.lang === "ja";
  const family = ja ? `${jaFamilies}, Public Sans` : `Public Sans, ${jaFamilies}`;
  const mono = `Atkinson Hyperlegible Mono, ${jaFamilies}`;
  const planX = 680;
  const planY = 140;
  const at = (x: number, y: number) => ({ position: "absolute", left: planX + x, top: planY + y });
  const room = (text: string, x: number, y: number, w: number) =>
    el(
      "div",
      { ...at(x - w / 2, y - 14), width: w, display: "flex", justifyContent: "center", fontSize: 22, color: C.ink2 },
      text,
    );
  const size = titleSize(c.lang, c.title);

  return el(
    "div",
    {
      width: OG_W,
      height: OG_H,
      display: "flex",
      flexDirection: "column",
      position: "relative",
      background: C.paper,
      color: C.ink,
      fontFamily: family,
    },
    [
      el(
        "div",
        {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          padding: "34px 64px 18px",
          background: C.sheet,
          borderBottom: `3px solid ${C.ink}`,
        },
        [
          el("div", { fontSize: 30, fontWeight: ja ? 700 : 800 }, c.siteTitle),
          el("div", { fontFamily: mono, fontSize: 22, color: C.ink3 }, c.report),
        ],
      ),
      el("div", { display: "flex", flexDirection: "column", padding: "52px 0 0 64px", width: 760 }, [
        el("div", { display: "flex", alignItems: "center", flexWrap: "wrap", gap: 12, fontSize: 26, color: C.ink3 }, [
          el("div", { fontWeight: 700 }, c.label),
        ]),
        el(
          "div",
          {
            marginTop: 26,
            fontSize: size,
            fontWeight: ja ? 700 : 800,
            lineHeight: ja ? 1.35 : 1.1,
            letterSpacing: ja ? "0.01em" : "-0.015em",
          },
          c.title,
        ),
      ]),
      el("img", { ...at(0, 0), width: P.w, height: P.h }, undefined, {
        src: `data:image/svg+xml;base64,${Buffer.from(planSvg()).toString("base64")}`,
        width: P.w,
        height: P.h,
      }),
      room(c.roomLabels.office, 250, 150, 150),
      room(c.roomLabels.server, 405, 90, 140),
      room(c.roomLabels.backup, 405, 212, 140),
      room(c.roomLabels.reception, 330, 336, 140),
      el(
        "div",
        {
          ...at(0, 262),
          width: 150,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          color: C.intruderText,
          lineHeight: 1.05,
        },
        [
          el("div", { fontSize: 24, fontWeight: 700 }, c.vpnLabel),
          el("div", { fontFamily: "Public Sans", fontSize: 44, fontWeight: 800 }, c.vpnPct),
        ],
      ),
      el(
        "div",
        {
          ...at(P.R - 200, P.B + 14),
          width: 200,
          display: "flex",
          justifyContent: "flex-end",
          fontFamily: mono,
          fontSize: 20,
          color: C.ink3,
        },
        c.nts,
      ),
      el("div", { position: "absolute", left: 64, bottom: 34, fontFamily: mono, fontSize: 20, color: C.ink3 }, c.url),
    ],
  );
}

export async function renderCard(c: CardInput): Promise<Buffer> {
  const text = [c.title, c.label, c.siteTitle, c.report, c.vpnLabel, c.nts, ...Object.values(c.roomLabels)].join("");
  const { fonts, ja } = fontsFor(text);
  const svg = await satori(cardTree(c, ja) as unknown as Parameters<typeof satori>[0], {
    width: OG_W,
    height: OG_H,
    fonts,
  });
  return new Resvg(svg, { fitTo: { mode: "width", value: OG_W } }).render().asPng();
}
