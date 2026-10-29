// The live layer of Fig 1, shared by the site component and the standalone preview page.
// It replays the Planner's real trace: the hub's pointer turns to a station, a shuttle rides out,
// waits the call's own duration (scaled), and rides back. Nothing is re-rendered: it writes
// attributes on the pre-built SVG.
import { lineOnTop, translateAlong } from "../../lib/iso/iso-kit.mjs";

const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const RIDE = 0.75; // seconds each way along an arm
const TURN = 0.45; // seconds for the pointer to swing
const PER_MS = 2.2; // trace milliseconds become this many times longer on screen

export function mountFigure(stage, F, { onReadout = () => {}, onSelect = () => {} } = {}) {
  const svg = stage.querySelector("svg");
  const pointer = svg.querySelector('[data-part="pointer"]');
  const tip = svg.querySelector('[data-part="pointer-tip"]');
  const flag = svg.querySelector('[data-part="flag"]');
  const needle = svg.querySelector('[data-part="needle"]');
  const iterations = svg.querySelector('[data-part="iterations"] text');
  const calls = svg.querySelector('[data-part="calls"] text');
  const AGENTS = new Set(["collector", "entity", "analyst", "critic"]);
  const shuttles = Object.fromEntries([...svg.querySelectorAll("[data-shuttle]")].map((el) => [el.dataset.shuttle, { el, dir: el.dataset.dir.split(" ").map(Number) }]));
  const angleOf = Object.fromEntries(F.stations.map((s) => [s.id, s.angle]));
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const rad = (a) => (a * Math.PI) / 180;

  // Build the timeline once: every step knows its start and length.
  let clock = 0;
  const steps = F.trace.map((step) => {
    const dwell = step.ms ? Math.max(0.35, (step.ms / 1000) * PER_MS) : 0.9;
    const length = step.to ? TURN + RIDE + dwell + (step.inbound ? 0 : RIDE) : 1.4;
    const out = { ...step, start: clock, dwell, length };
    clock += length + 0.25;
    return out;
  });
  const LOOP = clock + 2.4;

  const state = { pointer: angleOf.gateway, flag: 0, needle: -1, iterations: 0, calls: 0, rides: Object.fromEntries(F.stations.map((s) => [s.id, s.id === "gateway" ? 1 : 0])), say: steps[0].say };
  let shown = {};

  function pose(t) {
    // Replay every step up to t, so any moment of the loop is well defined.
    const s = { ...state, rides: { ...state.rides } };
    let pointerFrom = angleOf.gateway;
    for (const step of steps) {
      if (t < step.start) break;
      const local = t - step.start;
      s.say = step.say;
      if (step.say.includes("replanned")) s.iterations = 1;
      if (AGENTS.has(step.to) && local > TURN) s.calls += 1;
      if (!step.to) {
        // The Planner thinks: one full sweep of the pointer.
        const p = Math.min(1, local / step.length);
        s.pointer = pointerFrom + 360 * ease(p);
        if (p >= 1) s.pointer = pointerFrom;
        continue;
      }
      const target = shortest(pointerFrom, angleOf[step.to]);
      const swing = Math.min(1, local / TURN);
      s.pointer = pointerFrom + (target - pointerFrom) * ease(swing);
      if (swing >= 1) pointerFrom = target;
      const ride = local - TURN;
      if (step.inbound) {
        s.rides[step.to] = 1 - ease(clamp(ride / RIDE));
      } else {
        const outbound = ease(clamp(ride / RIDE));
        const back = ease(clamp((ride - RIDE - step.dwell) / RIDE));
        s.rides[step.to] = step.to === "gateway" ? outbound : outbound - back;
      }
      if (step.verdict && ride > RIDE) {
        const v = ease(clamp((ride - RIDE) / Math.min(step.dwell, 0.5)));
        s.needle = step.verdict === "reject" ? -1 : -1 + 2 * v;
        s.flag = step.verdict === "reject" ? v : 1 - v;
      }
    }
    return s;
  }

  function draw(s) {
    if (shown.pointer !== s.pointer) {
      pointer.setAttribute("d", lineOnTop(polar(4.4, s.pointer), polar(25, s.pointer), F.hubTop + 0.2, F.P));
      const [x, y] = polar(25, s.pointer);
      const base = polar(25, angleOf.gateway);
      tip.setAttribute("transform", translateAlong(F.P, [x - base[0], y - base[1], 0]));
    }
    if (shown.flag !== s.flag) flag.setAttribute("transform", translateAlong(F.P, [0, 0, 20 * s.flag]));
    if (shown.needle !== s.needle) {
      const a = (s.needle * Math.PI) / 3;
      const [gx, gy] = F.gauge;
      needle.setAttribute("d", lineOnTop([gx, gy], [gx + Math.sin(a) * 5.6, gy - Math.cos(a) * 5.6], F.top + 3.2, F.P));
    }
    for (const [id, { el, dir }] of Object.entries(shuttles)) {
      const r = s.rides[id] * F.travel;
      if (shown.rides?.[id] !== s.rides[id]) el.setAttribute("transform", translateAlong(F.P, [dir[0] * r, dir[1] * r, 0]));
    }
    if (shown.iterations !== s.iterations) iterations.textContent = String(s.iterations);
    if (shown.calls !== s.calls) calls.textContent = String(s.calls);
    if (shown.say !== s.say) onReadout(s.say);
    shown = s;
  }

  const polar = (r, a) => [Math.cos(rad(a)) * r, Math.sin(rad(a)) * r];

  let frame = 0, last = 0, t = 0, visible = false;
  function tick(now) {
    const dt = last ? Math.min((now - last) / 1000, 1 / 20) : 0;
    last = now;
    t = (t + dt) % LOOP;
    draw(pose(t));
    frame = visible && !still.matches ? requestAnimationFrame(tick) : 0;
  }
  const run = () => {
    if (still.matches) {
      draw(pose(LOOP - 0.01));
      return;
    }
    if (!frame && visible) {
      last = 0;
      frame = requestAnimationFrame(tick);
    }
  };
  const io = new IntersectionObserver((entries) => {
    visible = entries[entries.length - 1].isIntersecting;
    if (visible) run();
  }, { rootMargin: "80px 0px" });
  io.observe(stage);
  still.addEventListener?.("change", run);

  // Stations are buttons: click or Enter picks the one the panel below describes.
  const stations = [...svg.querySelectorAll("[data-station]")];
  const select = (id) => {
    stations.forEach((el) => el.toggleAttribute("data-selected", el.dataset.station === id));
    onSelect(id);
  };
  const onClick = (event) => {
    const el = event.target.closest?.("[data-station]");
    if (el) select(el.dataset.station);
  };
  const onKey = (event) => {
    const el = event.target.closest?.("[data-station]");
    if (el && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      select(el.dataset.station);
    }
  };
  svg.addEventListener("click", onClick);
  svg.addEventListener("keydown", onKey);

  draw(pose(0));
  return {
    select,
    destroy() {
      cancelAnimationFrame(frame);
      io.disconnect();
      still.removeEventListener?.("change", run);
      svg.removeEventListener("click", onClick);
      svg.removeEventListener("keydown", onKey);
    },
  };
}

const clamp = (x) => Math.min(1, Math.max(0, x));
// Turn the short way round.
function shortest(from, to) {
  let d = ((to - from) % 360 + 540) % 360 - 180;
  return from + d;
}
