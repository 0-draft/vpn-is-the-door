// Floor plan of Minato Precision's head office (fictional), the anchor figure.
// Two hand-placed layouts share ids: "wide" for desktop, "tall" for phones, so
// labels stay ≥14px at render size instead of shrinking with one viewBox.

export type Pt = [number, number];
export type Dir = "n" | "s" | "e" | "w";
export type RoomId = "office" | "it" | "server" | "backup" | "meeting" | "reception" | "store" | "corridor";
export type OpeningId = "vpn" | "rdp" | "mail" | "other";
export type StationId = "s1" | "s2" | "s3" | "s4";
export type SegmentId = "in" | "toKeys" | "toBackup" | "out";

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Room {
  id: RoomId;
  rect: Rect;
  label: Pt;
}

export interface Door {
  id: string;
  hinge: Pt;
  along: Dir; // from the hinge toward the other jamb
  swing: Dir; // the side the leaf opens into
  len: number;
  outer?: OpeningId;
}

export interface Window {
  id: OpeningId;
  from: Pt;
  to: Pt;
}

export interface Tally {
  opening: OpeningId;
  origin: Pt; // first square's wall-side centre line, just outside the wall
  grow: Dir; // away from the wall
  along: Dir; // across the opening
  label: Pt;
  anchor: "start" | "middle" | "end";
}

export interface Fixture {
  id: "keys" | "fileserver" | "nas" | "pcs";
  room: RoomId;
  rect: Rect;
}

export interface Layout {
  name: "wide" | "tall";
  viewBox: [number, number, number, number];
  outer: Rect;
  innerWalls: [Pt, Pt][];
  rooms: Room[];
  doors: Door[];
  windows: Window[];
  tallies: Tally[];
  fixtures: Fixture[];
  stations: Record<StationId, Pt>;
  route: Record<SegmentId, Pt[]>;
  openingLabels: Record<OpeningId, { at: Pt; anchor: "start" | "middle" | "end" }>;
  labelSize: number;
}

export const WALL = 8;
export const UNIT = 10;
export const UNIT_GAP = 2;
export const PER_COLUMN = 10;

const DIRS: Record<Dir, Pt> = { n: [0, -1], s: [0, 1], e: [1, 0], w: [-1, 0] };
export const dirVec = (d: Dir): Pt => DIRS[d];

const add = (a: Pt, b: Pt, k = 1): Pt => [a[0] + b[0] * k, a[1] + b[1] * k];

export const wide: Layout = {
  name: "wide",
  viewBox: [0, 0, 1100, 640],
  outer: { x: 200, y: 40, w: 660, h: 480 },
  innerWalls: [
    [
      [200, 300],
      [860, 300],
    ],
    [
      [200, 380],
      [860, 380],
    ],
    [
      [470, 40],
      [470, 300],
    ],
    [
      [650, 40],
      [650, 300],
    ],
    [
      [650, 170],
      [860, 170],
    ],
    [
      [400, 380],
      [400, 520],
    ],
    [
      [620, 380],
      [620, 520],
    ],
  ],
  rooms: [
    { id: "office", rect: { x: 200, y: 40, w: 270, h: 260 }, label: [335, 150] },
    { id: "it", rect: { x: 470, y: 40, w: 180, h: 260 }, label: [560, 74] },
    { id: "server", rect: { x: 650, y: 40, w: 210, h: 130 }, label: [755, 75] },
    { id: "backup", rect: { x: 650, y: 170, w: 210, h: 130 }, label: [755, 205] },
    { id: "corridor", rect: { x: 200, y: 300, w: 660, h: 80 }, label: [300, 346] },
    { id: "meeting", rect: { x: 200, y: 380, w: 200, h: 140 }, label: [300, 455] },
    { id: "reception", rect: { x: 400, y: 380, w: 220, h: 140 }, label: [510, 440] },
    { id: "store", rect: { x: 620, y: 380, w: 240, h: 140 }, label: [740, 455] },
  ],
  doors: [
    { id: "vpn", hinge: [860, 315], along: "s", swing: "w", len: 50, outer: "vpn" },
    { id: "main", hinge: [480, 520], along: "e", swing: "n", len: 60, outer: "mail" },
    { id: "loading", hinge: [760, 520], along: "e", swing: "n", len: 60, outer: "other" },
    { id: "office", hinge: [400, 300], along: "e", swing: "n", len: 40 },
    { id: "it", hinge: [540, 300], along: "e", swing: "n", len: 40 },
    { id: "backup", hinge: [740, 300], along: "e", swing: "n", len: 40 },
    { id: "server", hinge: [650, 90], along: "s", swing: "e", len: 40 },
    { id: "meeting", hinge: [300, 380], along: "e", swing: "s", len: 40 },
    { id: "reception", hinge: [490, 380], along: "e", swing: "s", len: 40 },
    { id: "store", hinge: [680, 380], along: "e", swing: "s", len: 40 },
  ],
  windows: [{ id: "rdp", from: [200, 420], to: [200, 480] }],
  tallies: [
    { opening: "vpn", origin: [876, 340], grow: "e", along: "s", label: [970, 326], anchor: "start" },
    { opening: "rdp", origin: [184, 450], grow: "w", along: "s", label: [150, 436], anchor: "end" },
    { opening: "mail", origin: [510, 536], grow: "s", along: "e", label: [510, 582], anchor: "middle" },
    { opening: "other", origin: [790, 536], grow: "s", along: "e", label: [790, 582], anchor: "middle" },
  ],
  fixtures: [
    { id: "keys", room: "it", rect: { x: 492, y: 112, w: 46, h: 56 } },
    { id: "fileserver", room: "server", rect: { x: 680, y: 100, w: 150, h: 46 } },
    { id: "nas", room: "backup", rect: { x: 800, y: 236, w: 44, h: 46 } },
    { id: "pcs", room: "office", rect: { x: 240, y: 190, w: 190, h: 40 } },
  ],
  stations: { s1: [860, 340], s2: [510, 340], s3: [560, 140], s4: [760, 240] },
  route: {
    in: [
      [1000, 340],
      [860, 340],
      [510, 340],
    ],
    toKeys: [
      [510, 340],
      [560, 340],
      [560, 140],
    ],
    toBackup: [
      [560, 140],
      [560, 340],
      [760, 340],
      [760, 240],
    ],
    out: [
      [760, 240],
      [760, 352],
      [870, 352],
      [1000, 352],
    ],
  },
  openingLabels: {
    vpn: { at: [880, 300], anchor: "start" },
    rdp: { at: [184, 410], anchor: "end" },
    mail: { at: [510, 560], anchor: "middle" },
    other: { at: [790, 560], anchor: "middle" },
  },
  labelSize: 18,
};

