"use client";

import { useState } from "react";
import { pipeline } from "@/lib/content";

export function Pipeline() {
  const mine = pipeline.stages.findIndex((s) => "mine" in s && s.mine);
  const [active, setActive] = useState(mine);
  const stage = pipeline.stages[active];

  return (
    <figure data-ui className="mt-14 rounded-[28px] bg-sand-2 p-5 md:mt-24 md:p-10">
      <figcaption className="mb-5 text-base font-semibold">{pipeline.caption}</figcaption>

      <ol className="grid grid-cols-2 gap-2.5 md:grid-cols-6">
        {pipeline.stages.map((s, i) => {
          const pressed = i === active;
          return (
            <li key={s.name}>
              <button
                type="button"
                aria-pressed={pressed}
                onClick={() => setActive(i)}
                className={`flex min-h-[118px] w-full cursor-pointer flex-col items-start justify-between gap-5 rounded-[18px] border-[2.5px] border-cobalt p-4 text-left text-[clamp(1.05rem,1.4vw,1.4rem)] leading-[1.05] font-extrabold tracking-[-0.05em] transition-[transform,background-color,color] duration-200 ease-out hover:-translate-y-[3px] active:scale-[0.98] ${
                  pressed ? "bg-cobalt text-sand" : "bg-sand text-cobalt"
                }`}
              >
                {s.name}
                {"mine" in s && s.mine && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[0.8125rem] font-semibold tracking-normal ${
                      pressed ? "bg-sand text-cobalt" : "bg-cobalt text-sand"
                    }`}
                  >
                    My part
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ol>

      {/* Critic (column 6) back to Planner (column 2) */}
      <svg
        className="hidden h-[46px] w-full md:block"
        viewBox="0 0 600 46"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M550 2 V30 H150 V8" fill="none" stroke="currentColor" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
        <path d="M143 12 L150 2 L157 12" fill="none" stroke="currentColor" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
      </svg>
      <p className="mt-4 text-[0.9375rem] md:mt-1.5 md:pl-[calc(100%/6+24px)]">{pipeline.loop}</p>

      <div aria-live="polite" className="mt-7 grid gap-x-10 gap-y-2 rounded-[28px] bg-sand p-6 md:grid-cols-[5fr_7fr]">
        <h3 className="text-[clamp(1.5rem,2.4vw,2.25rem)] md:row-span-2">{stage.name}</h3>
        <p className="max-w-[60ch]">{stage.text}</p>
        <p className="text-[0.9375rem] text-cobalt-soft">
          {stage.tech}
          {" · "}
          <a href={pipeline.repo} className="ink-link">
            Repository
          </a>
        </p>
      </div>
    </figure>
  );
}
