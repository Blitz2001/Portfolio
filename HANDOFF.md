# HANDOFF.md — Shared working log between agents

Each agent (Claude, Gemini/Antigravity, …) reads this file before working and adds an entry
at the top of **Log** when it finishes. Keep entries short. Move anything long-lived into `AGENTS.md`.

## Current state

- Active branch: **`v2-data-science`** (Next.js 16 + Sanity, deploys to Vercel previews). v1 (Vite) is on `main` and still live on GitHub Pages.
- **Scroll story built & polished** (`docs/fig1-scroll-story-plan.md`, `docs/fig1-polish-plan.md`), **`#now` filled** (`docs/now-section-plan.md`), **remaining placeholders filled** (`docs/placeholders-plan.md`), **light mode set as default**, and **dual-mode GitHub Pages export configured** (`next.config.ts`, `scripts/build-pages.mjs`, `.github/workflows/deploy.yml`) so merging to `main` deploys to `arunusampath.me` while keeping Vercel server routes intact in Git. Ready at `http://localhost:3000`. Nothing committed.

## Open tasks / ideas

- [x] **Build the scroll story** — follow `docs/fig1-scroll-story-plan.md` (Gemini)
- [x] **Polish #fig** — follow `docs/fig1-polish-plan.md` (Gemini)
- [x] **Fill #now** — follow `docs/now-section-plan.md` (Gemini)
- [x] **Fill remaining placeholders** (Hire me, Freelance, Lab) — follow `docs/placeholders-plan.md` (Gemini)
- [ ] Owner: review `/`, `/freelance`, and `/lab`, then commit/push `v2-data-science` and merge PR into `main` to deploy to `arunusampath.me`
- [ ] Owner: decide on the Next.js 16.4.3 security upgrade (the CLI flags a known advisory)
- [x] Real Entity Extractor output — `docs/entity-extractor-sample.json` (real run, fictional test-set names, plus eval scores)
- [ ] Owner: decide what to do with the untracked `v2-data-science/` folder (looks like a stray duplicate)
- [ ] Owner: fill in what's still listed in `PLACEHOLDERS.md` before launch

## Log

<!-- Newest first. Format: ### YYYY-MM-DD — <agent> — <summary> -->

### 2026-11-24 — Gemini (Antigravity) — Configured dual-mode GitHub Pages export for arunusampath.me
- Enabled static export under `GITHUB_PAGES=true` so merging `v2-data-science` → `main` updates `arunusampath.me` on GitHub Pages without deleting Vercel-only features (`proxy.ts`, `/admin`, `/api/visit`, `/studio`) from Git.
- **Changed:**
  - `next.config.ts`: toggles `output: "export"`, `trailingSlash: true`, and `images.unoptimized: true` when `GITHUB_PAGES === "true"`.
  - `app/layout.tsx`: skips `@vercel/analytics` `<Analytics />` when `GITHUB_PAGES === "true"` so static hosting has zero `/_vercel/insights/script.js` 404s.
  - `lib/github.ts` & `lib/projects.ts`: omit `next.revalidate` options under `GITHUB_PAGES === "true"`.
  - `scripts/build-pages.mjs`: temporarily stashes `proxy.ts`, `app/admin`, `app/api`, `app/studio` into `node_modules/.pages-stash` with `try/finally` restore, runs `GITHUB_PAGES=true npm run build`, flattens Windows backslash-nested `__next.*` segment directories (matches Linux CI output), adds `out/.nojekyll`, and asserts `index.html`, `freelance/index.html`, `lab/index.html`, `CNAME`, `resume.pdf`, and `.nojekyll`.
  - `.github/workflows/deploy.yml`: runs `node scripts/build-pages.mjs` on Node 22 (`push` to `main`, daily `cron`, `workflow_dispatch`) with `GITHUB_TOKEN` and uploads `./out`.
  - `eslint.config.mjs` & `tsconfig.json`: added `out/**` / `"out"` ignores.