export const tall: Layout = {
  name: "tall",
  viewBox: [16, 0, 490, 830],
  outer: { x: 40, y: 100, w: 320, h: 580 },
  innerWalls: [
    [
      [180, 100],
      [180, 680],
    ],
    [
      [236, 100],
      [236, 680],
    ],
    [
      [40, 330],
      [180, 330],
    ],
    [
      [40, 500],
      [180, 500],
    ],
    [
      [40, 590],
      [180, 590],
    ],
    [
      [236, 260],
      [360, 260],
    ],
    [
      [236, 470],
      [360, 470],
    ],
  ],
  rooms: [
    { id: "office", rect: { x: 40, y: 100, w: 140, h: 230 }, label: [110, 150] },
    { id: "it", rect: { x: 40, y: 330, w: 140, h: 170 }, label: [110, 360] },
    { id: "server", rect: { x: 40, y: 500, w: 140, h: 90 }, label: [92, 552] },
    { id: "backup", rect: { x: 40, y: 590, w: 140, h: 90 }, label: [110, 610] },
    { id: "corridor", rect: { x: 180, y: 100, w: 56, h: 580 }, label: [208, 160] },
    { id: "meeting", rect: { x: 236, y: 100, w: 124, h: 160 }, label: [298, 190] },
    { id: "reception", rect: { x: 236, y: 260, w: 124, h: 210 }, label: [298, 462] },
    { id: "store", rect: { x: 236, y: 470, w: 124, h: 210 }, label: [298, 520] },
  ],
  doors: [
    { id: "vpn", hinge: [186, 680], along: "e", swing: "n", len: 44, outer: "vpn" },
    { id: "main", hinge: [360, 330], along: "s", swing: "w", len: 56, outer: "mail" },
    { id: "loading", hinge: [360, 560], along: "s", swing: "w", len: 56, outer: "other" },
    { id: "office", hinge: [180, 270], along: "s", swing: "w", len: 40 },
    { id: "it", hinge: [180, 395], along: "s", swing: "w", len: 40 },
    { id: "backup", hinge: [180, 615], along: "s", swing: "w", len: 40 },
    { id: "server", hinge: [176, 500], along: "w", swing: "s", len: 36 },
    { id: "meeting", hinge: [236, 200], along: "s", swing: "e", len: 40 },
    { id: "reception", hinge: [236, 330], along: "s", swing: "e", len: 40 },
    { id: "store", hinge: [236, 560], along: "s", swing: "e", len: 40 },
  ],
  windows: [{ id: "rdp", from: [270, 100], to: [330, 100] }],
  tallies: [
    { opening: "vpn", origin: [208, 696], grow: "s", along: "e", label: [282, 712], anchor: "start" },
    { opening: "rdp", origin: [300, 84], grow: "n", along: "e", label: [236, 40], anchor: "end" },
    { opening: "mail", origin: [376, 358], grow: "e", along: "s", label: [392, 346], anchor: "start" },
    { opening: "other", origin: [376, 588], grow: "e", along: "s", label: [392, 576], anchor: "start" },
  ],
  fixtures: [
    { id: "keys", room: "it", rect: { x: 50, y: 440, w: 30, h: 30 } },
    { id: "fileserver", room: "server", rect: { x: 128, y: 558, w: 42, h: 24 } },
    { id: "nas", room: "backup", rect: { x: 50, y: 640, w: 34, h: 30 } },
    { id: "pcs", room: "office", rect: { x: 56, y: 200, w: 108, h: 36 } },
  ],
  stations: { s1: [208, 680], s2: [208, 350], s3: [110, 415], s4: [130, 636] },
  route: {
    in: [
      [208, 790],
      [208, 680],
      [208, 350],
    ],
    toKeys: [
      [208, 350],
      [208, 415],
      [110, 415],
    ],
    toBackup: [
      [110, 415],
      [208, 415],
      [208, 636],
      [130, 636],
    ],
    out: [
      [130, 648],
      [222, 648],
      [222, 690],
      [222, 790],
    ],
  },
  openingLabels: {
    vpn: { at: [240, 704], anchor: "start" },
    rdp: { at: [300, 60], anchor: "middle" },
    mail: { at: [376, 314], anchor: "start" },
    other: { at: [376, 546], anchor: "start" },
  },
  labelSize: 17,
};

