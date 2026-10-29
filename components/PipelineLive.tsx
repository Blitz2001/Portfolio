"use client";

import { useEffect, useRef, useState } from "react";
import { FIGURE } from "@/components/defenseosint/figure-data";
import { mountFigure } from "@/figures/defenseosint/live.mjs";
import { pipeline } from "@/lib/content";

type Mounted = ReturnType<typeof mountFigure>;

export function PipelineLive({ art }: { art: React.ReactNode }) {
  const mine = pipeline.stages.findIndex((s) => "mine" in s && s.mine);
  const [active, setActive] = useState(mine);
  const [readout, setReadout] = useState("gateway · objective in");
  const stageRef = useRef<HTMLDivElement>(null);
  const figure = useRef<Mounted | null>(null);
  const stage = pipeline.stages[active];

  useEffect(() => {
    if (!stageRef.current) return;
    const mounted = mountFigure(stageRef.current, FIGURE, {
      onReadout: setReadout,
      onSelect: (id) => {
        const i = pipeline.stages.findIndex((s) => s.id === id);
        if (i >= 0) setActive(i);
      },
    });
    mounted.select(pipeline.stages[mine].id);
    figure.current = mounted;
    return () => mounted.destroy();
  }, [mine]);

  const pick = (i: number) => {
    setActive(i);
    figure.current?.select(pipeline.stages[i].id);
  };

  return (
    <figure data-ui className="mt-14 rounded-[28px] bg-sand-2 p-4 md:mt-24 md:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-1 text-[0.9375rem] font-semibold">
        <span>Fig 1</span>
        <span>{pipeline.title}</span>
      </div>

      <div className="iso cobalt mt-2" data-theme="light">
        <div ref={stageRef} className="-mx-2 md:mx-0">
          {art}
        </div>
      </div>

      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-1 text-[0.9375rem]">
        <span className="font-semibold">{pipeline.hint}</span>
        <span className="tabular-nums text-cobalt-soft" aria-hidden="true">
          {readout}
        </span>
      </div>

      <ol className="mt-5 flex flex-wrap gap-2" aria-label="Services">
        {pipeline.stages.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              aria-pressed={i === active}
              onClick={() => pick(i)}
              className={`cursor-pointer rounded-full border-2 border-cobalt px-3.5 py-1.5 text-[0.9375rem] font-semibold transition-colors duration-150 ${
                i === active ? "bg-cobalt text-sand" : "bg-sand text-cobalt hover:bg-sand-2"
              }`}
            >
              {s.name}
              {"mine" in s && s.mine ? " · my part" : ""}
            </button>
          </li>
        ))}
      </ol>

      <div aria-live="polite" className="mt-4 grid gap-x-10 gap-y-2 rounded-[22px] bg-sand p-5 md:grid-cols-[5fr_7fr] md:p-6">
        <p className="text-[clamp(1.5rem,2.4vw,2.25rem)] leading-[0.9] font-extrabold tracking-[-0.05em] md:row-span-2">{stage.name}</p>
        <p className="max-w-[60ch]">{stage.text}</p>
        <p className="text-[0.9375rem] text-cobalt-soft">
          {stage.tech}
          {" · "}
          <a href={pipeline.repo} className="ink-link">
            Repository
          </a>
        </p>
      </div>

      <figcaption className="mt-4 max-w-[75ch] px-1 text-[0.9375rem] text-cobalt-soft">{pipeline.caption}</figcaption>
    </figure>
  );
}
