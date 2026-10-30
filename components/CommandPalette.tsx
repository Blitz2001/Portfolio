"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { site } from "@/lib/content";

type Command = { label: string; group: string; keywords?: string; run: (go: (href: string) => void) => void };

const to = (href: string) => (go: (href: string) => void) => go(href);
const open = (href: string) => () => window.open(href, "_blank", "noopener");

const COMMANDS: Command[] = [
  { group: "Pages", label: "Hire me", keywords: "home recruiter ai data science internship", run: to("/") },
  { group: "Pages", label: "Freelance", keywords: "client services fiverr", run: to("/freelance") },
  { group: "Pages", label: "Lab", keywords: "logos design three.js side projects", run: to("/lab") },
  { group: "On this site", label: "DefenseOSINT figure", keywords: "pipeline agents planner critic switchboard", run: to("/#fig") },
  { group: "On this site", label: "Currently working on", keywords: "now github latest", run: to("/#now") },
  { group: "On this site", label: "Inside my part: try the Entity Extractor", keywords: "entity extractor spacy confidence canonical id", run: to("/#inside") },
  { group: "On this site", label: "Red-teaming DefenseOSINT", keywords: "responsible ai wilson tests vulnerabilities", run: to("/#red-teaming-defenseosint") },
  { group: "On this site", label: "H&M retail data warehouse", keywords: "star schema kimball ssis ssas power bi", run: to("/#hm-retail-data-warehouse") },
  { group: "On this site", label: "Bank marketing prediction", keywords: "xgboost model comparison", run: to("/#bank-marketing-prediction") },
  { group: "On this site", label: "About and path so far", keywords: "education sliit timeline skills", run: to("/#about") },
  { group: "On this site", label: "Contact me directly", keywords: "freelance brief email whatsapp", run: to("/freelance#direct") },
  {
    group: "Actions",
    label: "Copy email address",
    keywords: site.email,
    run: () => {
      navigator.clipboard?.writeText(site.email).catch(() => {});
    },
  },
  { group: "Actions", label: "Email me", keywords: site.email, run: () => (window.location.href = `mailto:${site.email}`) },
  { group: "Actions", label: "Download CV", keywords: "resume pdf", run: () => (window.location.href = site.cv) },
  {
    group: "Actions",
    label: "Switch light / dark theme",
    keywords: "dark mode theme",
    run: () => {
      const root = document.documentElement;
      const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
      root.dataset.theme = dark ? "light" : "dark";
      try {
        localStorage.setItem("theme", root.dataset.theme);
      } catch {}
    },
  },
  { group: "Elsewhere", label: "GitHub", keywords: site.githubLabel, run: open(site.github) },
  { group: "Elsewhere", label: "LinkedIn", run: open(site.linkedin) },
];

// ⌘K / Ctrl+K or "/" opens a search over pages, sections and actions. It opens instantly: it is
// keyboard-driven and used often, so it has no animation.
export function CommandPalette() {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    return COMMANDS.filter((c) => {
      const hay = `${c.label} ${c.group} ${c.keywords ?? ""}`.toLowerCase();
      return words.every((w) => hay.includes(w));
    });
  }, [query]);

  const show = () => {
    setQuery("");
    setActive(0);
    dialog.current?.showModal();
    input.current?.focus();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && (e.target.closest("input, textarea, select") || e.target.isContentEditable);
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        if (dialog.current?.open) dialog.current.close();
        else show();
      }
    };
    const onOpen = () => show();
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-palette", onOpen);
    };
  }, []);

  const run = (c: Command | undefined) => {
    if (!c) return;
    dialog.current?.close();
    c.run((href) => router.push(href));
  };

  return (
    <dialog
      ref={dialog}
      data-ui
      aria-label="Search the site"
      onClick={(e) => e.target === dialog.current && dialog.current?.close()}
      className="m-auto mt-[12vh] w-[min(640px,calc(100vw-32px))] rounded-[28px] bg-sand p-0 text-cobalt shadow-[0_24px_80px_-20px_rgb(0_0_0/0.45)] backdrop:bg-[rgb(6_17_51/0.45)]"
    >
      <div className="p-3">
        <input
          ref={input}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => Math.min(a + 1, results.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, 0));
            } else if (e.key === "Enter") {
              e.preventDefault();
              run(results[active]);
            }
          }}
          placeholder="Search pages, projects and actions"
          aria-label="Search pages, projects and actions"
          aria-controls="palette-results"
          aria-activedescendant={results[active] ? `palette-${active}` : undefined}
          className="w-full rounded-2xl bg-sand-2 px-4 py-3.5 text-lead font-semibold text-cobalt outline-none placeholder:text-cobalt-soft"
        />
      </div>
      <ul id="palette-results" role="listbox" className="max-h-[52vh] overflow-y-auto px-3 pb-3">
        {results.map((c, i) => (
          <li
            key={c.label}
            id={`palette-${i}`}
            role="option"
            aria-selected={i === active}
            onMouseMove={() => setActive(i)}
            onClick={() => run(c)}
            className={`flex cursor-pointer items-baseline justify-between gap-4 rounded-xl px-4 py-2.5 ${i === active ? "bg-cobalt text-sand" : ""}`}
          >
            <span className="font-semibold">{c.label}</span>
            <span className={`text-[0.875rem] ${i === active ? "text-sand/80" : "text-cobalt-soft"}`}>{c.group}</span>
          </li>
        ))}
        {results.length === 0 && <li className="px-4 py-3 text-cobalt-soft">Nothing matches “{query}”.</li>}
      </ul>
    </dialog>
  );
}

/** The visible way in, for people who don't know the shortcut. */
export function PaletteButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("open-palette"))}
      aria-label="Search the site (Ctrl K)"
      title="Search (Ctrl K)"
      className="grid size-10 cursor-pointer place-items-center rounded-full transition-[background-color,transform] duration-150 ease-out hover:bg-sand-2 active:scale-[0.94]"
    >
      <svg viewBox="0 0 20 20" className="size-5" aria-hidden="true">
        <circle cx="8.5" cy="8.5" r="5.75" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M13 13l4.25 4.25" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </button>
  );
}
