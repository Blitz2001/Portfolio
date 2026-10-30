"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

// The headline drifts up and dims as the page starts to move.
export function HeroDrift({ children }: { children: React.ReactNode }) {
  const still = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 700], [0, -110]);
  const opacity = useTransform(scrollY, [0, 600], [1, 0.25]);
  return <motion.div style={still ? undefined : { y, opacity }}>{children}</motion.div>;
}

// The figure grows into place as it arrives: a window opening onto the system.
export function GrowIn({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.25"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.86, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [90, 0]);
  return (
    <motion.div ref={ref} style={still ? undefined : { scale, y }} className="origin-top">
      {children}
    </motion.div>
  );
}
