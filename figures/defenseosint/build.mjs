// Fig 1: DefenseOSINT as a dispatch switchboard.
//
// The Planner is a rotary hub; every other service sits at the end of a railed arm. A message is a
// shuttle that rides out along an arm and back, so nothing ever travels station to station: only
// the hub dispatches, and only the hub's card index remembers. The Critic's flag goes up when it
// rejects a brief, and the next round of shuttles is the Planner's targeted follow-up.
//
//   node figures/defenseosint/build.mjs            writes the site module and the preview pages
//
// Outputs:
//   components/defenseosint/figure-art.ts          SVG markup and camera for the site component
//   figures/defenseosint/out/defenseosint.html     standalone live page (preview, checks)
//   figures/defenseosint/out/defenseosint.svg      still, for READMEs

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../../lib/iso/iso-kit.mjs";
import * as G from "../../lib/iso/lathe.mjs";
import { STATIONS, TRACE } from "./model.mjs";
import { COBALT_CSS } from "./theme.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "../..");

const WIDTH = 760;
const HEIGHT = 440;

// World layout, in units of about one px of the real object. z is up, the plate top is z = 0.
const PLATE = { x: -150, y: -150, w: 300, d: 300, r: 12 };
const PLATE_H = 12;
const FOOT_H = 5;
const ARM_IN = 36; // inner end stop
const ARM_OUT = 90; // station face
const ST_IN = 90;
const ST_OUT = 134;
const ST_HALF = 22;
const TOP = 27; // station top
const SHUTTLE = [42, 58]; // shuttle span along its arm, at rest by the hub
export const TRAVEL = 30; // how far a shuttle rides out

const deg = (a) => (a * Math.PI) / 180;
/** Arm-local (r along the arm, t across it) to world floor coordinates. */
const W = (theta, r, t) => {
  const c = Math.cos(theta), s = Math.sin(theta);
  return [r * c - t * s, r * s + t * c];
};
const ring = (theta, r0, r1, t0, t1, rad = 1.5, steps = 4) =>
  k.ringOf({ x: r0, y: t0, w: r1 - r0, d: t1 - t0, r: rad }, steps).map(([r, t]) => W(theta, r, t));

const P = k.fitProjection(
  [
    ...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0),
    [112, 0, TOP + 42], // collector mast tip
    [-104, 0, TOP + 30], // analyst sheet
  ],
  WIDTH,
  HEIGHT,
  { pad: 14, azimuth: 35 },
);