- **Verified:**
  - `node scripts/build-pages.mjs` ✓ exited 0 (`Route (app): /, /_not-found, /freelance, /lab`, `out/CNAME` = `arunusampath.me`, `.nojekyll` present, server routes restored intact).
  - Served `./out` over a local static HTTP server (`1440×900`, `390×844`, `prefers-reduced-motion`): `0` failures, `badHttp: []`, `consoleErrors: []` across all normal runs, light default (`rgb(230, 219, 199)`), dark toggle (`rgb(8, 17, 51)`), Entity Extractor tabs working, client `<Link>` nav to `/freelance/` working, `/resume.pdf` HTTP `200` (`65977` bytes), all images loaded (`naturalWidth > 0`), and `scrollWidth === innerWidth`. *(Note: the pre-existing `Minified React error #418` from `HeroDrift`/`Tilt` under `prefers-reduced-motion` still fires when that OS setting is enabled.)*
  - Cleaned local `out/`, then verified `npx tsc --noEmit` ✓, `npm run lint` ✓, and normal `npm run build` ✓ (`✓ Generating static pages using 9 workers (6/6) in 1192ms`, with `/admin`, `/api/visit`, `/studio/[[...tool]]`, and `Proxy (Middleware)` intact; Next.js `16.4.3` security warning noted, `next upgrade` not run). Nothing committed.

### 2026-11-24 — Gemini (Antigravity) — Set light mode as default theme
- Made **light mode** (`sand` / `cobalt`) the default theme regardless of OS `prefers-color-scheme: dark`; dark mode now activates only when explicitly chosen via the nav toggle or command palette (`data-theme="dark"` persisted in `localStorage`).
- **Updated:** `app/globals.css` (removed `@media (prefers-color-scheme: dark)` override, added `color-scheme: light` on `:root`), `app/layout.tsx` (`viewport.themeColor: "#e6dbc7"`), `components/ThemeToggle.tsx` (defaults to `"light"` when `data-theme` is unset), `components/CommandPalette.tsx` (`root.dataset.theme === "dark"`), `figures/defenseosint/theme.mjs` and `components/defenseosint/figure.css` (removed prefers-color-scheme dark rule so `.iso.cobalt` also defaults to light).
- **Verified:** `npx tsc --noEmit` ✓, `npm run lint` ✓, `npm run build` ✓ (`✓ Generating static pages using 9 workers (6/6) in 1093ms`; Next.js `16.4.3` security advisory warning noted, `next upgrade` not run). Headless CDP check under emulated OS `prefers-color-scheme: dark` at `1440×900`, `390×844`, and `prefers-reduced-motion` (`0` failures): first load is light (`rgb(230, 219, 199)`, `#e6dbc7` on `.iso.cobalt`), toggling switches to dark and persists across reloads (`1440` & `390`), toggling again restores light; `npm run dev` kept running. Nothing committed.

### 2026-11-24 — Gemini (Antigravity) — Filled remaining placeholders (Hire me, Freelance, Lab)
- **Hire me (`/`)** (`lib/content.ts`, `components/StarSchema.tsx`, `components/StepList.tsx`, `app/(site)/page.tsx`, `public/resume.pdf`):
  - Updated `story.steps`: `ask` → `"Python · FastAPI · JWT"`, `collect` → `"Python · DuckDuckGo search, RSS, BeautifulSoup, Shodan"` (`brief` kept `"Python · gpt-4o-mini"`).
  - Updated `timeline` years & details (`2026`, `2026 – now`, `2023 – 2027` with SLIIT modules), kept `achievements: []`, and updated `redteam.link` comment.
  - Corrected `warehouse` copy and `tables` (`article`, `customer`, `sales`, `date`, `orders`) and updated `StarSchema.tsx` so `FactSales` has `tag="accumulating"` and `OrderFulfillment` replaces `FactFulfilment` with `tag="source"` and a dashed border (plus `min-w-0` / `[overflow-wrap:anywhere]` so 390px does not overflow).
  - Replaced `bank`'s `[0.00]` table with `steps` (`"My part of the team pipeline"` via new `components/StepList.tsx`). Kept `TableRow` for `redteam`.
  - Replaced `public/resume.pdf` with `Arunu_Sampath_CV_AI_Engineer_v2_1.pdf` (`65977` bytes, top line `"AI Engineer Intern Applicant"`).
