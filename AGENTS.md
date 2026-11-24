# AGENTS.md — Shared brain for this repo

This is the **single source of truth** for every AI agent working on this project
(Claude Code, Gemini / Antigravity agents, Copilot, etc.). `CLAUDE.md` and `GEMINI.md`
just import this file. **Edit this file, not those.**

Before starting work, read [HANDOFF.md](HANDOFF.md) for the latest state, open tasks and
active plans. When you finish a task, add an entry there.

---

## What this is

Portfolio for **Arunu Sampath** (GitHub `Blitz2001`). Arunu is a data science undergraduate at SLIIT applying for AI / data science internships, and also does freelance work.

There are **two versions** in this repo:

| Branch | What it is | Status |
|---|---|---|
| `v2-data-science` | **v2**: Next.js 16 App Router, TypeScript, Tailwind v4, Sanity, Vercel | **Active work happens here** |
| `main` | v1: Vite + React 18/19 + Tailwind 3 MERN portfolio on GitHub Pages (tagged `v1-mern-final`) | Live at arunusampath.me until v2 launches |

Unless the owner says otherwise, work on **`v2-data-science`**. Everything below describes v2.

## Pages

- `/` "Hire me" (recruiters): `app/(site)/page.tsx`
- `/freelance` (clients): `app/(site)/freelance/page.tsx`
- `/lab` (design, 3D experiments, side projects): `app/(site)/lab/page.tsx`
- `/studio` is Sanity Studio. `/admin` lists tracking-link visits and is protected by Basic auth in `proxy.ts`. `/api/visit` logs `?ref=` visits to Postgres.

## Stack

- **Next.js 16** (App Router, server components by default). Read the docs in `node_modules/next/dist/docs/` before using an API you're not sure of; v16 has breaking changes. Middleware is `proxy.ts`.
- **React 19**, **TypeScript**, path alias `@/*` → repo root.
- **Tailwind CSS v4**, configured in CSS (`app/globals.css` `@theme`); there is no `tailwind.config`.
- **Motion** (`motion/react`, the successor to framer-motion), **Lenis** smooth scroll.
- **Sanity** (`next-sanity`) for projects and "Now" items. Without the env vars, pages fall back to `lib/content.ts`.
- **Neon Postgres** (`@neondatabase/serverless`) for tracking links, and **Vercel Analytics**.
- Font: Schibsted Grotesk via `next/font` (`--font-schibsted`).

## Commands

```bash
npm install
npm run dev      # next dev  (also re-adds the Next.js block at the bottom of this file; that's expected)
npm run build    # next build — must pass before claiming a change works
npm run lint     # eslint . (eslint-config-next)
node .claude/skills/taste-skill/scripts/lint.mjs <files or folder>   # design lint (house style)
node .claude/skills/taste-skill/scripts/inspect.mjs <url>            # real-browser design inspection
node figures/defenseosint/build.mjs   # regenerates the isometric DefenseOSINT figure (see figures/defenseosint/README.md)
```

## Deploy

- **v2 → Vercel.** Every branch gets a preview URL. The full launch steps are in `DEPLOY.md`.
- Env vars are listed in `.env.example`: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `DATABASE_URL`, `ADMIN_PASSWORD`, `GITHUB_TOKEN`. **Never commit real values.**
- v1 on `main` deploys to GitHub Pages on every push to `main`. **Don't push to `main`.**

## Layout

