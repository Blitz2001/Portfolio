"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

// The primary actions lean a few pixels toward the pointer and spring back.
export function Magnetic({ children, strength = 0.25 }: { children: React.ReactNode; strength?: number }) {
  const still = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 300, damping: 18, mass: 0.5 });
  const y = useSpring(useMotionValue(0), { stiffness: 300, damping: 18, mass: 0.5 });
  return (
    <motion.span
      className="inline-block"
      style={still ? undefined : { x, y }}
      onPointerMove={(e) => {
        if (still || e.pointerType === "touch") return;
        const box = e.currentTarget.getBoundingClientRect();
        x.set(Math.max(-12, Math.min(12, (e.clientX - box.left - box.width / 2) * strength)));
        y.set(Math.max(-10, Math.min(10, (e.clientY - box.top - box.height / 2) * strength)));
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}
