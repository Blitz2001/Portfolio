"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Children, useRef, useSyncExternalStore } from "react";

const wide = () => matchMedia("(min-width: 1024px)").matches;
const subscribe = (update: () => void) => {
  const m = matchMedia("(min-width: 1024px)");
  m.addEventListener("change", update);
  return () => m.removeEventListener("change", update);
};

// Project cards that pin near the top and stack: each one slides over the last, and the cards
// underneath settle back a little. Wide screens only; phones get a plain column of cards.
export function StackCards({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const still = useReducedMotion();
  const stack = useSyncExternalStore(subscribe, wide, () => false) && !still;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const cards = Children.toArray(children);
  return (
    <div ref={ref} className="grid gap-6 lg:gap-0">
      {cards.map((card, i) => (
        <Card key={i} index={i} count={cards.length} progress={scrollYProgress} stack={stack}>
          {card}
        </Card>
      ))}
    </div>
  );
}

function Card({ index, count, progress, stack, children }: { index: number; count: number; progress: MotionValue<number>; stack: boolean; children: React.ReactNode }) {
  const settle = 1 - (count - 1 - index) * 0.045;
  // A card only settles back once the next one starts sliding over it.
  const last = index === count - 1;
  // Scroll offsets must stay inside 0–1, or the browser rejects the animation outright.
  const at = (f: number) => Math.min(Math.max(f, 0), 1);
  const scale = useTransform(progress, [at((index + 0.5) / count), 1], [1, settle]);
  const dim = useTransform(progress, [at((index + 0.7) / count), at((index + 1.1) / count) || 1], [1, last ? 1 : 0.35]);
  return (
    <div className={stack ? "sticky min-w-0 pb-[14vh]" : "min-w-0"} style={stack ? { top: `calc(88px + ${index * 26}px)` } : undefined}>
      <motion.div
        style={stack ? { scale } : undefined}
        className={`stack-card origin-top rounded-[32px] bg-sand-2 p-5 md:p-10 ${stack ? "stack-float" : ""}`}
      >
        <motion.div style={stack ? { opacity: dim } : undefined}>{children}</motion.div>
      </motion.div>
    </div>
  );
}