- **Freelance (`/freelance`)** (`lib/content.ts`, `app/(site)/freelance/page.tsx`, `components/WorkRow.tsx`, `components/DirectContact.tsx`, `public/freelance/myhelper-lanka.png`):
  - Added `onFiverr` guard (`site.fiverr !== "#"`): Hero renders `"Contact me directly"` (`#direct`) as primary CTA with no secondary, Contact `<li>` hides Fiverr, and `DirectContact.tsx` hides `"Prefer a marketplace?"`. Updated `freelance.steps[0]`, `freelance.direct.reply`, and USD `budgets` (`Under $300`..`Over $3,000`); kept `site.whatsapp` empty.
  - Made `image` optional (`WorkImage`) on `freelance.work` and `children` optional in `WorkRow.tsx`. Copied `myhelper_lanka_homepage/screen.png` (`1482×1600`) to `public/freelance/myhelper-lanka.png` and wired it with `next/image`. Removed unused `Shot` import; `POS` (`React, Supabase`) has no image.
- **Lab (`/lab`) & screenshots** (`lib/content.ts`, `app/(site)/lab/page.tsx`, `scripts/shoot.mjs`, `public/lab/proassignment.jpg`, `public/lab/geekspot.jpg`, `PLACEHOLDERS.md`):
  - Hid `"3D experiments"` when `lab.experiments` is empty (`[]`), updated `lab.lead` and `metadata.description`.
  - Wired `ProAssignment` (`github.com/Blitz2001/ProAssignment`) and `Geekspot` (`github.com/Blitz2001/geekspot`, `React, Vite, Tailwind, Node, Cloudinary, PDFKit`) with optional `image` + `next/image` (no `<Shot>`).
  - Created `scripts/shoot.mjs` and captured `1440×900` screenshots, inspecting every image: `proassignment.jpg` and `geekspot.jpg` rendered clean live pages and were kept (`1440×900`); **`public/freelance/africa-travel.jpg` rendered Vercel `503: DEPLOYMENT_PAUSED`** (`https://africa-travel-demo.vercel.app`), so that image was deleted and omitted from `Africa Travel & Life` (card renders text-only).
  - Rewrote `PLACEHOLDERS.md` to list only remaining open owner items (including the paused Africa Travel deployment).
- **Verification:**
  - `npx tsc --noEmit` ✓, `npm run lint` ✓ (`0` warnings/errors), `node .claude/skills/taste-skill/scripts/lint.mjs lib/content.ts components/StarSchema.tsx components/StepList.tsx "app/(site)"` ✓ (`8 file(s)`, `0 FAIL, 0 WARN`).
  - `npm run build` ✓ exited `0` (`✓ Generating static pages using 9 workers (6/6) in 3.3s`). *Note:* Next.js `16.4.3` printed its known security advisory warning during build and dev startup; `next upgrade` was **not** run.
  - Placeholder scan across `/`, `/freelance`, `/lab` returned **`0`** on every route; `http://localhost:3000/resume.pdf` returned `HTTP/1.1 200 OK` (`65977` bytes).
  - `inspect.mjs` at `1440,390`: `/freelance` (`5 images`, previous missing-picture FAIL now passes; only pre-existing `Tilt` `[gradient]` FAIL + expected `[no-footage]`/`[lopsided]` WARNs on text-only cards), `/lab` (`13 images`, `0` new FAILs; only pre-existing `Tilt` `[gradient]` FAIL).
  - CDP checks (`1440×900`, `390×844`, `light`, `dark`, `reducedMotion`) + visual screenshot inspection (`0` failures): `OrderFulfillment` dashed/source & `FactSales` accumulating tags readable with `0` overflow; bank `StepList` renders cleanly; `/freelance` hides Fiverr links and loads MyHelper image (`naturalWidth > 0`); `/lab` hides 3D experiments and loads both side-project images with GitHub `Code` links.
  - `npm run dev` restarted outside the sandbox (`http://localhost:3000`). Nothing committed or pushed.

