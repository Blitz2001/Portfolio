"use client";

import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useRef } from "react";

// A card that leans toward the pointer (springs, so it settles rather than snaps) with a soft
// spotlight under the cursor. Mouse and pen only; touch and reduced motion get a still card.
export function Tilt({ children, className = "", max = 6 }: { children: React.ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const still = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const lit = useMotionValue(0);
  const spring = { stiffness: 260, damping: 22, mass: 0.6 };
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);
  const glow = useSpring(lit, { stiffness: 200, damping: 30 });
  const x = useTransform(px, (v) => `${v * 100}%`);
  const y = useTransform(py, (v) => `${v * 100}%`);
  // The spotlight is light under the cursor, not a decorative gradient.
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${x} ${y}, color-mix(in oklab, var(--color-cobalt) 9%, transparent), transparent 70%)`; // taste-skill-ignore

  const move = (e: React.PointerEvent) => {
    if (still || e.pointerType === "touch" || !ref.current) return;
    const box = ref.current.getBoundingClientRect();
    px.set((e.clientX - box.left) / box.width);
    py.set((e.clientY - box.top) / box.height);
    lit.set(1);
  };
  const leave = () => {
    px.set(0.5);
    py.set(0.5);
    lit.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      style={still ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
      className={`relative ${className}`}
    >
      {children}
      {!still && <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ background: spotlight, opacity: glow }} />}
    </motion.div>
  );
}
