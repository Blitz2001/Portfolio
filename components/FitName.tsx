"use client";

import { useEffect, useRef } from "react";

// Sets the name's font size so it spans the full content width.
export function FitName({ children }: { children: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el?.parentElement) return;
    const parent = el.parentElement;
    const fit = () => {
      el.style.fontSize = "100px";
      const cs = getComputedStyle(parent);
      const width = parent.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      el.style.fontSize = `${(100 * width) / el.scrollWidth * 0.98}px`;
    };
    document.fonts.ready.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(parent);
    return () => ro.disconnect();
  }, []);

  return (
    <p
      ref={ref}
      aria-hidden="true"
      className="wordmark mt-20 inline-block text-[15vw] leading-[0.85] font-extrabold tracking-[-0.05em] whitespace-nowrap md:mt-40"
    >
      {children}
    </p>
  );
}
