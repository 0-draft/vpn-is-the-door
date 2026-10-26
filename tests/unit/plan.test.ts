import { describe, expect, it } from "vitest";
import {
  closeAngle,
  doorEnds,
  gapRect,
  LAYOUTS,
  type Layout,
  type Pt,
  panOffset,
  polylineLength,
  type Rect,
  STEP_FOCUS_TALL,
  swingPath,
  tall,
  tallySquares,
  VPN_LABEL_BOTTOM,
  walls,
} from "../../src/lib/plan";

const inside = (p: Pt, r: Rect, pad = 0) =>
  p[0] >= r.x - pad && p[0] <= r.x + r.w + pad && p[1] >= r.y - pad && p[1] <= r.y + r.h + pad;

// Intersection of an axis-aligned route segment with an axis-aligned wall.
function crossing(a: Pt, b: Pt, w: [Pt, Pt]): Pt | null {
  const [p, q] = w;
  const segH = a[1] === b[1];
  const wallH = p[1] === q[1];
  if (segH === wallH) return null;
  const [h1, h2, v1, v2] = segH ? [a, b, p, q] : [p, q, a, b];
  const x = v1[0];
  const y = h1[1];
  const inH = x >= Math.min(h1[0], h2[0]) && x <= Math.max(h1[0], h2[0]);
  const inV = y >= Math.min(v1[1], v2[1]) && y <= Math.max(v1[1], v2[1]);
  return inH && inV ? [x, y] : null;
}

function openings(l: Layout): Rect[] {
  return [...l.doors.map((d) => gapRect(d)), ...l.windows.map((w) => gapRect(w))];
}

describe.each(LAYOUTS.map((l) => [l.name, l] as const))("floor plan (%s)", (_name, l) => {
  it("route segments are axis-aligned", () => {
    for (const [id, pts] of Object.entries(l.route)) {
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1] as Pt;
        const b = pts[i] as Pt;
        expect(a[0] === b[0] || a[1] === b[1], `${id}[${i}]`).toBe(true);
      }
    }
  });

  it("the route only passes through walls at doorways", () => {
    const gaps = openings(l);
    for (const [id, pts] of Object.entries(l.route)) {
      for (let i = 1; i < pts.length; i++) {
        for (const w of walls(l)) {
          const x = crossing(pts[i - 1] as Pt, pts[i] as Pt, w);
          if (!x) continue;
          expect(
            gaps.some((g) => inside(x, g)),
            `${id} crosses a wall at ${x}`,
          ).toBe(true);
        }
      }
    }
  });

  it("the intruder enters and leaves by the VPN door, not another opening", () => {
    const vpn = l.doors.find((d) => d.outer === "vpn");
    expect(vpn).toBeDefined();
    const g = gapRect(vpn!);
    const enter = l.route.in;
    const leave = l.route.out;
    const crossesOuter = (pts: Pt[]) =>
      walls(l)
        .slice(0, 4)
        .flatMap((w) => pts.slice(1).map((b, i) => crossing(pts[i] as Pt, b, w)))
        .filter((p): p is Pt => p !== null)
        .filter((p, i, arr) => arr.findIndex((q) => q[0] === p[0] && q[1] === p[1]) === i);
    for (const pts of [enter, leave]) {
      const xs = crossesOuter(pts);
      expect(xs.length).toBe(1);
      expect(inside(xs[0] as Pt, g)).toBe(true);
    }
  });

  it("stations sit on the route", () => {
    const all = Object.values(l.route).flat();
    for (const [id, s] of Object.entries(l.stations)) {
      expect(
        all.some((p) => p[0] === s[0] && p[1] === s[1]),
        id,
      ).toBe(true);
    }
  });

  it("doors open into the building and fit their wall", () => {
    for (const d of l.doors) {
      const { closed, open } = doorEnds(d);
      expect(inside(closed, l.outer, 0.01), `${d.id} closed`).toBe(true);
      expect(inside(open, l.outer, 0.01), `${d.id} opens inward`).toBe(true);
      expect(Math.abs(closeAngle(d))).toBe(90);
      expect(swingPath(d)).toMatch(/^M[\d.]+ [\d.]+ A/);
    }
  });

  it("rooms tile the building interior", () => {
    const area = l.rooms.reduce((s, r) => s + r.rect.w * r.rect.h, 0);
    expect(area).toBe(l.outer.w * l.outer.h);
    for (const r of l.rooms) expect(inside(r.label, r.rect), r.id).toBe(true);
  });

  it("fixtures sit inside their room", () => {
    for (const f of l.fixtures) {
      const room = l.rooms.find((r) => r.id === f.room)!;
      expect(inside([f.rect.x, f.rect.y], room.rect)).toBe(true);
      expect(inside([f.rect.x + f.rect.w, f.rect.y + f.rect.h], room.rect)).toBe(true);
    }
  });

  it("tally squares stay outside the building and inside the viewBox", () => {
    const [vx, vy, vw, vh] = l.viewBox;
    const box = { x: vx, y: vy, w: vw, h: vh };
    for (const t of l.tallies) {
      for (const s of tallySquares(t, 61)) {
        const c: Pt = [s.x + 5, s.y + 5];
        expect(inside(c, l.outer), `${t.opening} square ${s.i} inside building`).toBe(false);
        expect(inside(c, box), `${t.opening} square ${s.i} outside viewBox`).toBe(true);
      }
    }
  });

  it("route lengths are positive for stroke animation", () => {
    for (const pts of Object.values(l.route)) expect(polylineLength(pts)).toBeGreaterThan(0);
  });
});

describe("panOffset", () => {
  it("centres the focus range and clamps to the drawing", () => {
    expect(panOffset([400, 500], [0, 1000], 1000, 400)).toBe(250);
    expect(panOffset([0, 100], [0, 1000], 1000, 400)).toBe(0);
    expect(panOffset([900, 1000], [0, 1000], 1000, 400)).toBe(600);
    expect(panOffset([0, 1000], [0, 500], 400, 600)).toBe(0);
  });
  it("keeps the end of a range taller than the window in view", () => {
    expect(panOffset([100, 900], [0, 1000], 1000, 400)).toBe(500);
  });
  it("covers every scrolly step", () => {
    for (let n = 0; n <= 7; n++) expect(STEP_FOCUS_TALL[n]).toBeDefined();
  });
  // sticky window heights measured on 360x640, 390x844 and 412x915 phones
  it.each([
    [360, 370],
    [390, 496],
    [412, 540],
  ])("steps 2-7 keep the VPN door label in the window at %ipx wide", (w, win) => {
    const [, vy, , vh] = tall.viewBox;
    const svgPx = (w * vh) / tall.viewBox[2];
    const k = svgPx / vh;
    for (let n = 2; n <= 7; n++) {
      const off = panOffset(STEP_FOCUS_TALL[n]!, [vy, vh], svgPx, win);
      expect((VPN_LABEL_BOTTOM - vy) * k - off, `step ${n}`).toBeLessThanOrEqual(win);
      expect((tall.stations.s1[1] - vy) * k - off, `step ${n}`).toBeGreaterThanOrEqual(0);
    }
  });
});