### 2026-11-24 — Gemini (Antigravity) — Filled "Currently working on" (#now)
- **Content-only change (`lib/content.ts`, `PLACEHOLDERS.md`):**
  - Replaced `now.updated` (`"November 2026"`) and `now.items` (`Building` Jarvis v1 with `"Nov 2026"` and no `link`, `Learning` decision theory / value of information, `Looking for` open-ended AI / data science internship) using the exact copy from `docs/now-section-plan.md`.
  - Updated the `**Currently working on**` bullet in `PLACEHOLDERS.md`. Kept all components, CSS, and layout untouched.
- **Verification:**
  - `npx tsc --noEmit` ✓ exited 0; `npm run lint` ✓ (`eslint .`, 0 warnings/errors); `node .claude/skills/taste-skill/scripts/lint.mjs lib/content.ts` ✓ (`1 file(s)`, `0 FAIL, 0 WARN`).
  - `npm run build` ✓ exited 0 (`✓ Generating static pages using 9 workers (6/6) in 1464ms`). *Note:* Next.js `16.4.3` printed its known security advisory warning during build and dev startup; `next upgrade` was **not** run.
  - Headless CDP inspection of `http://localhost:3000/#now` at `1440×900` and `390×844` in both `light` and `dark`, plus `prefers-reduced-motion` (`0` failures): all 3 cards render the new copy cleanly with zero `[` brackets, `"Building"` shows `.live-dot` and `"since Nov 2026"`, `"Latest on GitHub"` ends with `"Updated November 2026"`, max `<h3>` line wrap at `390px` is **2 lines** (≤ 3), and `scrollWidth === innerWidth` at both widths.
  - Rendered HTML check via `curl.exe -s http://localhost:3000/`: `[Project you are building now]` count = **0**, `"Jarvis v1, a voice assistant for my own work"` present.
  - `npm run dev` restarted outside the sandbox (`http://localhost:3000/#now`). Nothing committed or pushed.

### 2026-11-24 — Claude Code — Plan for the remaining placeholders
- Wrote `docs/placeholders-plan.md`. Every fact in it was checked against the owner's CV, DWBI reports and SQL, the DefenseOSINT repo and GitHub.
- **Correction found:** the site's `FactFulfilment` table doesn't exist. The real warehouse uses accumulating columns on `FactSales`, fed from a simulated `OrderFulfillment` source table. The plan fixes the copy and the StarSchema.
- Bank metrics weren't found anywhere, so the plan swaps the `[0.00]` table for a step list. The Fiverr URL is unknown, so the plan hides Fiverr links until it's set. No Three.js experiments exist, so the plan hides that section.
- No site code changed (Claude plans; Gemini executes).

### 2026-11-24 — Claude Code — Plan for "Currently working on" (#now)
- Wrote `docs/now-section-plan.md`, with the exact copy for Building (Jarvis v1), Learning (decision theory, research P4) and an open-ended Looking for (internship replies pending). **Gemini executes it.**
- Claude briefly edited `lib/content.ts` and `PLACEHOLDERS.md`, then **reverted both** on the owner's request. They're back to the original placeholders, so the plan starts from a clean state.
- **Working rule from the owner:** Claude Code writes plans and reviews; Gemini makes the code and content changes.

