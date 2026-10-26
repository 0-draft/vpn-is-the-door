import type { Lang } from "./paths";

// Fig. 5-6: the order of work after a KEV entry names your VPN appliance.
// Synthesized from CISA AA24-060B, Fortinet PSIRT (2021-09-08, 2025-04-10),
// NetScaler's CVE-2023-4966 notice, JPCERT/CC and BOD 26-04 (see the page).

export type Kind = "terminal" | "process" | "decision";

export interface FlowNode {
  id: string;
  kind: Kind;
  col: "spine" | "side";
  step?: number;
  lines: Record<Lang, string[]>;
}

export const NODES: FlowNode[] = [
  {
    id: "start",
    kind: "terminal",
    col: "spine",
    lines: { en: ["A KEV entry names", "your appliance"], ja: ["KEV に自社の", "機器が載った"] },
  },
  {
    id: "preserve",
    kind: "process",
    col: "spine",
    step: 1,
    lines: {
      en: ["Preserve: export config", "and logs; memory if your", "IR provider can"],
      ja: ["保全: 設定とログを", "書き出す。可能なら", "メモリも取得する"],
    },
  },
  {
    id: "fix",
    kind: "decision",
    col: "spine",
    lines: { en: ["Fixed version", "for your model?"], ja: ["自機種の", "修正版はあるか"] },
  },
  {
    id: "patch",
    kind: "process",
    col: "spine",
    step: 2,
    lines: { en: ["Upgrade from the", "vendor's clean image"], ja: ["ベンダーの正規", "イメージから更新する"] },
  },
  {
    id: "mitigate",
    kind: "process",
    col: "side",
    lines: {
      en: ["No fix, or EOL:", "apply the vendor", "mitigation or", "disconnect; plan", "replacement"],
      ja: ["修正版なし・", "サポート終了:", "回避策か切断。", "更改を計画"],
    },
  },
  {
    id: "reset",
    kind: "process",
    col: "spine",
    step: 3,
    lines: {
      en: ["Reset every credential", "the box touched"],
      ja: ["機器が扱った認証情報", "をすべて再設定する"],
    },
  },
  {
    id: "revoke",
    kind: "process",
    col: "spine",
    step: 4,
    lines: { en: ["Revoke all sessions", "and tokens"], ja: ["全セッションと", "トークンを失効させる"] },
  },
  {
    id: "hunt",
    kind: "process",
    col: "spine",
    step: 5,
    lines: {
      en: ["Hunt behind the box:", "new accounts, logons", "from VPN addresses"],
      ja: ["機器の内側を調べる:", "新規アカウント、VPN", "アドレスからのログオン"],
    },
  },
  {
    id: "doubt",
    kind: "decision",
    col: "spine",
    lines: {
      en: ["Any sign of", "compromise, or", "not sure?"],
      ja: ["侵害の兆候が", "ある、または", "判断できないか"],
    },
  },
  {
    id: "rebuild",
    kind: "process",
    col: "side",
    step: 6,
    lines: {
      en: ["Factory reset or", "rebuild; restore a", "reviewed config;", "reset credentials", "again"],
      ja: ["初期化または", "再構築。確認済み", "の設定を戻し、", "認証情報を改めて", "再設定"],
    },
  },
  {
    id: "report",
    kind: "terminal",
    col: "spine",
    step: 7,
    lines: { en: ["Report: vendor,", "JPCERT/CC, police"], ja: ["報告: ベンダー、", "JPCERT/CC、警察"] },
  },
];

export interface Edge {
  from: string;
  to: string;
  label?: "yes" | "no";
}

export const EDGES: Edge[] = [
  { from: "start", to: "preserve" },
  { from: "preserve", to: "fix" },
  { from: "fix", to: "patch", label: "yes" },
  { from: "fix", to: "mitigate", label: "no" },
  { from: "patch", to: "reset" },
  { from: "mitigate", to: "reset" },
  { from: "reset", to: "revoke" },
  { from: "revoke", to: "hunt" },
  { from: "hunt", to: "doubt" },
  { from: "doubt", to: "rebuild", label: "yes" },
  { from: "doubt", to: "report", label: "no" },
  { from: "rebuild", to: "report" },
];

export const EDGE_LABEL: Record<Lang, Record<"yes" | "no", string>> = {
  en: { yes: "Yes", no: "No" },
  ja: { yes: "はい", no: "いいえ" },
};

// Geometry, in viewBox units. 420 wide keeps 16px text at about 14.5px on a 390px phone.
export const W = 420;
export const LINE = 20;
const SPINE = { x: 8, w: 242 };
const SIDE = { x: 270, w: 142 };
const GAP = 30;
const PAD = 18;

export interface Box {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
}

function heightOf(n: FlowNode, lang: Lang): number {
  const k = n.lines[lang].length;
  return n.kind === "decision" ? k * LINE + 56 : k * LINE + PAD;
}

export interface Layout {
  boxes: Map<string, Box>;
  height: number;
  edges: { points: [number, number][]; label?: "yes" | "no"; lx?: number; ly?: number }[];
}

export function layout(lang: Lang): Layout {
  const boxes = new Map<string, Box>();
  const node = (id: string) => NODES.find((x) => x.id === id) as FlowNode;
  let y = 8;
  for (const n of NODES.filter((x) => x.col === "spine")) {
    // a side branch that rejoins here must end, with room for the join line, above this box
    for (const e of EDGES.filter((x) => x.to === n.id && node(x.from).col === "side")) {
      const s = boxes.get(e.from);
      if (s) y = Math.max(y, s.y + s.h + GAP);
    }
    const h = heightOf(n, lang);
    boxes.set(n.id, { id: n.id, x: SPINE.x, y, w: SPINE.w, h, cx: SPINE.x + SPINE.w / 2, cy: y + h / 2 });
    // side boxes sit level with the decision that sends work to them
    for (const e of EDGES.filter((x) => x.from === n.id && node(x.to).col === "side")) {
      const sh = heightOf(node(e.to), lang);
      const top = y + h / 2 + 22;
      boxes.set(e.to, { id: e.to, x: SIDE.x, y: top, w: SIDE.w, h: sh, cx: SIDE.x + SIDE.w / 2, cy: top + sh / 2 });
    }
    y += h + GAP;
  }

  const b = (id: string) => boxes.get(id) as Box;
  const edges: Layout["edges"] = [];
  for (const e of EDGES) {
    const f = b(e.from);
    const t = b(e.to);
    if (f.x === t.x) {
      // straight down the same column
      edges.push({
        points: [
          [f.cx, f.y + f.h],
          [t.cx, t.y],
        ],
        ...(e.label ? { label: e.label, lx: f.cx + 8, ly: f.y + f.h + 18 } : {}),
      });
    } else if (t.x > f.x) {
      // decision exits right, then drops into the top of the side box
      edges.push({
        points: [
          [f.x + f.w, f.cy],
          [t.cx, f.cy],
          [t.cx, t.y],
        ],
        ...(e.label ? { label: e.label, lx: f.x + f.w + 8, ly: f.cy - 8 } : {}),
      });
    } else {
      // side column back into the spine, joining just above the target
      const join = t.y - GAP / 2;
      edges.push({
        points: [
          [f.cx, f.y + f.h],
          [f.cx, join],
          [t.cx, join],
          [t.cx, t.y],
        ],
      });
    }
  }
  const height = Math.max(...[...boxes.values()].map((x) => x.y + x.h)) + 8;
  return { boxes, height, edges };
}
