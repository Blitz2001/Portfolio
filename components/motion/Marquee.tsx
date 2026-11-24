"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

// Two lines of tools, pushed sideways in opposite directions by the scroll (not by a clock).
export function Marquee({ rows }: { rows: string[][] }) {
  const ref = useRef<HTMLDivElement>(null);
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const a = useTransform(scrollYProgress, [0, 1], ["0%", "-28%"]);
  const b = useTransform(scrollYProgress, [0, 1], ["-28%", "0%"]);
  return (
    <div ref={ref} aria-hidden="true" className="overflow-hidden py-[clamp(48px,7vw,112px)]">
      {rows.map((row, i) => (
        <motion.p
          key={i}
          style={still ? undefined : { x: i % 2 ? b : a }}
          className={`flex w-max gap-[0.5em] text-[clamp(3rem,1rem+7vw,8.5rem)] leading-[1.02] font-extrabold tracking-[-0.05em] whitespace-nowrap ${i % 2 ? "text-cobalt-soft" : ""}`}
        >
          {[...row, ...row, ...row].map((word, j) => (
            <span key={j} className="flex items-center gap-[0.5em]">
              {word}
              <span className="inline-block size-[0.16em] rounded-full bg-current" />
            </span>
          ))}
        </motion.p>
      ))}
    </div>
  );
}