### 2026-11-24 — Gemini (Antigravity) — Polished "How DefenseOSINT works" (#fig)
- **Kept the isometric DefenseOSINT switchboard** and carried out `docs/fig1-polish-plan.md` Phases 1–5 without adding dependencies, committing, or running `next upgrade`.
- **Desktop pacing & figure column (`components/story/ScrollStoryClient.tsx`):**
  - Widened the two-column layout to `lg:grid-cols-[1fr_1fr] lg:gap-12 xl:grid-cols-[7fr_6fr] xl:gap-16`, tuned the section header grid (`lg:grid-cols-[8fr_5fr]`) and title size (`text-[clamp(2.125rem,1rem+3.9vw,4.9rem)]`) so `"How DefenseOSINT works"` stays ≤ 2 lines across `1440/1024/768/390`.
  - Paced normal steps (`lg:flex lg:min-h-[46vh] lg:scroll-mt-[27vh] lg:flex-col lg:justify-center lg:py-8`), kept the `mine` step compact (`scroll-mt-[24vh] py-6 focus-within:opacity-100 lg:py-12`), set inactive desktop opacity to `lg:opacity-45`, centred the sticky offset (`lg:top-[max(6rem,calc(50vh-18rem))]`), and restored section bottom padding (`pb-[clamp(80px,10vw,160px)]`).
  - Added the desktop-only 6-pill station rail sharing `jumpToNode` with `onSelect` (inline 12px SVG star on `Entity Extractor` instead of Unicode `★` to keep design lint clean) and the thin `scaleX((active + 1) / 7)` progress bar (`motion-reduce:transition-none motion-reduce:duration-0`).
- **Tabbed Entity card (`components/story/EntityStep.tsx`, `app/globals.css`):**
  - Replaced `<details>` with a WAI-ARIA segmented tablist (`What it found`, `Try it`, `The maths`) supporting Left/Right/Home/End roving `tabIndex`, `44px` tab height, `47–48px` `field` inputs (`py-2.5`), a `150ms` `.tab-panel` opacity fade disabled under reduced motion, and `useSyncExternalStore` SSR/no-JS fallback so all three panels render stacked when JavaScript is off or before hydration.
  - Compaction & clarity: removed entity IDs and `"N sources"` text from rows (moved sources count to `title`, moved IDs, `"Links found"`, and relation precision/recall to `The maths`), put evaluation F1/precision/recall in 3 stat tiles, kept `tabular-nums` strictly on number/ID spans, and added the muted normalised-comparison line (`“…” = “…”`) in `Try it`.
- **Phones, tablets & copy cleanup (`ScrollStoryClient.tsx`, `lib/content.ts`):**
  - Kept all 7 steps at `opacity-100` below `lg`, turned `<ol>` into a vertical timeline (`border-l-2 border-cobalt/20` with heading-aligned dots; `mine` dot always filled `bg-cobalt`, active `lg+` dot filled `bg-cobalt`), capped the figure card at `md:max-w-[600px]` centred below `lg`, and added `"Replays one real investigation."` under the mobile readout (`lg:hidden`).
  - Removed unused `route` and `verdict` fields from `StoryStep` and all 7 steps, updated `eyebrow` comment, changed `extract` eyebrow from `"Entity Extractor · my part"` to `"Entity Extractor"`, and kept the caption + `"Repository"` link on one line on desktop (`max-w-[90ch]`).
- **Measurements (before → after):**
  - **1440×900:** Entity card `727px` → **398px** (≤ 440px target); normal step heights `145–173px` → **414px** each (≥ 350px target); `#fig` height `2163px` → **3599px** (document height `8419px` → `9855px`); sticky card `top: 162px` (`252–927px` at 1920×1080, `96–526px` at 1024×768); tab height `44px`, Try-it inputs `47–48px`, caption `1` line.
  - **390×844:** Entity card `1262px` → **577px** (≤ 620px target); `#fig` height `3309px` → **3047px** (document height `11098px` → `10836px`); all 7 steps `opacity: 1`, dots aligned, max heading wrap `2` lines.
  - **768×1024:** figure card `600px` wide, all 7 steps `opacity: 1`, mobile loop hint visible.
  - **Overflow:** `documentElement.scrollWidth === innerWidth` at `1440`, `1024`, `768`, `390`, and `1920`.