```
app/
  layout.tsx            # <html>, font, metadata, theme script (no flash), Vercel Analytics
  globals.css           # design tokens, utilities (frame, section-gap, btn, ink-link…), reveal + motion CSS
  (site)/layout.tsx     # ScrollProgress, SmoothScroll (Lenis), SiteNav, Reveal, CommandPalette, RefTracker
  (site)/template.tsx   # page-enter animation on each tab change
  (site)/page.tsx       # Hire me page: Hero, How DefenseOSINT works, Now, Marquee, More work, About, Contact
components/             # one component per file, named exports
  motion/               # HeroScroll, Magnetic, Marquee, ScrollProgress, SmoothScroll, StackCards, Tilt
  story/                # ScrollStory (server), ScrollStoryClient, EntityStep (home page #fig)
  defenseosint/         # GENERATED figure files (figure-art.ts ≈ 279 KB SVG string, figure-data.ts, figure.css), shown in #fig
figures/defenseosint/   # generator for the isometric figure (model.mjs = the facts, build.mjs, live.mjs)
lib/
  content.ts            # ALL site copy. Placeholders are written in [square brackets]
  projects.ts, github.ts, visits.ts, auth.ts
  iso/                  # isometric drawing kit used by figures/
sanity/                 # client, env, schemaTypes
docs/                   # plans (v2-plan.md, fig1-scroll-story-plan.md)
design/                 # style explorations (not built)
.claude/skills/         # design skills: taste-skill, anatomy, animate, emil-design-eng, impeccable…
```

## Design system (follow it exactly)

- **Two inks only**: `sand` / `sand-2` (backgrounds) and `cobalt` / `cobalt-soft` (ink). Use Tailwind classes `bg-sand`, `bg-sand-2`, `text-cobalt`, `text-cobalt-soft`, `fill-cobalt`, `stroke-cobalt`, `border-cobalt`. **Never hard-code hex colours.** Dark mode ("cobalt night") swaps the token values, so a component that uses only tokens gets dark mode for free.
- Type scale tokens: `text-display`, `text-section`, `text-title`, `text-lead`. Headings are extrabold with tight tracking (set in base styles).
- Layout utilities: `frame` (side padding), `section-gap` (vertical rhythm). Sections end with `pb-[clamp(80px,10vw,160px)]`.
- Cards: `rounded-[28px] bg-sand-2 p-5 md:p-8`; inner panels: `rounded-[22px] bg-sand` or `rounded-2xl bg-sand`.
- Buttons: `btn`, `btn-outline`, `btn-inverse`. Links: `ink-link`. Pills: `rounded-full border-2 border-cobalt px-3.5 py-1.5`.
- **Entrances**: add `data-reveal` (plus `style={{ "--i": n }}` to stagger). `components/Reveal.tsx` reveals them; content stays visible without JS.
- `data-ui` marks interactive panels; reduced-motion CSS strips movement from their buttons.
- Easing: `var(--ease-out)` = `cubic-bezier(0.23, 1, 0.32, 1)`.
- **Reduced motion is required**: use `useReducedMotion()` from `motion/react`. State changes stay, travel and scale go away.
- **Copy** lives in `lib/content.ts`, not in JSX. Write plain English for recruiters; technical detail goes in small `text-cobalt-soft` lines.
- Accessibility: real `<button>`/`<a>`, labelled inputs, `aria-live="polite"` for results that change, and visible focus (handled globally).

## Known issues / open items

- `PLACEHOLDERS.md` lists the content still to fill in (anything in `[brackets]` on the site).
- `v2-data-science/` (an **untracked folder** at the repo root) looks like a stray duplicate of the project. **Don't edit or delete it**; the owner will decide.
- `package.json` / `package-lock.json` have uncommitted version pins (`@types/node`, `typescript`) that no agent recorded making. Leave them alone unless the owner asks.

## Rules for agents

1. Read `HANDOFF.md` first. Add a dated entry when you finish (what changed, what's left).
2. If a plan exists in `docs/` for your task, follow it step by step and tick off its checkboxes as you go.
   **Roles:** Claude Code writes the plans (`docs/*-plan.md`) and reviews; Gemini makes the code and content changes.
3. Keep changes small and on-style. Don't add dependencies without asking the owner.
4. Run `npm run build` **and** `npm run lint` before saying a change works. Check light and dark themes, a 390px width and reduced motion.
5. Don't commit or push unless the owner asks. Never push to `main`.
6. Never commit secrets (`.env*`, tokens, passwords).
7. If you're unsure about design or content decisions, ask the owner rather than guessing.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
