"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FIGURE } from "@/components/defenseosint/figure-data";
import { mountFigure } from "@/figures/defenseosint/live.mjs";
import { story, type StoryNode } from "@/lib/content";
import { EntityStep } from "./EntityStep";

type Mounted = ReturnType<typeof mountFigure>;

// Maps each of the 7 scroll steps to its trace slice [fromIdx, toIdx] in figures/defenseosint/model.mjs.
const TRACE_RANGES: readonly [number, number][] = [
  [0, 0], // ask: gateway · objective in
  [1, 1], // plan: planner-agent · plan_created · 4 tasks
  [2, 2], // collect: collector-agent · collect · ok (412 ms)
  [4, 4], // extract: entity-agent · extract · ok (95 ms)
  [5, 5], // brief: analyst-agent · synthesize · ok (120 ms)
  [6, 6], // check: critic-agent · assess · brief rejected (88 ms)
  [7, 12], // retry: replanned -> follow-up round -> critic passed -> finished
];

const STATIONS: readonly { id: StoryNode; label: string; mine?: boolean }[] = [
  { id: "gateway", label: "Gateway" },
  { id: "planner", label: "Planner" },
  { id: "collector", label: "Collector" },
  { id: "entity", label: "Entity Extractor", mine: true },
  { id: "analyst", label: "Analyst" },
  { id: "critic", label: "Critic" },
];

