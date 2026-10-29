// The truth behind Fig 1. Everything the figure shows or says comes from here.
// Source: DefenseOSINT handover guide v1.0, sections 1–3, and the demo/viva companion.

/** Each service sits at the end of an arm; `angle` is the arm's direction on the floor, in degrees. */
export const STATIONS = [
  { id: "gateway", name: "Gateway", plate: "GATEWAY", angle: 45 },
  { id: "collector", name: "Collector", plate: "COLLECTOR", angle: 0 },
  { id: "entity", name: "Entity Extractor", plate: "ENTITY", angle: 90 },
  { id: "analyst", name: "Analyst", plate: "ANALYST", angle: 180 },
  { id: "critic", name: "Critic", plate: "CRITIC", angle: 270 },
];

/**
 * One investigation, as the Planner's trace records it (handover guide, section 3).
 * `ms` is the call time the trace reports; the figure scales it, it never invents one.
 */
export const TRACE = [
  { to: "gateway", inbound: true, say: "gateway · objective in" },
  { to: null, say: "planner-agent · plan_created · 4 tasks" },
  { to: "collector", ms: 412, say: "collector-agent · collect · ok (412 ms)" },
  { to: "collector", ms: 388, say: "collector-agent · collect · ok (388 ms)" },
  { to: "entity", ms: 95, say: "entity-agent · extract · ok (95 ms)" },
  { to: "analyst", ms: 120, say: "analyst-agent · synthesize · ok (120 ms)" },
  { to: "critic", ms: 88, verdict: "reject", say: "critic-agent · assess · brief rejected (88 ms)" },
  { to: null, say: "planner-agent · replanned · 1 targeted task, iteration 1" },
  { to: "collector", ms: 355, say: "collector-agent · collect · ok (355 ms)" },
  { to: "entity", ms: 91, say: "entity-agent · extract · ok (91 ms)" },
  { to: "analyst", ms: 117, say: "analyst-agent · synthesize · ok (117 ms)" },
  { to: "critic", ms: 84, verdict: "pass", say: "critic-agent · assess · passed (84 ms)" },
  { to: "gateway", say: "planner-agent · finished · citation coverage 100%" },
];