- **Verification:**
  - `npm run build` ✓ exited 0 after clean `.next` rebuild (`✓ Generating static pages using 9 workers (6/6) in 1106ms`, routes `/`, `/_not-found`, `/admin`, `/api/visit`, `/freelance`, `/lab`, `/studio/[[...tool]]`). *Note:* Next.js 16.4.3 prints the known security advisory banner; `next upgrade` was **not** run per instructions.
  - `npx tsc --noEmit` ✓ exited 0; `npm run lint` ✓ (`eslint .`, 0 errors/warnings); `node .claude/skills/taste-skill/scripts/lint.mjs components/story lib/content.ts lib/entity-sample.ts lib/extractor.ts` ✓ (`6 file(s)`, `0 FAIL, 0 WARN`).
  - `node .claude/skills/taste-skill/scripts/inspect.mjs http://localhost:3000/ --widths 1440,1024,768,390` ✓ (`0` new FAILs in `#fig`; only the 2 pre-existing `Tilt` `[gradient]` and `NowSection` `[covered-text]` FAILs remain).
  - Headless CDP walkthrough in `light`, `dark`, keyboard nav, and `prefers-reduced-motion` (`0` failures): all 7 steps activate sequentially with active rail pill (`aria-pressed="true"`) and progress bar following; `Planner` rail pill → `step-plan`, `Critic` station click → `step-check`; keyboard `Tab`/`ArrowRight` navigates tabs (`Try it` defaults give `"Same entity: their evidence merges."`, `Tab` moves to `<select>`, `The maths` shows `org_…` ID and `"Links found"`); reduced motion sets `.tab-panel` animation to `none`, progress bar transition to `0s`, and Critic flag to settled `translate(0 -30.34)`.
  - **Note on dev server & repo state:** `npm run dev` is running outside the sandbox at `http://localhost:3000/#fig`; nothing committed or pushed; `package.json`, `package-lock.json`, and `v2-data-science/` untouched.

### 2026-11-24 — Claude Code — Reviewed Gemini's scroll story, wrote the polish plan
- Checked: build ✓, lint ✓, tsc ✓, screenshots at 1440/1024/768/390 in light and dark. Station clicks → correct step with Lenis on. No horizontal scroll. Data and ID fix are correct.
- Found 11 issues. The main ones: steps are only about 133px tall, so they flick past faster than the figure animates; there's empty space under the pinned figure; the Entity card is 730px tall on desktop and 1262px on a phone; steps dim to 40% on phones with nothing pinned. Full list and fixes: `docs/fig1-polish-plan.md`.
- Did not run `next upgrade` (the build prints a security banner; that's still the owner's call). No app code changed.

