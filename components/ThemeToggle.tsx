"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const current = (): Theme => {
  const set = document.documentElement.dataset.theme;
  if (set === "dark" || set === "light") return set;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

// Follows both the saved choice (the data-theme attribute) and the system setting.
function subscribe(update: () => void) {
  const media = matchMedia("(prefers-color-scheme: dark)");
  const observer = new MutationObserver(update);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  media.addEventListener("change", update);
  return () => {
    observer.disconnect();
    media.removeEventListener("change", update);
  };
}

// Light/dark switch. The new theme opens as a circle from the button where View Transitions exist.
export function ThemeToggle() {
  const theme = useSyncExternalStore<Theme | null>(subscribe, current, () => null);

  const flip = (event: React.MouseEvent<HTMLButtonElement>) => {
    const next: Theme = current() === "dark" ? "light" : "dark";
    const apply = () => {
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch {}
    };
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still || !document.startViewTransition) return apply();
    const box = event.currentTarget.getBoundingClientRect();
    const x = box.left + box.width / 2;
    const y = box.top + box.height / 2;
    const root = document.documentElement.style;
    root.setProperty("--tx", `${x}px`);
    root.setProperty("--ty", `${y}px`);
    root.setProperty("--tr", `${Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))}px`);
    document.startViewTransition(apply);
  };

  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={flip}
      aria-label={theme ? `Switch to ${dark ? "light" : "dark"} theme` : "Switch theme"}
      title={dark ? "Light theme" : "Dark theme"}
      className="grid size-10 cursor-pointer place-items-center rounded-full transition-[background-color,transform] duration-150 ease-out hover:bg-sand-2 active:scale-[0.94]"
    >
      <svg viewBox="0 0 20 20" className="size-5" aria-hidden="true">
        <circle cx="10" cy="10" r="7.25" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10 2.75a7.25 7.25 0 0 1 0 14.5z" fill="currentColor" className={`origin-center transition-transform duration-300 ease-out ${dark ? "rotate-180" : ""}`} />
      </svg>
    </button>
  );
}