/** Client half of the scroll story: syncs the isometric DefenseOSINT switchboard with the 7 narrative steps. */
export function ScrollStoryClient({ art }: { art: React.ReactNode }) {
  const steps = story.steps;
  const [active, setActive] = useState(0);
  const [readout, setReadout] = useState(steps[0].trace);
  const stageRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const figureRef = useRef<Mounted | null>(null);
  const activeRef = useRef(0);

  const jumpToNode = useCallback(
    (nodeId: string) => {
      const idx = steps.findIndex((s) => s.node === nodeId);
      if (idx < 0) return;
      setActive(idx);
      const target = document.getElementById(`step-${steps[idx].id}`);
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      target?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    },
    [steps],
  );

  // 1. Mount the live isometric switchboard once and sync station clicks back to the step list.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const mql = matchMedia("(min-width: 1024px)");
    const mounted = mountFigure(stage, FIGURE, {
      onReadout: setReadout,
      onSelect: jumpToNode,
    });
    figureRef.current = mounted;

    const syncMode = () => {
      const idx = activeRef.current;
      mounted.highlight(steps[idx].node);
      if (mql.matches) {
        const [from, to] = TRACE_RANGES[idx] ?? [0, 0];
        mounted.playRange(from, to);
      } else {
        mounted.playLoop();
      }
    };

    syncMode();
    mql.addEventListener?.("change", syncMode);
    return () => {
      mql.removeEventListener?.("change", syncMode);
      mounted.destroy();
      figureRef.current = null;
    };
  }, [jumpToNode, steps]);

  // 2. Drive the switchboard segment whenever the active step changes on desktop.
  useEffect(() => {
    activeRef.current = active;
    const mounted = figureRef.current;
    if (!mounted) return;
    mounted.highlight(steps[active].node);
    if (matchMedia("(min-width: 1024px)").matches) {
      const [from, to] = TRACE_RANGES[active] ?? [0, 0];
      mounted.playRange(from, to);
    }
  }, [active, steps]);

  // 3. Observe which narrative step crosses the middle of the viewport.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const items = list.querySelectorAll<HTMLLIElement>("li[data-index]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-index"));
            if (!Number.isNaN(idx)) setActive(idx);
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    items.forEach((item) => io.observe(item));
    return () => io.disconnect();
  }, []);

  const activeNode = steps[active].node;

  return (
    <section id="fig" aria-labelledby="fig-title" className="frame scroll-mt-8 pb-[clamp(80px,10vw,160px)]">
      <div className="mb-8 grid gap-5 md:mb-12 lg:grid-cols-[8fr_5fr] lg:gap-12">
        <h2 id="fig-title" data-reveal className="text-[clamp(2.125rem,1rem+3.9vw,4.9rem)]">
          {story.title}
        </h2>
        <p data-reveal style={{ "--i": 1 } as React.CSSProperties} className="max-w-[48ch] self-end text-lead leading-[1.4]">
          {story.lead}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:gap-12 xl:grid-cols-[7fr_6fr] xl:gap-16">
        {/* Isometric switchboard: centered and unpinned below lg, sticky beside steps on desktop */}
        <div className="self-start md:mx-auto md:w-full md:max-w-[600px] lg:sticky lg:top-[max(6rem,calc(50vh-18rem))] lg:max-w-none">
          <figure data-ui className="rounded-[28px] bg-sand-2 p-3 md:p-6">
            <div className="iso cobalt" data-theme="light">
              <div ref={stageRef} className="-mx-1 md:mx-0">
                {art}
              </div>
            </div>
            <p aria-hidden="true" className="mt-2 px-1 text-[0.9375rem] tabular-nums text-cobalt-soft">
              {readout}
            </p>
            <p className="mt-1 px-1 text-[0.8125rem] text-cobalt-soft lg:hidden">Replays one real investigation.</p>

            {/* Desktop station rail */}
            <div role="group" aria-label="Services" className="mt-4 hidden flex-wrap gap-2 lg:flex">
              {STATIONS.map((st) => {
                const pressed = activeNode === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    aria-pressed={pressed}
                    onClick={() => jumpToNode(st.id)}
                    className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border-2 border-cobalt px-3 py-1 text-[0.875rem] font-semibold transition-colors duration-150 ${
                      pressed ? "bg-cobalt text-sand" : "bg-sand text-cobalt hover:bg-sand-2"
                    }`}
                  >
                    {st.label}
                    {st.mine && (
                      <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3 shrink-0 fill-current">
                        <path d="M8 1.2l2.1 4.3 4.7.7-3.4 3.3.8 4.7L8 12l-4.2 2.2.8-4.7-3.4-3.3 4.7-.7z" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Desktop step progress bar */}
            <div aria-hidden="true" className="mt-4 hidden h-1 overflow-hidden rounded-full bg-cobalt/15 lg:block">
              <div
                className="h-full origin-left rounded-full bg-cobalt transition-transform duration-300 ease-[var(--ease-out)] motion-reduce:transition-none motion-reduce:duration-0"
                style={{ transform: `scaleX(${(active + 1) / steps.length})` }}
              />
            </div>
          </figure>
        </div>

        {/* Plain-English steps on a vertical timeline */}
        <ol ref={listRef}>
          {steps.map((s, i) => (
            <li
              key={s.id}
              id={`step-${s.id}`}
              data-index={i}
              aria-current={i === active ? "step" : undefined}
              className={`relative border-l-2 border-cobalt/20 pl-6 transition-opacity duration-300 motion-reduce:transition-none md:pl-8 ${
                s.mine
                  ? "scroll-mt-[24vh] py-6 focus-within:opacity-100 lg:py-12"
                  : "scroll-mt-[40vh] py-6 lg:flex lg:min-h-[46vh] lg:scroll-mt-[27vh] lg:flex-col lg:justify-center lg:py-8"
              } ${i === active ? "opacity-100" : "opacity-100 lg:opacity-45"}`}
            >
              <h3 className="relative text-title">
                <span
                  aria-hidden="true"
                  className={`absolute -left-[31px] top-[0.35em] size-3 rounded-full border-2 border-cobalt transition-colors duration-200 motion-reduce:transition-none md:-left-[39px] ${
                    s.mine ? "bg-cobalt" : i === active ? "bg-sand lg:bg-cobalt" : "bg-sand"
                  }`}
                />
                {s.heading}
              </h3>
              <p className="mt-1.5 text-[0.9375rem] text-cobalt-soft">
                <span className="font-semibold">{s.eyebrow}</span>
                {" · "}
                {s.detail}
              </p>
              <p className="mt-2 max-w-[54ch]">{s.text}</p>
              {s.mine && <EntityStep />}
            </li>
          ))}
        </ol>
      </div>

      <p className="mt-6 max-w-[90ch] text-[0.9375rem] text-cobalt-soft md:mt-8">
        {story.caption}{" "}
        <a href={story.repo} className="ink-link">
          Repository
        </a>
      </p>
    </section>
  );
}