### 2026-11-23 — Gemini/Claude (Antigravity) — Built the "How DefenseOSINT works" scroll story (#fig)
- **Built:** `lib/extractor.ts` (normalize, canonicalId with the real `org_`/`per_`/`loc_`/`evt_` prefix, confidence, corroborated), `lib/entity-sample.ts`, `story` in `lib/content.ts`, and `components/story/` (`ScrollStory` server wrapper, `ScrollStoryClient`, `EntityStep`). The home page now goes Hero → #fig → Now. Command palette updated.
- **Removed:** `Pipeline.tsx`, `PipelineLive.tsx`, `ExtractorLab.tsx`, `pipeline`/`Stage` in content.ts, the `#inside` section.
- **Owner change during the build:** the owner preferred the old isometric switchboard over the flat `FlowDiagram`, at the compact card size. So `FlowDiagram.tsx` was dropped, `components/defenseosint/` and `build.mjs` output are **kept**, and the pinned card shows the isometric figure. `figures/defenseosint/live.mjs` gained `highlight()`, `playRange()` and `playLoop()`, so each step plays just its slice of the real trace (step 6 raises the Critic flag, step 7 replays the follow-up round and lowers it). Plan steps 5.2–5.4 are marked as superseded.
- **Small deviations to pass the gates:** the service name sits *under* each step heading, joined with the tech line ("Critic · Python · qwen2.5:3b on Ollama"), because inspect.mjs fails small labels above headings. The section title is a bit smaller than `text-section` so "How DefenseOSINT works" stays on 2 lines. Steps use tight padding, not `min-h-[70vh]`, so the page gets shorter.
- **Mobile layout shipped:** below `lg` the switchboard is **not sticky**. It sits once at the top of #fig and loops the full trace; the steps follow underneath. On `lg+` it's pinned beside the steps.
- **Config:** `eslint.config.mjs` and `tsconfig.json` now ignore `dist/**` and `v2-data-science/**` (the untracked folder itself is untouched). `package.json`/lock untouched.
- **Verification:** `npm run build` ✓ and `npm run lint` ✓ (0 problems), `tsc --noEmit` ✓, taste-skill `lint.mjs` on story files: 0 FAIL, 0 WARN. `inspect.mjs`: **no failures in #fig**. The 2 FAILs left were already there before this work: `gradient` (Tilt spotlight) and `covered-text` (Now section cards under the Tilt layer). CDP checks at 1440/768/390, light and dark: all 7 steps activate in order, the station highlight follows, station click → step, Critic flag up on reject and down on pass, no horizontal scroll, the figure never covers a heading, highlights are correct with no overlap, try-it defaults → "Same entity", Acme Corporation → `org_a153f2d2547c`, details closed by default and opens with Enter, reduced motion = no Lenis and settled poses, Tab order nodes → select → inputs → summary.
  - Last lines of `npm run build`: `✓ Generating static pages using 9 workers (6/6) in 1746ms` / `Finalizing page optimization ...` (routes `/`, `/_not-found`, `/admin`, `/api/visit`, `/freelance`, `/lab`, `/studio/[[...tool]]` built cleanly).
  - Last lines of `npm run lint`: `> portfolio@2.0.0 lint` / `> eslint .` (exited 0 with no warnings or errors).
- **Page height at 1440px:** 8470 px before → **8419 px** after.
- **Left:** the owner reviews and commits. Pre-existing inspect FAILs (Tilt gradient, Now covered-text) are untouched. There's a dev-only hydration warning from `Tilt`/`HeroDrift` under reduced motion that predates this work.

### 2026-11-23 — Claude Code — Real extractor sample
- Ran the real `extract_entities()` (DefenseOSINT repo at `E:\@ Y3 S2\IRWA\DefenseOSINT\DefenseOSINT`, its `.venv`) on nlp-001/002/003/005 from the labelled test set. The output and eval scores (entity F1 0.81 on 23 docs) are in `docs/entity-extractor-sample.json`. The script to rerun it is `docs/entity-extractor-sample.py`.
- Updated the plan: Phase 2.2 uses the real data (no placeholder), and Phase 1.1 fixes `canonicalId` to include the real type prefix (`org_…`).

### 2026-11-23 — Claude Code — Gemini-ready plan + AGENTS.md for v2
- Rewrote `AGENTS.md` for v2: stack, commands, layout, design system rules, agent rules. The Next.js block at the bottom is kept on purpose.
- Wrote the step-by-step build plan `docs/fig1-scroll-story-plan.md`: 7 phases with checkboxes, exact files, copy and verification steps. The owner approved it, and Gemini executes it.
- No app code changed. Nothing committed.

### 2026-11-23 — Claude Code — Plan for Fig 1 + "Inside my part"
- The owner wants the isometric Fig 1 and the ExtractorLab section replaced: they don't fit the look, they're too technical, and they're too long.
- Decided: a flat **scroll story** diagram, with the extractor demo merged into the Entity step.

### 2026-11-23 — Claude Code — Set up shared brain
- Added `AGENTS.md` (the main project context), `CLAUDE.md` and `GEMINI.md` (both import AGENTS.md), and this `HANDOFF.md`.