export const LAYOUTS = [wide, tall] as const;

// ---- derived geometry -------------------------------------------------------

export function doorEnds(d: Door): { closed: Pt; open: Pt } {
  return { closed: add(d.hinge, dirVec(d.along), d.len), open: add(d.hinge, dirVec(d.swing), d.len) };
}

// Quarter-circle swing from the closed jamb to the open leaf tip.
export function swingPath(d: Door): string {
  const { closed, open } = doorEnds(d);
  const a = dirVec(d.along);
  const s = dirVec(d.swing);
  const sweep = a[0] * s[1] - a[1] * s[0] > 0 ? 1 : 0;
  return `M${closed[0]} ${closed[1]} A${d.len} ${d.len} 0 0 ${sweep} ${open[0]} ${open[1]}`;
}

// Rotation (degrees) that takes the open leaf back into the wall line.
export function closeAngle(d: Door): number {
  const a = dirVec(d.along);
  const s = dirVec(d.swing);
  const cross = s[0] * a[1] - s[1] * a[0];
  return cross > 0 ? 90 : -90;
}

// The opening cut through the wall, as a rect.
export function gapRect(d: Door | Window, thickness = WALL + 2): Rect {
  const [p, q] = "hinge" in d ? [d.hinge, doorEnds(d).closed] : [d.from, d.to];
  const horizontal = p[1] === q[1];
  const x0 = Math.min(p[0], q[0]);
  const y0 = Math.min(p[1], q[1]);
  return horizontal
    ? { x: x0, y: p[1] - thickness / 2, w: Math.abs(q[0] - p[0]), h: thickness }
    : { x: p[0] - thickness / 2, y: y0, w: thickness, h: Math.abs(q[1] - p[1]) };
}

export interface Square {
  i: number;
  x: number;
  y: number;
}

// One square per case, columns of ten growing away from the wall.
export function tallySquares(t: Tally, count: number): Square[] {
  const g = dirVec(t.grow);
  const a = dirVec(t.along);
  const step = UNIT + UNIT_GAP;
  const rows = Math.min(count, PER_COLUMN);
  const out: Square[] = [];
  for (let i = 0; i < count; i++) {
    const col = Math.floor(i / PER_COLUMN);
    const row = i % PER_COLUMN;
    const off = (row - (rows - 1) / 2) * step;
    const cx = t.origin[0] + g[0] * (col * step + UNIT / 2) + a[0] * off;
    const cy = t.origin[1] + g[1] * (col * step + UNIT / 2) + a[1] * off;
    out.push({ i, x: cx - UNIT / 2, y: cy - UNIT / 2 });
  }
  return out;
}

export function polyline(points: Pt[]): string {
  return points.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]} ${p[1]}`).join(" ");
}

export function polylineLength(points: Pt[]): number {
  let n = 0;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1] as Pt;
    const b = points[i] as Pt;
    n += Math.hypot(b[0] - a[0], b[1] - a[1]);
  }
  return Math.round(n);
}

// All wall segments, outer included, for the doorway invariant test.
export function walls(l: Layout): [Pt, Pt][] {
  const { x, y, w, h } = l.outer;
  const o: [Pt, Pt][] = [
    [
      [x, y],
      [x + w, y],
    ],
    [
      [x + w, y],
      [x + w, y + h],
    ],
    [
      [x, y + h],
      [x + w, y + h],
    ],
    [
      [x, y],
      [x, y + h],
    ],
  ];
  return [...o, ...l.innerWalls];
}

// Phone scrolly: the tall plan is drawn at full width and panned so the part
// each step talks about sits in the sticky window (viewBox y-range per step).
export const STEP_FOCUS_TALL: Record<number, [number, number]> = {
  0: [0, 400],
  1: [0, 400],
  2: [600, 740],
  3: [330, 800],
  4: [300, 600],
  5: [400, 700],
  6: [600, 800],
  7: [130, 760],
};

// Pixel offset that centres the focus range in a window of winPx, clamped to the drawing.
export function panOffset(focus: [number, number], vb: [number, number], svgPx: number, winPx: number): number {
  const max = Math.max(0, svgPx - winPx);
  const k = svgPx / vb[1];
  const centre = ((focus[0] + focus[1]) / 2 - vb[0]) * k;
  return Math.round(Math.min(max, Math.max(0, centre - winPx / 2)));
}