const at = (point) => k.iso(point, P);
const depth = (x, y, z = 0) => k.depthOf([x, y, z], P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const box = (theta, r0, r1, t0, t1, z, h, { rad = 1.5, bevel = 0, steps = 4 } = {}) =>
  k.extrude(ring(theta, r0, r1, t0, t1, rad, steps), z, h, P, { bevel });
const byDepth = (items) => [...items].sort((a, b) => a.key - b.key).map((item) => item.svg).join("");
const item = (x, y, z, svg) => ({ key: depth(x, y, z), svg });

// ---------- base ----------
function base() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  const feet = k.corners(PLATE, 26).map(([x, y]) =>
    item(x, y, 0, S(k.cylinder(x, y, 8, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: "lo" }) + S(k.cylinder(x, y, 6.2, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" })),
  );
  out.push(byDepth(feet));
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 10, 1.6), { tone: "mid", inner: L(k.sideSeam(PLATE, -5, P, 10), { tone: "faint" }) }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 6), 0, P, 10), { tone: "lo" }));
  const screws = k.corners(PLATE, 13);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.4, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.55 }));

  // Two ruler strips along the near edges.
  const rx = { x: -118, y: 136, w: 236, d: 6, r: 1 };
  const ry = { x: 136, y: -118, w: 6, d: 236, r: 1 };
  out.push(S(k.slabOf(rx, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  out.push(S(k.slabOf(ry, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  const tx = k.topTicks(rx.x + 4, rx.x + rx.w - 4, 4, 5, rx.y, 0.6, [2, 3.6], P, "x");
  const ty = k.topTicks(ry.y + 4, ry.y + ry.d - 4, 4, 5, ry.x, 0.6, [2, 3.6], P, "y");
  out.push(L(tx.minor + ty.minor, { tone: "lo" }), L(tx.major + ty.major, { tone: "mid" }));
  out.push(D([at([rx.x + 2, rx.y + 3, 0.6]), at([rx.x + rx.w - 2, rx.y + 3, 0.6]), at([ry.x + 3, ry.y + 2, 0.6]), at([ry.x + 3, ry.y + ry.d - 2, 0.6])], { size: 0.45 }));

  // Label plate in the free corner, three rule lines standing for printed text.
  const label = { x: -138, y: 92, w: 42, d: 30, r: 2 };
  out.push(S(k.slabOf(label, 0, 0.8, P, 4, 0.4), { tone: "lo" }));
  out.push(L(k.planOutline(k.insetPlan(label, 2), 0.8, P, 4), { tone: "faint" }));
  out.push(L([[8, 30], [14, 24], [20, 28]].map(([y, w]) => k.lineOnTop([label.x + 6, label.y + y], [label.x + 6 + w, label.y + y], 0.8, P)).join(""), { tone: "lo", free: true }));
  out.push(D([at([label.x + 3.2, label.y + 3.2, 0.8]), at([label.x + label.w - 3.2, label.y + label.d - 3.2, 0.8])], { size: 0.4 }));

  // A closed slot under every arm, between its rails.
  for (const s of STATIONS) out.push(L(k.onTop(ring(deg(s.angle), ARM_IN + 6, ARM_OUT - 4, -1.6, 1.6, 1.6, 4), 0, P, true), { tone: "faint" }));
  return out.join("");
}

// ---------- arms: rails, stop, shuttle ----------
function arm(s) {
  const th = deg(s.angle);
  const parts = [];
  for (const [t0, t1] of [[-7.5, -4.5], [4.5, 7.5]]) {
    const [x, y] = W(th, (ARM_IN + ARM_OUT) / 2, (t0 + t1) / 2);
    parts.push(item(x, y, 0, S(box(th, ARM_IN + 3, ARM_OUT, t0, t1, 0, 2.5, { rad: 0.8, bevel: 0.3 }), { tone: "mid" }) + D([W(th, ARM_IN + 7, (t0 + t1) / 2), W(th, ARM_OUT - 4, (t0 + t1) / 2)].map(([px, py]) => at([px, py, 2.5])), { size: 0.35 })));
  }
  const [sx, sy] = W(th, ARM_IN + 1.5, 0);
  parts.push(item(sx, sy, 0, S(box(th, ARM_IN, ARM_IN + 3.5, -10, 10, 0, 7, { rad: 0.8, bevel: 0.4 }), { tone: "mid" }) + D([-6.5, 6.5].map((t) => W(th, ARM_IN + 1.75, t)).map(([px, py]) => at([px, py, 7])), { size: 0.4 })));
  return byDepth(parts);
}

function shuttle(s) {
  const th = deg(s.angle);
  const [r0, r1] = SHUTTLE;
  const parts = [
    S(box(th, r0, r1, -8, 8, 2.5, 4.5, { rad: 2, bevel: 0.5, steps: 5 }), { tone: "mid", inner: L(k.ringSeam(ring(th, r0, r1, -8, 8, 2, 5), 4.4, P), { tone: "faint" }) }),
    S(box(th, r0 + 2.5, r1 - 2.5, -5.5, 5.5, 7, 0.6, { rad: 0.6 }), { tone: "hi" }),
    L(k.onTop([W(th, r0 + 5, -3), W(th, r1 - 5, -3)], 7.6, P), { tone: "lo", free: true }),
    L(k.onTop([W(th, r0 + 5, 0), W(th, r1 - 7, 0)], 7.6, P), { tone: "lo", free: true }),
    D([W(th, r0 + 1.5, -6), W(th, r0 + 1.5, 6), W(th, r1 - 1.5, -6), W(th, r1 - 1.5, 6)].map(([px, py]) => at([px, py, 7])), { size: 0.35 }),
  ];
  const dir = [Math.cos(th), Math.sin(th), 0];
  const rest = s.id === "gateway" ? TRAVEL : 0; // the Gateway's shuttle waits at the station with the objective
  return `<g data-shuttle="${s.id}" data-dir="${dir.map((v) => v.toFixed(4)).join(" ")}" transform="${k.translateAlong(P, dir.map((v) => v * rest))}">${parts.join("")}</g>`;
}

// ---------- stations ----------
const VIEW = k.towardViewer(P);
const RIGHT = [VIEW[1], -VIEW[0]]; // the floor direction that runs left to right on screen
const dot2 = (a, b) => a[0] * b[0] + a[1] * b[1];
/** Station-local drawing helpers. Machinery sits at the far end of the top, the name plate at the near end. */
function local(s) {
  const th = deg(s.angle);
  const out = [Math.cos(th), Math.sin(th)];
  const flip = dot2(out, VIEW) < 0;
  const R = (r) => (flip ? ST_IN + ST_OUT - r : r);
  return {
    th,
    flip,
    R,
    W: (r, t) => W(th, R(r), t),
    box: (r0, r1, t0, t1, z, h, o) => box(th, Math.min(R(r0), R(r1)), Math.max(R(r0), R(r1)), t0, t1, z, h, o),
    ring: (r0, r1, t0, t1, rad, steps) => ring(th, Math.min(R(r0), R(r1)), Math.max(R(r0), R(r1)), t0, t1, rad, steps),
    // r of the face of a thin plate (r0..r1) that looks at the viewer
    face: (r0, r1) => (flip ? Math.min(R(r0), R(r1)) - 0.1 : Math.max(R(r0), R(r1)) + 0.1),
  };
}

/** A transform that lays text flat at a point, running along u and with its foot toward n. */
function flatText(at3, u, n) {
  const o = k.iso(at3, P);
  const ex = k.iso([at3[0] + u[0], at3[1] + u[1], at3[2]], P);
  const ey = k.iso([at3[0] + n[0], at3[1] + n[1], at3[2]], P);
  const f = (v) => Math.round(v * 1000) / 1000;
  return `matrix(${f(ex[0] - o[0])} ${f(ex[1] - o[1])} ${f(ey[0] - o[0])} ${f(ey[1] - o[1])} ${f(o[0])} ${f(o[1])})`;
}
/** Text across an arm, reading left to right, foot toward the viewer. */
function acrossText(th, at3) {
  let u = [-Math.sin(th), Math.cos(th)];
  if (dot2(u, RIGHT) < 0) u = [-u[0], -u[1]];
  let n = [Math.cos(th), Math.sin(th)];
  if (dot2(n, VIEW) < 0) n = [-n[0], -n[1]];
  return flatText(at3, u, n);
}
function shell(s, { lit = false } = {}) {
  const th = deg(s.angle);
  const parts = [];
  const [px, py] = W(th, (ST_IN + ST_OUT) / 2, 0);
  parts.push({ key: depth(px, py, 0) - 0.5, svg: S(box(th, ST_IN - 2, ST_OUT + 2, -ST_HALF - 2, ST_HALF + 2, 0, 3, { rad: 2.5, bevel: 0.5 }), { tone: "lo" }) });
  const body = ring(th, ST_IN, ST_OUT, -ST_HALF, ST_HALF, 3, 5);
  parts.push({ key: depth(px, py, 0), svg: S(k.extrude(body, 3, TOP - 3, P, { bevel: 1 }), { tone: lit ? "hi" : "mid", crease: "lo", lit, inner: L(k.ringSeam(body, 11, P), { tone: "faint" }) }) });
  // The mouth the shuttle docks in, on the face toward the hub.
  const [mx, my] = W(th, ST_IN - 2, 0);
  parts.push({ key: depth(mx, my, 0), svg: S(box(th, ST_IN - 4, ST_IN + 0.5, -11, 11, 0, 14, { rad: 1, bevel: 0.4 }), { tone: "mid" }) + L(k.onTop(ring(th, ST_IN - 3, ST_IN - 0.5, -8.5, 8.5, 0.8), 14, P, true), { tone: "lo" }) });
  const shellSvg = byDepth(parts);
  // Name plate (at the near end) and corner screws on the top.
  const $ = local(s);
  const plate = $.ring(ST_OUT - 15, ST_OUT - 4, -15, 15, 1);
  const [nx, ny] = $.W(ST_OUT - 9.5, 0);
  const top = [
    S(k.extrude(plate, TOP, 0.6, P, { bevel: 0.3 }), { tone: "lo" }),
    k.faceTextSvg(acrossText(th, [nx, ny, TOP + 0.6]), s.plate, { size: 3.6, tone: "hi", anchor: "middle" }),
    D([[-ST_HALF + 3.5, ST_IN + 3.5], [ST_HALF - 3.5, ST_IN + 3.5], [-ST_HALF + 3.5, ST_OUT - 3.5], [ST_HALF - 3.5, ST_OUT - 3.5]].map(([t, r]) => W(th, r, t)).map(([x, y]) => at([x, y, TOP])), { size: 0.45 }),
  ].join("");
  return shellSvg + top;
}

let GAUGE = [0, 0];

function gateway(s) {
  const th = deg(s.angle);
  const $ = local(s);
  const parts = [];
  // Intake tray with the objective sheet in it.
  const [tx, ty] = $.W(103, -8);
  parts.push(item(tx, ty, TOP, S($.box(94, 112, -18, 2, TOP, 2.2, { rad: 1, bevel: 0.3 }), { tone: "mid" }) + S($.box(96.5, 109.5, -15.5, -0.5, TOP + 2.2, 0.4, { rad: 0.4 }), { tone: "hi", crease: "none" }) + L([0, 4, 8].map((d) => k.onTop([$.W(99 + d, -13), $.W(99 + d, -4 - d * 0.6)], TOP + 2.6, P)).join(""), { tone: "lo", free: true })));
  // The key lock: authentication happens here before anything reaches the hub.
  const [lx, ly] = $.W(104, 11);
  parts.push(item(lx, ly, TOP, S(k.cylinder(lx, ly, 6, TOP, 1.4, P, 32), { tone: "lo" }) + S(k.cylinder(lx, ly, 4.6, TOP + 1.4, 3.6, P, 32, 0.4), { tone: "mid" }) + L(k.knurl(lx, ly, 4.6, TOP + 1.4, TOP + 5, 32, P), { tone: "lo" }) + L(k.onTop($.ring(102.4, 105.6, 10.4, 11.6, 0.5), TOP + 5, P, true), { tone: "hi" })));
  return shell(s) + byDepth(parts);
}

function collector(s) {
  const th = deg(s.angle);
  const $ = local(s);
  const [mx, my] = $.W(104, 0);
  const mast = [];
  mast.push(S(k.cylinder(mx, my, 5, TOP, 3, P, 28, 0.4), { tone: "mid" }));
  const post = (z0, z1) => S(k.cylinder(mx, my, 2.4, z0, z1 - z0, P, 24), { tone: "mid", crease: "none" });
  const bar = (z, half) => S($.box(102.6, 105.4, -half, half, z, 2, { rad: 0.8, bevel: 0.3 }), { tone: "mid" }) + D([$.W(104, -half + 1.2), $.W(104, half - 1.2)].map(([x, y]) => at([x, y, z + 2])), { size: 0.5, tone: "hi" });
  mast.push(post(TOP + 3, TOP + 26) + L([TOP + 10, TOP + 18].map((z) => k.sideArc(mx, my, 2.4, z, P, 16)).join(""), { tone: "faint" }));
  mast.push(bar(TOP + 26, 13), post(TOP + 28, TOP + 33), bar(TOP + 33, 8), post(TOP + 35, TOP + 40));
  mast.push(S(k.cylinder(mx, my, 3.2, TOP + 40, 2, P, 24, 0.3), { tone: "hi" }));
  // Receiver box with vent slots, beside the mast.
  const [rx, ry] = $.W(114, -10);
  const receiver = S($.box(110, 118, -17, -3, TOP, 6, { rad: 1, bevel: 0.4 }), { tone: "mid" }) + L([-14, -10, -6].map((t) => k.onTop($.ring(111.5, 116.5, t - 0.6, t + 0.6, 0.6), TOP + 6, P, true)).join(""), { tone: "lo" });
  const parts = [item(mx, my, TOP, mast.join("")), item(rx, ry, TOP, receiver)];
  return shell(s) + byDepth(parts);
}

function entity(s) {
  const th = deg(s.angle);
  const $ = local(s);
  // Four sorting bins: people, organisations, locations, events.
  const bins = [0, 1, 2, 3].map((i) => {
    const t0 = -20 + i * 10.4;
    const [bx, by] = $.W(102, t0 + 4.5);
    const cards = [[100, 0.6], [104, 1.4]].slice(0, i % 2 ? 2 : 1).map(([r, lift]) => S($.box(r - 0.4, r + 0.4, t0 + 1.8, t0 + 7.2, TOP + 6, 3 + lift, { rad: 0.2 }), { tone: "hi", crease: "none" }));
    return item(bx, by, TOP, S($.box(95, 109, t0, t0 + 9, TOP, 6, { rad: 1, bevel: 0.4 }), { tone: "hi", lit: true }) + L(k.onTop($.ring(96.3, 107.7, t0 + 1.3, t0 + 7.7, 0.6), TOP + 6, P, true), { tone: "lo" }) + cards.join(""));
  });
  // The feed hopper the documents drop through.
  const [hx, hy] = $.W(114, 0);
  const hopper = item(hx, hy, TOP, S($.box(111, 117, -9, 9, TOP, 3, { rad: 1, bevel: 0.4 }), { tone: "mid" }) + L(k.onTop($.ring(112.5, 115.5, -7, 7, 0.8), TOP + 3, P, true), { tone: "lo" }));
  return shell(s, { lit: true }) + byDepth([...bins, hopper]);
}

function analyst(s) {
  const th = deg(s.angle);
  const $ = local(s);
  const across = [-Math.sin(th), Math.cos(th), 0];
  const parts = [];
  for (const t of [-17, 17]) {
    const [cx, cy] = $.W(104, t);
    parts.push(item(cx, cy, TOP, S($.box(98, 110, t - 2, t + 2, TOP, 12, { rad: 1, bevel: 0.4 }), { tone: "mid" })));
    const [kx, ky] = $.W(104, t + Math.sign(t) * 3.5);
    const F = G.frameAlong([kx, ky, TOP + 8], across);
    parts.push(item(kx, ky, TOP, S(G.disc(-1.5, 1.5, 3.4, F, P), { tone: "mid" })));
  }
  const [px, py] = $.W(104, 0);
  const F = G.frameAlong([...$.W(104, -15), TOP + 8], across);
  const platen = S(G.disc(0, 30, 4.4, F, P), { tone: "mid" });
  // The brief coming off the platen, with its lines of text.
  const sheet = $.box(103.6, 104.4, -11, 11, TOP + 12.4, 17, { rad: 0.2 });
  const face = (r) => [TOP + 26, TOP + 23, TOP + 20, TOP + 17].map((z, i) => k.segment([...W(th, r, -8), z], [...W(th, r, 8 - i * 3), z], P)).join("");
  parts.push(item(px, py, TOP + 0.1, platen + S(sheet, { tone: "hi" }) + L(face($.face(103.6, 104.4)), { tone: "lo", free: true })));
  return shell(s) + byDepth(parts);
}

function critic(s) {
  const th = deg(s.angle);
  const $ = local(s);
  const parts = [];
  // A gauge whose needle swings to reject or pass.
  const [gx, gy] = $.W(106, 8);
  GAUGE = [gx, gy];
  const ticks = k.radialTicks(gx, gy, 6.4, 12, 3, TOP + 3, [1, 1.8], P, -Math.PI / 2, Math.PI);
  parts.push(item(gx, gy, TOP, S(k.cylinder(gx, gy, 9, TOP, 3, P, 48, 0.6), { tone: "hi", crease: "lo" }) + L(k.ring(gx, gy, 7.2, TOP + 3, P, 48), { tone: "lo" }) + L(ticks.minor, { tone: "lo" }) + L(ticks.major, { tone: "mid" }) + `<path data-part="needle" class="iso-line" data-tone="hi" data-free="end" style="stroke-width:1" d="${needle(gx, gy, -1)}"/>` + L(k.ring(gx, gy, 1.2, TOP + 3, P, 12), { tone: "mid" })));
  // The flag: up means the brief goes back to the Planner.
  const [fx, fy] = $.W(100, -16);
  const post = S(k.cylinder(fx, fy, 3.4, TOP, 2, P, 24, 0.3), { tone: "mid" }) + S(k.cylinder(fx, fy, 1.8, TOP + 2, 34, P, 20), { tone: "mid", crease: "none" }) + S(k.cylinder(fx, fy, 2.6, TOP + 36, 1.6, P, 20, 0.3), { tone: "mid" });
  const flag = S(k.cylinder(fx, fy, 2.6, TOP + 5, 9, P, 20, 0.3), { tone: "mid" }) + S($.box(99.4, 100.6, -13.8, -3, TOP + 5.5, 8, { rad: 0.6 }), { tone: "hi" });
  parts.push(item(fx, fy, TOP, post + `<g data-part="flag">${flag}</g>`));
  return shell(s) + byDepth(parts);
}

/** Needle on the Critic's gauge: −1 reject (left), +1 pass (right). */
export function needle(gx, gy, swing) {
  const a = (swing * Math.PI) / 3;
  return k.lineOnTop([gx, gy], [gx + Math.sin(a) * 5.6, gy - Math.cos(a) * 5.6], TOP + 3.2, P);
}

// ---------- the hub (Planner) and its card index ----------
const HUB_TOP = 30;
function hub() {
  const out = [];
  out.push(S(k.cylinder(0, 0, 36, 0, 5, P, 72, 0.6), { tone: "lo" }));
  out.push(S(k.cylinder(0, 0, 31, 5, 22, P, 72), { tone: "mid", inner: L(k.sideArc(0, 0, 31, 11, P, 48), { tone: "faint" }) }));
  out.push(L(k.knurl(0, 0, 31, 21, 27, 96, P, 0.3), { tone: "lo" }));
  out.push(L(k.sideArc(0, 0, 31, 21, P, 48), { tone: "faint" }));
  out.push(S(k.cylinder(0, 0, 33, 27, HUB_TOP - 27, P, 72, 0.8), { tone: "hi", crease: "lo" }));
  out.push(L(k.ring(0, 0, 30.4, HUB_TOP, P, 72), { tone: "lo" }));
  const ticks = k.radialTicks(0, 0, 30.4, 72, 6, HUB_TOP, [1.6, 3.2], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(L(k.ring(0, 0, 13, HUB_TOP, P, 48), { tone: "faint" }));
  // The name is printed on the dial face, under the pointer, like a gauge's units.
  out.push(k.faceTextSvg(flatText([VIEW[0] * 9.5, VIEW[1] * 9.5, HUB_TOP], RIGHT, VIEW), "PLANNER", { size: 2.8, tone: "mid", anchor: "middle" }));
  out.push(`<path data-part="pointer" class="iso-line" data-tone="hi" data-free="end" style="stroke-width:1.3" d="${pointer(STATIONS[0].angle)}"/>`);
  out.push(`<g data-part="pointer-tip">${D([pointerTip(STATIONS[0].angle)], { size: 1.1, tone: "hi" })}</g>`);
  out.push(S(k.cylinder(0, 0, 4.4, HUB_TOP, 4, P, 28, 0.4), { tone: "mid" }));
  out.push(S(k.cylinder(0, 0, 2.6, HUB_TOP + 4, 2, P, 20, 0.3), { tone: "hi" }));
  return out.join("");
}
export const pointer = (angle) => {
  const a = deg(angle);
  return k.lineOnTop([Math.cos(a) * 4.4, Math.sin(a) * 4.4], [Math.cos(a) * 25, Math.sin(a) * 25], HUB_TOP + 0.2, P);
};
const pointerTip = (angle) => at([Math.cos(deg(angle)) * 25, Math.sin(deg(angle)) * 25, HUB_TOP + 0.2]);

// The card index: the Planner's memory of the investigation, the only state in the system.
function index() {
  const plan = { x: -66, y: -60, w: 30, d: 22, r: 2 };
  const out = [S(k.slabOf(plan, 0, 14, P, 4, 0.6), { tone: "mid", inner: L(k.sideSeam(plan, 4, P, 4), { tone: "faint" }) })];
  out.push(L(k.planOutline(k.insetPlan(plan, 2.4), 14, P, 4), { tone: "lo" }));
  const cards = [0, 1, 2, 3, 4, 5].map((i) => {
    const x = plan.x + 4.5 + i * 4;
    const h = 5 + ((i * 7) % 4);
    const card = { x, y: plan.y + 3, w: 0.8, d: 16, r: 0.2 };
    const tab = { x, y: plan.y + 4 + ((i * 5) % 9), w: 0.8, d: 4, r: 0.2 };
    return item(x, plan.y + 11, 14, S(k.slabOf(card, 14, h, P, 2), { tone: "hi", crease: "none" }) + S(k.slabOf(tab, 14 + h, 1.4, P, 2), { tone: "hi", crease: "none" }));
  });
  out.push(byDepth(cards));
  return out.join("");
}

// The Planner's budget counter: iterations and agent calls so far (handover guide: budget.py).
function counter() {
  const plan = { x: 96, y: -136, w: 34, d: 26, r: 2.5 };
  const z = 12;
  const out = [S(k.slabOf(plan, 0, z, P, 4, 0.6), { tone: "mid", inner: L(k.sideSeam(plan, 4, P, 4), { tone: "faint" }) })];
  const digits = [["iterations", 100], ["calls", 110.5]].map(([part, x]) => {
    const win = { x, y: -133, w: 8, d: 13, r: 1 };
    return (
      S(k.slabOf(k.insetPlan(win, -1.2), z, 0.6, P, 3, 0.3), { tone: "lo" }) +
      S(k.slabOf(win, z + 0.6, 0.2, P, 3), { tone: "hi", crease: "none" }) +
      `<g data-part="${part}">${k.faceTextSvg(flatText([x + 4 + 2.2, -126.5, z + 0.8], [0, -1], [1, 0]), "0", { size: 6.4, tone: "hi", anchor: "middle" })}</g>`
    );
  });
  out.push(digits.join(""));
  const [kx, ky] = [125, -114];
  out.push(S(k.cylinder(kx, ky, 4.6, z, 1.2, P, 28), { tone: "lo" }) + S(k.cylinder(kx, ky, 3.6, z + 1.2, 4, P, 28, 0.4), { tone: "mid" }) + L(k.knurl(kx, ky, 3.6, z + 1.2, z + 5.2, 28, P), { tone: "lo" }) + L(k.lineOnTop([kx, ky], [kx + 3, ky], z + 5.2, P), { tone: "hi" }));
  out.push(D(k.corners(plan, 3.2).map(([x, y]) => at([x, y, z])), { size: 0.4 }));
  return out.join("");
}

// The trace printer: the Planner records every call, and the tape is that record.
function printer() {
  const plan = { x: -136, y: -136, w: 30, d: 24, r: 2.5 };
  const out = [S(k.slabOf(plan, 0, 13, P, 4, 0.6), { tone: "mid", inner: L(k.sideSeam(plan, 4, P, 4), { tone: "faint" }) })];
  // Paper roll on its cheeks, at the back.
  const F = G.frameAlong([plan.x + 4, plan.y + 7, 13 + 5], [1, 0, 0]);
  out.push(S(k.slabOf({ x: plan.x + 2, y: plan.y + 3, w: 2, d: 8, r: 0.6 }, 13, 9, P, 2, 0.3), { tone: "mid" }));
  out.push(S(G.disc(0, 22, 4.2, F, P), { tone: "hi" }));
  out.push(L(G.arcOf(F, 7, 4.2, P) + G.arcOf(F, 15, 4.2, P), { tone: "faint" }));
  out.push(S(k.slabOf({ x: plan.x + 26, y: plan.y + 3, w: 2, d: 8, r: 0.6 }, 13, 9, P, 2, 0.3), { tone: "mid" }));
  // The tape runs out of a slot across the top, printed line by line.
  out.push(L(k.planOutline({ x: plan.x + 5, y: plan.y + 12.6, w: 20, d: 1.2, r: 0.5 }, 13, P, 3), { tone: "lo" }));
  const tape = { x: plan.x + 6, y: plan.y + 13.8, w: 18, d: 22, r: 0.4 };
  out.push(S(k.slabOf(tape, 13, 0.3, P, 2), { tone: "hi", crease: "none" }));
  out.push(L([3, 6, 9, 12, 15, 18].map((d, i) => k.lineOnTop([tape.x + 2, tape.y + d], [tape.x + 16 - (i % 3) * 4, tape.y + d], 13.3, P)).join(""), { tone: "lo", free: true }));
  out.push(D(k.corners(plan, 3).map(([x, y]) => at([x, y, 13])), { size: 0.4 }));
  return out.join("");
}

// ---------- assemble ----------
const builders = { gateway, collector, entity, analyst, critic };
const groups = [];
for (const s of STATIONS) {
  const th = deg(s.angle);
  const [ax, ay] = W(th, (ARM_IN + ARM_OUT) / 2, 0);
  const [sx, sy] = W(th, (ST_IN + ST_OUT) / 2, 0);
  groups.push({ key: depth(ax, ay), svg: arm(s) });
  groups.push({ key: depth(ax, ay) + 0.01, svg: shuttle(s) });
  groups.push({ key: depth(sx, sy), svg: `<g class="station" data-station="${s.id}" tabindex="0" role="button" aria-label="${s.name}">${builders[s.id](s)}</g>` });
}
groups.push({ key: depth(0, 0), svg: `<g class="station" data-station="planner" tabindex="0" role="button" aria-label="Planner">${hub()}</g>` });
groups.push({ key: depth(-51, -49), svg: index() });
groups.push({ key: depth(113, -123), svg: counter() });
groups.push({ key: depth(-121, -124), svg: printer() });

const LABEL =
  "DefenseOSINT drawn as a dispatch switchboard. The Planner is a rotary hub in the middle with a card index beside it, its only memory. Five railed arms run out to the other services: the Gateway with a key lock, the Collector with an antenna mast, the Entity Extractor with four sorting bins, the Analyst with a platen and a typed sheet, and the Critic with a gauge and a flag. Shuttles carry each message out from the hub and back; when the Critic rejects a brief its flag goes up and the Planner sends a targeted follow-up round.";

const body = [base(), byDepth(groups)];
const svg = k.figureSvg({ width: WIDTH, height: HEIGHT, label: LABEL, body });

// ---------- outputs ----------
const live = {
  P,
  travel: TRAVEL,
  stations: STATIONS.map((s) => ({ ...s })),
  trace: TRACE,
  gauge: GAUGE,
  top: TOP,
  hubTop: HUB_TOP,
};

mkdirSync(join(ROOT, "components/defenseosint"), { recursive: true });
writeFileSync(
  join(ROOT, "components/defenseosint/figure-art.ts"),
  `// Generated by figures/defenseosint/build.mjs. Do not edit by hand.\n\nexport const FIGURE_SVG = ${JSON.stringify(svg.replace('role="img"', 'role="group"'))};\n\nexport const FIGURE = ${JSON.stringify(live)} as const;\n`,
);

// Kit styles plus the cobalt theme, imported once by the site component.
writeFileSync(join(ROOT, "components/defenseosint/figure.css"), `/* Generated by figures/defenseosint/build.mjs. */\n${k.ISO_CSS}\n${COBALT_CSS}`);

const OUT = join(HERE, "out");
mkdirSync(OUT, { recursive: true });
const still = k.figureSvg({ width: WIDTH, height: HEIGHT, label: LABEL, body: [`<style>${COBALT_CSS}</style>`, ...body], standalone: "light", className: "cobalt" }).replace("<svg", `<svg style="background:#ddd0b9"`);
writeFileSync(join(OUT, "defenseosint.svg"), still);

const kitSource = readFileSync(join(ROOT, "lib/iso/iso-kit.mjs"), "utf8").replace(/^export /gm, "");
const liveSource = readFileSync(join(HERE, "live.mjs"), "utf8").replace(/^import .*$/gm, "").replace(/^export /gm, "");
const page = k.pageHtml({
  title: "DefenseOSINT switchboard",
  theme: "light",
  width: 820,
  body: `<style>${COBALT_CSS}.iso-page{background:#e6dbc7}</style><div class="iso cobalt" data-theme="light"><div class="iso-plate"><div class="iso-stage" data-figure>${svg}</div><p data-readout style="font-family:var(--anatomy-mono);color:var(--anatomy-text);margin:12px 0 0">gateway · objective in</p></div></div>`,
  script: `${kitSource}\n${liveSource}\nconst FIGURE = ${JSON.stringify(live)};\nconst stage = document.querySelector("[data-figure]");\nconst readout = document.querySelector("[data-readout]");\nmountFigure(stage, FIGURE, { onReadout: (text) => (readout.textContent = text) });`,
});
writeFileSync(join(OUT, "defenseosint.html"), page);
console.log("wrote figure-art.ts, out/defenseosint.svg, out/defenseosint.html");
