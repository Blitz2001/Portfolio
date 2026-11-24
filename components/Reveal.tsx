"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Shows each [data-reveal] element once it scrolls into view. Elements are only hidden after this
// runs (the reveal-ready class), so without JavaScript the page reads normally.
export function Reveal() {
  const path = usePathname();
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("reveal-ready");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.setAttribute("data-shown", "");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll("[data-reveal]:not([data-shown])").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [path]);
  return null;
}
