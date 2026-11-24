# Plan: polish the "How DefenseOSINT works" section (#fig)

**Status:** ready for Gemini. Approved by the owner on 2026-11-24 ("I like it, make it look better and more responsive").
**Branch:** `v2-data-science`. **Executor:** Gemini (Antigravity). **Reviewer/author:** Claude Code.
**Follows:** `docs/fig1-scroll-story-plan.md` (done).

> Read `AGENTS.md` and `HANDOFF.md` first. Work phase by phase and tick the boxes.
> Keep the isometric switchboard; the owner likes it. Don't commit. Don't add dependencies.
> Don't run `next upgrade`. The Next.js security upgrade is the owner's decision (it's in HANDOFF).

---

## Review of the first run (2026-11-24, Claude Code)

**Works:**
- `npm run build`, `npm run lint` and `tsc --noEmit` pass.
- All 7 steps activate in order.
- Station clicks scroll to the right step with Lenis on (critic → `step-check`, collector → `step-collect`, entity → `step-extract`).
- Dark mode is correct.
- No horizontal scroll at 1440/1024/768/390.
- The `org_` ID fix, the real sample data and the eval numbers are all correct.
- The `live.mjs` additions (`highlight`, `playRange`, `playLoop`) are clean, and reduced motion is respected.

**Problems found (measured with screenshots at 1440/1024/768/390):**

| # | Problem | Where |
|---|---|---|
| 1 | **Steps flick past too fast.** Each step is about 133px tall, so it stays "active" for only about 133px of scrolling. That's shorter than its figure animation, so Analyst and Critic barely register. | `ScrollStoryClient` `li` (`py-2`) |
| 2 | **Big empty area under the pinned figure** on desktop: the card is about 360px tall in a 900px window, and the column below it is blank. | sticky column |
| 3 | **The Entity card is a wall**: 716–730px tall on desktop and **1262px on a phone**, about 40% of the whole section. It's also the most technical part, which the owner wanted less of. | `EntityStep` |
| 4 | **Below `lg`, steps still dim to 40%** although nothing is pinned to sync with. The result is low-contrast grey text on phones and tablets (fails WCAG contrast). | `li` opacity |
| 5 | **Tablet (768):** the figure is full-width (728×473), so the stations are big but the steps start a whole screen later. | figure card |
| 6 | **`tabular-nums` on prose** spreads out punctuation ("documents :", "0 . 81") in the "Tested on…" line. | `EntityStep` |
| 7 | On phones, one entity ID is truncated (`per_4db45f6d5c…`) and the others aren't. The IDs are technical noise in the list anyway. | entity list |
| 8 | "my part" appears twice: eyebrow "Entity Extractor · my part" **and** heading "My part: …". | `lib/content.ts` |
| 9 | Inputs are about 40px tall, below the 44px touch target. | `EntityStep` `field` |
| 10 | Section bottom padding is `clamp(80px,11.5vw,92px)`, while every other section uses `clamp(80px,10vw,160px)`. | `section` |
| 11 | Dead data: `StoryStep.route` and `StoryStep.verdict` aren't read anywhere since FlowDiagram was dropped, and the `eyebrow` comment says "above the heading" but it's rendered below. | `lib/content.ts` |

---

## Phase 1: Desktop pacing and the empty column (fixes 1, 2, 10)

- [x] **1.1** In `ScrollStoryClient`, change the two-column grid to `lg:grid-cols-[1fr_1fr] xl:grid-cols-[7fr_6fr]` with `lg:gap-12 xl:gap-16`. This makes the figure larger so the stations read better. Keep the text `max-w-[54ch]`.
- [x] **1.2** Every step **except** the `mine` step gets `lg:flex lg:min-h-[46vh] lg:flex-col lg:justify-center` and `py-8`. The `mine` step keeps its natural height with `lg:py-12`.
  - Target: at 1440×900, each normal step stays active for at least 350px of scrolling.
  - Total section height at 1440 may grow by up to about 1500px. That's acceptable; pacing matters more here.
- [x] **1.3** Put a **station rail** under the readout, inside the figure card, to fill the empty space with something useful:
  - six pill buttons: Gateway, Planner, Collector, Entity Extractor, Analyst, Critic
  - styled like the old Pipeline pills: `rounded-full border-2 border-cobalt px-3 py-1 text-[0.875rem] font-semibold`
  - the active pill is `bg-cobalt text-sand`; Entity Extractor gets a small `★`
  - `aria-pressed` on the active pill
  - clicking a pill scrolls to the first step for that node, using the same code path as a station click (`onSelect`)
  - **Planner** maps to `step-plan`
  - show the rail **only on `lg+`** (`hidden lg:flex flex-wrap gap-2`)
- [x] **1.4** Below the rail, add a **thin progress bar**: a `h-1 rounded-full bg-cobalt/15` track with a `bg-cobalt` fill, `scaleX((active + 1) / 7)` with `origin-left` and `transition-transform duration-300 ease-[var(--ease-out)]`. Use no numbers or "3 / 7" text (taste-skill flags step numbering). Show it on `lg+` only.
- [x] **1.5** Make the sticky offset centre the card vertically when the window is tall: `lg:top-[max(6rem,calc(50vh-18rem))]`. Check at 1440×900 and 1920×1080 that the card never sits under the top edge.
- [x] **1.6** Inactive steps on `lg+`: `lg:opacity-45` instead of 40. The active step stays at 100. The `mine` step keeps `focus-within:opacity-100`.
- [x] **1.7** Section padding: replace `pb-[clamp(80px,11.5vw,92px)]` with `pb-[clamp(80px,10vw,160px)]`.

## Phase 2: Entity card becomes three tabs (fixes 3, 6, 7, 9)

Goal: the card is **≤ 440px tall on desktop and ≤ 620px on a 390px phone**, and opens on the friendliest view.

- [x] **2.1** Add a segmented control at the top of the card. It's a `role="tablist"` with three `role="tab"` buttons, and each panel is `role="tabpanel"` with `aria-labelledby`.
  - Tabs: **What it found** (default), **Try it**, **The maths**.
  - Style: a `rounded-full bg-sand p-1` track; the active tab is `bg-cobalt text-sand rounded-full px-4 py-2`; inactive tabs are `px-4 py-2 text-cobalt`. Each tab is at least 44px tall.
  - Arrow keys Left/Right move between tabs, with roving `tabIndex` (WAI-ARIA tabs pattern).
  - Panel switch: a 150ms opacity fade only, none under reduced motion.
  - **No JS / SSR:** render all three panels, and hide inactive ones with the `hidden` attribute on the client only after mount. Without JS, all three show stacked. (Use a `mounted` state; the first render shows all three, then the effect hides the inactive ones. Prevent layout flash with `useLayoutEffect`.)
- [x] **2.2** **What it found** tab:
  - The 4 records, as now, with highlights. On phones (< `sm`), put the record id above the text (as now) but make it `text-[0.8125rem]`.
  - **Entity list**:
    - drop the IDs and the "N sources" line from the rows
    - each row is `TYPE pill · name · confidence`, in 2 columns on `sm+`
    - put the sources count in the row's `title` attribute ("2 sources")
  - **Evaluation as 3 stat tiles** in a row (`grid grid-cols-3 gap-2`). Each tile is `rounded-2xl bg-sand px-3 py-2`, with the big number on top (`text-title font-extrabold tracking-[-0.05em]`) and a label under it (`text-[0.8125rem] text-cobalt-soft`):
    - `0.81` "F1"
    - `0.82` "precision"
    - `0.81` "recall"
  - Under the tiles: "Entity accuracy on 23 hand-labelled documents." (no `tabular-nums` on this sentence).
  - Move "Links found" and the relation precision/recall to **The maths** tab.
- [x] **2.3** **Try it** tab: the type select and the two inputs, plus the result box, as now. Change `field` to `py-2.5`, so it's at least 44px tall. Under the result, add one muted line showing the two normalised forms: `“sri lanka air force” = “sri lanka air force”`.
- [x] **2.4** **The maths** tab:
  - the two IDs (now including the prefix)
  - the confidence formula line
  - the corroboration rule
  - the two sliders and the live score
  - "Links found" (the 4 relations)
  - "Relations: precision 1.00, recall 0.71 on the same set."
  - `tabular-nums` only on spans that hold numbers, never on whole sentences.
- [x] **2.5** Remove the old `<details>` "Show the maths"; the tab replaces it.

## Phase 3: Phones and tablets (fixes 4, 5)

- [x] **3.1** **No dimming below `lg`.** Use `opacity-100 lg:opacity-45` for inactive steps (from 1.6) and `opacity-100` for the active one. Below `lg`, every step is full contrast.
- [x] **3.2** **Flow line on all sizes.** Turn the `<ol>` into a vertical timeline:
  - each `li` gets `relative border-l-2 border-cobalt/20 pl-6 md:pl-8` (no border on the last step's lower half is fine; keep it simple)
  - add a dot `absolute -left-[7px] top-[0.6em] size-3 rounded-full border-2 border-cobalt bg-sand` per step; the `mine` step's dot is filled `bg-cobalt`
  - on `lg+`, the **active** step's dot is filled too (`bg-cobalt`), with a `transition-colors duration-200`

  This gives phones the "flow" feeling without a pinned figure, and on desktop it echoes the rail.
- [x] **3.3** **Tablet figure size:** below `lg`, cap the figure card at `md:max-w-[600px]` and centre it with `md:mx-auto`. On `md` only, put the lead paragraph **under** the title (already the case) and keep the figure directly below it.
- [x] **3.4** **Phone spacing:** steps get `py-6` below `lg`; headings keep `text-title`. Check that no heading wraps to more than 3 lines at 390px.
- [x] **3.5** On phones the figure keeps `playLoop()`. Add a one-line muted hint under the readout, shown below `lg` only: "Replays one real investigation." (`text-[0.8125rem] text-cobalt-soft lg:hidden`).

## Phase 4: Copy and code cleanup (fixes 8, 11)

- [x] **4.1** `lib/content.ts`, `extract` step: set `eyebrow: "Entity Extractor"` (the heading already says "My part"). Keep `mine: true`.
- [x] **4.2** Remove `route` and `verdict` from the `StoryStep` type and from all 7 steps. `grep -rn "\.route\|\.verdict" app components lib` must return nothing first. Fix the `eyebrow` comment to "service name, shown under the heading with the tech line".
- [x] **4.3** Keep `trace` (used for the first readout before the figure mounts and without JS).
- [x] **4.4** Put the caption and "Repository" link on one line on `md+`. The caption is already a single `<p>`; just make sure the link isn't forced onto its own line by width (`max-w-[90ch]`).

## Phase 5: Verify

- [x] `npm run build`, `npm run lint` and `npx tsc --noEmit` all pass. Ignore the Next.js security banner in build output; it's not an error, so just report it.
- [x] `node .claude/skills/taste-skill/scripts/lint.mjs components/story lib/content.ts lib/entity-sample.ts lib/extractor.ts` has 0 FAIL.
- [x] With `npm run dev` running: `node .claude/skills/taste-skill/scripts/inspect.mjs http://localhost:3000/ --widths 1440,1024,768,390` has no new FAIL in `#fig` (the 2 known ones in Now/Tilt are pre-existing).
- [x] Measure and record in HANDOFF.md, at 1440×900 and 390×844 (use `getBoundingClientRect()` in the console):
  - [x] Entity card height: **≤ 440px at 1440** and **≤ 620px at 390** (was 730 / 1262).
  - [x] Each normal step is at least 350px tall at 1440 (was 133).
  - [x] Section `#fig` height at 1440 and 390, before and after.
  - [x] `document.documentElement.scrollWidth === innerWidth` at all 4 widths.
- [x] Manual, in light and dark:
  - [x] Desktop: scroll slowly through all 7 steps. The figure plays each slice to the end before the next step arrives at a normal reading pace. The rail pill and progress bar follow.
  - [x] Rail pills and station clicks both scroll to the right step.
  - [x] Tabs: Tab key enters the tablist, arrow keys switch tabs, and Enter on "Try it" then Tab reaches the select and inputs.
  - [x] Try-it defaults give "Same entity" and the ID `org_…`.
  - [x] Phone: all text is full contrast, the timeline dots line up with the headings, and nothing is clipped.
  - [x] Reduced motion: no tab fade, no progress-bar transition, and the figure shows settled poses.
- [x] Add a HANDOFF.md entry with the numbers above and anything you couldn't do. **Stop; don't commit.**
