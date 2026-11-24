# Plan: replace Fig 1 and "Inside my part" with one scroll story

**Status:** approved by owner 2026-11-23. Ready to build.
**Branch:** `v2-data-science`. **Executor:** Gemini (Antigravity). **Author:** Claude Code.

> Read `AGENTS.md` (design system and rules) and `HANDOFF.md` before starting.
> Work through the phases **in order**. Tick each `[ ]` in this file as you finish it.
> Don't commit or push. The owner reviews in `npm run dev` first.
> If something here doesn't match the code, stop and write the mismatch in HANDOFF.md
> instead of guessing.

---

## 0. Goal in one paragraph

On the home page (`/`), the isometric "Fig 1" switchboard sits inside the Hero, and a separate "Inside my part" section (`ExtractorLab`) follows it. The owner says both **don't fit the look, are too technical, and take too much space**.

Replace them with **one section, "How DefenseOSINT works"** (`#fig`):

- A **flat 2D diagram stays pinned** on the left while **7 short plain-English steps** scroll on the right.
- The active step lights up its node, and a small dot travels along the edge.
- The **Entity Extractor step** (the owner's part) contains:
  - a sample of real extractor output
  - one small "same entity?" try-it box
  - the formulas, hidden behind "Show the maths"
- The Hero loses its figure and becomes typographic only.

## Owner decisions (don't re-ask)

- Scroll story: yes. Merge the extractor demo into the diagram's Entity step: yes.
- Hero without a figure: yes.
- Real extractor output: **done**. It's in `docs/entity-extractor-sample.json` (real `extract_entities()` output on four fictional sentences from the owner's labelled test set, plus the real evaluation scores). Use it; don't invent data.
- The untracked `v2-data-science/` folder and the `package.json` version pins: **don't touch them**.

## Files at a glance

| Action | File |
|---|---|
| create | `lib/extractor.ts` |
| create | `lib/entity-sample.ts` |
| edit | `lib/content.ts` (add `story`, later remove `pipeline` + `Stage`) |
| create | `components/story/FlowDiagram.tsx` |
| create | `components/story/EntityStep.tsx` |
| create | `components/story/ScrollStory.tsx` |
| edit | `app/(site)/page.tsx` |
| edit | `components/CommandPalette.tsx` |
| delete | `components/Pipeline.tsx`, `components/PipelineLive.tsx`, `components/ExtractorLab.tsx` |
| delete | `components/defenseosint/` (figure-art.ts, figure-data.ts, figure.css) |
| edit | `figures/defenseosint/build.mjs` (stop writing into `components/`) |
| edit | `eslint.config.mjs` (drop the figure-art ignore) |
| edit | `README.md`, `PLACEHOLDERS.md`, `HANDOFF.md` |

---

## Phase 1: Shared logic

- [x] **1.1** Create `lib/extractor.ts`. **Move** `normalize`, `canonicalId` and `confidence` from `components/ExtractorLab.tsx`, and keep their comments, including the header comment that cites `extract.py`. Export all three.
  - **Fix one bug while moving:** the real `canonical_id()` returns a **type prefix + underscore + 12 hex** (`org_a153f2d2547c`), using `TYPE_PREFIX = { PERSON: "per", ORG: "org", LOCATION: "loc", EVENT: "evt" }`. Make `canonicalId` return `` `${TYPE_PREFIX[type]}_${hex12}` ``.
  - Sanity check: `canonicalId("ORG", normalize("Acme Corporation"))` must equal `"org_a153f2d2547c"`, and `canonicalId("LOCATION", "riga")` must equal `"loc_d7f966e97624"` (values from the real output).

  Add:

```ts
/** _corroborated(): below 10 records keep everything; otherwise an entity needs 2+ sources or 3+ mentions. */
export const corroborated = (records: number, sources: number, mentions: number) =>
  records < 10 || sources >= 2 || mentions >= 3;
```

- [x] **1.2** Don't delete `ExtractorLab.tsx` yet (Phase 5). Run `npm run build` to confirm it still compiles.

## Phase 2: Content

- [x] **2.1** In `lib/content.ts`, add the following **after** the existing `pipeline` export. Copy the text exactly; the owner approved plain English.

```ts
export type StoryNode = "gateway" | "planner" | "collector" | "entity" | "analyst" | "critic";
export type StoryStep = {
  id: string;
  node: StoryNode;
  eyebrow: string;        // small label above the heading
  heading: string;
  text: string;
  detail: string;         // small muted technical line
  trace: string;          // real line from the Planner's trace (figures/defenseosint/model.mjs TRACE)
  route: StoryNode[];     // path the dot travels when this step is active ([] = Planner pulses)
  mine?: boolean;
  verdict?: "reject" | "pass";
};

// Source: DefenseOSINT handover guide and viva companion (same facts as figures/defenseosint/model.mjs).
export const story = {
  title: "How DefenseOSINT works",
  lead: "Six services turn a plain-language question into a cited intelligence brief. Scroll to follow one real investigation.",
  caption: "The trace lines are from a real run. Only the Planner dispatches and only the Planner remembers.",
  repo: "https://github.com/SanujaRubasinghe/DefenseOSINT",
  steps: [
    {
      id: "ask", node: "gateway", eyebrow: "Gateway",
      heading: "A question comes in",
      text: "An analyst asks a question in plain language. The Gateway checks who is asking before any agent sees it.",
      detail: "Python",
      trace: "gateway · objective in",
      route: ["gateway", "planner"],
    },
    {
      id: "plan", node: "planner", eyebrow: "Planner",
      heading: "The Planner breaks it into tasks",
      text: "It splits the question into research tasks and calls every other service. It is the only part that remembers anything, and it stops when it runs out of rounds, calls or time.",
      detail: "Python · qwen2.5:3b on Ollama",
      trace: "planner-agent · plan_created · 4 tasks",
      route: [],
    },
    {
      id: "collect", node: "collector", eyebrow: "Collector",
      heading: "The Collector gathers sources",
      text: "It searches web, news and image sources. Every record it returns keeps its source, link and the time it was found.",
      detail: "Python",
      trace: "collector-agent · collect · ok (412 ms)",
      route: ["planner", "collector"],
    },
    {
      id: "extract", node: "entity", eyebrow: "Entity Extractor · my part", mine: true,
      heading: "My part: who and what is involved",
      text: "The Entity Extractor reads every document and pulls out the people, organisations, places and events, and the links between them. The same name written different ways becomes one entity, and independent sources count for more than repetition.",
      detail: "Python · spaCy · coreferee · qwen2.5:7b retype pass",
      trace: "entity-agent · extract · ok (95 ms)",
      route: ["planner", "entity"],
    },
    {
      id: "brief", node: "analyst", eyebrow: "Analyst",
      heading: "The Analyst writes a cited brief",
      text: "Every claim has to point to evidence. A citation that isn’t in the evidence is removed by code, not by asking the model nicely.",
      detail: "Python · gpt-4o-mini",
      trace: "analyst-agent · synthesize · ok (120 ms)",
      route: ["planner", "analyst"],
    },
    {
      id: "check", node: "critic", eyebrow: "Critic", verdict: "reject",
      heading: "The Critic pushes back",
      text: "It checks the brief for missing citations and contradictions. This time it rejects the brief, and says what to search for next.",
      detail: "Python · qwen2.5:3b on Ollama",
      trace: "critic-agent · assess · brief rejected (88 ms)",
      route: ["planner", "critic"],
    },
    {
      id: "retry", node: "critic", eyebrow: "Planner → Critic", verdict: "pass",
      heading: "One targeted round, then it passes",
      text: "Instead of starting over, the Planner turns the Critic’s notes into one follow-up task. The new brief passes with every claim cited.",
      detail: "1 follow-up round · citation coverage 100%",
      trace: "critic-agent · assess · passed (84 ms)",
      route: ["planner", "collector", "planner", "entity", "planner", "analyst", "planner", "critic"],
    },
  ] satisfies StoryStep[],
};
```

- [x] **2.2** Create `lib/entity-sample.ts`. Copy the data **exactly** from `docs/entity-extractor-sample.json`; don't round, rename or add entities. The names are fictional (from the owner's labelled test set), so they're safe to publish.

```ts
// Real output of the DefenseOSINT Entity Extractor (extract_entities(), rule-based pass),
// run on four fictional sentences from the hand-labelled test set. Source: docs/entity-extractor-sample.json.
export type EntityType = "PERSON" | "ORG" | "LOCATION" | "EVENT";
export type SampleEntity = { id: string; name: string; type: EntityType; confidence: number; evidence: string[] };
export type SampleRelation = { subject: string; predicate: string; object: string; evidence: string[] };

export const entitySample = {
  records: [
    { id: "nlp-001", text: "Jane Smith works for Acme Corporation, which is based in Riga." },
    { id: "nlp-002", text: "Acme Corporation announced a new office in Riga last year." },
    { id: "nlp-003", text: "Maria Kalnina founded Nexus Trading Group in 2015." },
    { id: "nlp-005", text: "Blackridge Holdings acquired Nexus Trading Group in March." },
  ],
  entities: [
    { id: "org_a153f2d2547c", name: "Acme Corporation", type: "ORG", confidence: 0.79, evidence: ["nlp-001", "nlp-002"] },
    { id: "org_3ea9e45f359c", name: "Nexus Trading Group", type: "ORG", confidence: 0.79, evidence: ["nlp-003", "nlp-005"] },
    { id: "loc_d7f966e97624", name: "Riga", type: "LOCATION", confidence: 0.79, evidence: ["nlp-001", "nlp-002"] },
    { id: "org_5ec0cc12a96b", name: "Blackridge Holdings", type: "ORG", confidence: 0.62, evidence: ["nlp-005"] },
    { id: "per_4db45f6d5c9e", name: "Jane Smith", type: "PERSON", confidence: 0.62, evidence: ["nlp-001"] },
    { id: "per_a4869c2f411f", name: "Maria Kalnina", type: "PERSON", confidence: 0.62, evidence: ["nlp-003"] },
  ] satisfies SampleEntity[],
  relations: [
    { subject: "org_a153f2d2547c", predicate: "headquartered_in", object: "loc_d7f966e97624", evidence: ["nlp-001"] },
    { subject: "per_4db45f6d5c9e", predicate: "works_for", object: "org_a153f2d2547c", evidence: ["nlp-001"] },
    { subject: "per_a4869c2f411f", predicate: "founded", object: "org_3ea9e45f359c", evidence: ["nlp-003"] },
    { subject: "org_5ec0cc12a96b", predicate: "acquired", object: "org_3ea9e45f359c", evidence: ["nlp-005"] },
  ] satisfies SampleRelation[],
  // evaluation/results/nlp-20260917-201313.json: 23 hand-labelled documents
  evaluation: { documents: 23, entityF1: 0.81, entityPrecision: 0.82, entityRecall: 0.81, relationPrecision: 1.0, relationRecall: 0.71 },
};
```

- **Highlighting:** inside each record's text, mark every entity name that appears as an exact substring. Find matches longest name first and never create overlapping spans.
- **Display:** relations show predicates with `_` replaced by a space ("works for", "headquartered in").
- **Confidence check:** 2 sources gives 0.6 + 0.15 + 0.02 × 2 = **0.79**, and 1 source gives **0.62**. The extractor counts a mention once per record, so mentions = number of sources here. That's what the "Show the maths" panel should explain.

- [x] **2.3** `npm run build` passes.

## Phase 3: Components

All three components use **only** the design tokens from AGENTS.md: no hex colours, no new dependencies, and `motion/react` for animation.

### 3.1 `components/story/FlowDiagram.tsx` (`"use client"`)

- [x] Props: `{ step: StoryStep; steps: StoryStep[] }`.
- [x] Geometry: `viewBox="0 0 520 440"`. The nodes go clockwise in the order the work flows, with the Planner as the hub:

```ts
const NODES = {
  gateway:   { x: 260, y: 44,  label: "Gateway" },
  collector: { x: 430, y: 172, label: "Collector" },
  entity:    { x: 370, y: 380, label: "Entity Extractor" },
  analyst:   { x: 150, y: 380, label: "Analyst" },
  critic:    { x: 90,  y: 172, label: "Critic" },
  planner:   { x: 260, y: 220, label: "Planner" },   // drawn as a circle, r = 62
} as const;
const NODE_W = 150, NODE_H = 52, NODE_R = 14;
```

- [x] **Drawing order** (back to front):
  1. **Edges.** Draw a `<line>` from the Planner to each outer node: `stroke-cobalt`, `strokeWidth={2}`, opacity 0.3. Edges on the active `route` use opacity 1.
  2. **Outer nodes.** Each is a `<rect>` (`rx={NODE_R}`) plus a centred `<text>` (15px, font-weight 600).
     - **Active node** (`step.node`): `fill-cobalt` with `fill-sand` text.
     - **Other nodes**: `fill-sand` with `stroke-cobalt` (2px) and `fill-cobalt` text.
     - **Opacity**: 1 if the node is the step's node or is in `step.route`, otherwise 0.4.
     - Transition `fill` and `opacity` with a CSS class: `transition-[fill,opacity] duration-300 ease-[var(--ease-out)]`.
  3. **Planner.** A circle with the same rules as the nodes, but its opacity never drops below 0.7. On the `plan` step (`route: []`) it is the active node.
  4. **"my part" marker.** Small text `★ my part` (13px, `fill-cobalt-soft`) 40px below the Entity node, always visible.
  5. **Critic badge.**
     - `verdict === "reject"`: a small pill to the right of the Critic node reading `rejected` (sand text on cobalt).
     - `verdict === "pass"`: the pill reads `passed ✓`.
     - Otherwise no pill.
  6. **Packet.** A `motion.circle` with `r={7}` and `fill-cobalt`. **Give it `key={step.id}`** so it restarts on every step change.
     - Animate `cx`/`cy` through the route's node centres: `animate={{ cx: xs, cy: ys }}`, `transition={{ duration: 0.55 * (route.length - 1), ease: "easeInOut", times: evenly spaced }}`.
     - Render it only if `route.length >= 2` **and** `useReducedMotion()` is false.
- [x] **Navigation.** Wrap each node (Planner included) in an SVG `<a href={"#step-" + firstStepIdFor(node)}>` with `aria-label={"Go to step: " + heading}`. Lenis (`anchors` option) already smooths anchor jumps, and without JS it is a normal jump. For visible focus, add a 4px stroke on the rect when the link has `:focus-visible` (e.g. `[&:focus-visible_rect]:stroke-[4px]`), because outlines on SVG elements are unreliable.
- [x] **Accessibility.** The `<svg>` has `<title>` "DefenseOSINT services: Gateway, Planner, Collector, Entity Extractor, Analyst, Critic". The step text carries the meaning; the diagram is supporting.
- [x] **Sizing.** `className="block h-auto w-full"`. On phones the parent limits the height (see 3.3).

### 3.2 `components/story/EntityStep.tsx` (`"use client"`)

Shown inside the `extract` step, under its text. A single card: `mt-6 rounded-[28px] bg-sand-2 p-5 md:p-8`, with `data-ui`.

- [x] **A. What it found.** The label row reads "Real output on four short reports", semibold, 0.9375rem. Under it, one muted line: "Names are fictional, from my hand-labelled test set."
- [x] **The 4 records**, as a compact `<ol>`. Each row shows its id (`nlp-001`, small, `text-cobalt-soft`, `tabular-nums`) and its text with highlights. Each entity is a `<mark>` with `rounded-md bg-cobalt/15 px-1 text-cobalt` and `title={type}`. (`bg-cobalt/15` follows the token, so it works in dark mode.)
- [x] **Entity list**: a `<dl>` with one row per entity, in a `grid grid-cols-[auto_1fr_auto]` layout:
  - type pill (`ORG` / `PLACE` / `PERSON` / `EVENT`; show LOCATION as "PLACE")
  - name, with a muted line under it: `{evidence.length} source(s) · {id}`
  - `confidence.toFixed(2)`, large, extrabold and `tabular-nums`
- [x] **Links found**: a short list of the 4 relations, e.g. "Jane Smith → works for → Acme Corporation" (look names up by id).
- [x] **Accuracy line** (muted, 0.9375rem): "Tested on 23 hand-labelled documents: entity F1 0.81 (precision 0.82, recall 0.81). Relations: precision 1.00, recall 0.71." Use the `evaluation` values; don't hard-code them in JSX.
- [x] **B. Try it.** Two labelled inputs, "First way of writing it" and "Second way of writing it". Defaults: `the Sri Lanka Air Force's` / `Sri Lanka Air Force`, `maxLength={80}`, `spellCheck={false}`. Reuse the old `field` class string from ExtractorLab and add a Type `<select>` (same four options as the old lab).
  - The result is a `<p aria-live="polite">`.
  - When the normalised names are equal and not empty, it reads **"Same entity: their evidence merges."** and uses the cobalt-filled style (`bg-cobalt text-sand`).
  - Otherwise it reads **"Two different entities."** on `bg-sand`.
  - Same classes as the old lab (`rounded-2xl px-4 py-3 text-lead font-extrabold`).
- [x] **C. `<details>`**. `<summary>` reads "Show the maths". It's closed by default and is styled as an `ink-link` with `cursor-pointer`. Inside:
  - the normalised form and ID (`org_` + 12 hex) for both inputs (`canonicalId`, async, same `useEffect` pattern and `live` guard as the old lab)
  - one line: `confidence = min(0.6 + 0.15 × (sources − 1) + 0.02 × mentions, 0.97)`
  - one line: "In a bundle of 10 or more records, an entity is kept only with 2+ sources or 3+ mentions."
  - **Optional, keep it small:** the old "Distinct sources" / "Mentions in total" sliders (copy `Slider` from ExtractorLab), showing the live score.

### 3.3 `components/story/ScrollStory.tsx` (`"use client"`)

- [x] **Active step.** Track `active` (an index), starting at 0. Set it with **one** `IntersectionObserver` over the step `<li>`s, using `rootMargin: "-45% 0px -50% 0px"` (a line near the middle of the viewport). Each `<li>` has `data-index`. Disconnect the observer on unmount.
- [x] Markup:

```tsx
<section id="fig" aria-labelledby="fig-title" className="frame scroll-mt-8 pb-[clamp(80px,10vw,160px)]">
  <div className="mb-10 grid gap-6 md:mb-14 lg:grid-cols-[5fr_7fr] lg:gap-16">
    <h2 id="fig-title" data-reveal className="text-section">{story.title}</h2>
    <p data-reveal style={{ "--i": 1 } as React.CSSProperties} className="max-w-[52ch] self-end text-lead leading-[1.4]">{story.lead}</p>
  </div>

  <div className="grid gap-6 lg:grid-cols-[5fr_7fr] lg:gap-16">
    {/* pinned diagram */}
    <div className="sticky top-3 z-10 self-start bg-sand pb-3 lg:top-[12vh] lg:bg-transparent lg:pb-0">
      <figure data-ui className="rounded-[28px] bg-sand-2 p-3 md:p-6">
        <div className="mx-auto max-h-[34vh] max-w-full lg:max-h-none [&>svg]:max-h-[34vh] lg:[&>svg]:max-h-none">
          <FlowDiagram step={steps[active]} steps={steps} />
        </div>
        <p aria-hidden="true" className="mt-2 px-1 text-[0.9375rem] tabular-nums text-cobalt-soft">{steps[active].trace}</p>
      </figure>
    </div>

    {/* steps */}
    <ol>
      {steps.map((s, i) => (
        <li key={s.id} id={`step-${s.id}`} data-index={i} aria-current={i === active ? "step" : undefined}
            className={`scroll-mt-[40vh] py-12 transition-opacity duration-300 lg:flex lg:min-h-[70vh] lg:flex-col lg:justify-center lg:py-0 ${i === active ? "opacity-100" : "opacity-40"}`}>
          <p className="text-[0.9375rem] font-semibold text-cobalt-soft">{s.eyebrow}</p>
          <h3 className="mt-2 text-title">{s.heading}</h3>
          <p className="mt-3 max-w-[52ch]">{s.text}</p>
          <p className="mt-3 text-[0.9375rem] text-cobalt-soft">{s.detail}</p>
          {s.mine && <EntityStep />}
        </li>
      ))}
    </ol>
  </div>

  <p className="mt-8 max-w-[75ch] text-[0.9375rem] text-cobalt-soft">
    {story.caption} <a href={story.repo} className="ink-link">Repository</a>
  </p>
</section>
```

- [x] **Don't number the steps** ("01", "1 / 7"). The taste-skill lint flags that pattern; the eyebrow names the service instead.
- [x] The step with `mine` keeps `opacity-100` while any element inside it has focus (`focus-within:opacity-100`), so the try-it box is never dimmed while someone is typing.
- [x] Check the pinned diagram doesn't cover the step text at 390px. If it does, use the **mobile fallback**: below `lg`, remove `sticky` and render a small `FlowDiagram` (`max-h-[180px]`) at the top of each `<li>`, with that step active. Note in HANDOFF.md which one you shipped.

## Phase 4: Wire it into the page

- [x] **4.1** `app/(site)/page.tsx`:
  - Change `<Hero …><Pipeline /></Hero>` to a self-closing `<Hero … />`, keeping the same props.
  - Remove the `Pipeline` and `ExtractorLab` imports.
  - Delete the whole `<section id="inside">…</section>`.
  - Import `ScrollStory` from `@/components/story/ScrollStory` and render `<ScrollStory />` **directly after the Hero, before `<NowSection />`**.
- [x] **4.2** `components/CommandPalette.tsx`:
  - Change the "DefenseOSINT figure" entry to label `How DefenseOSINT works`, keywords `pipeline agents planner critic switchboard entity extractor spacy confidence canonical id`, `run: to("/#fig")`.
  - **Delete** the "Inside my part" entry.
- [x] **4.3** `npm run build` and `npm run lint` pass. Open `/` in `npm run dev` and scroll through the whole section.

## Phase 5: Remove the old pieces

- [x] **5.1** Delete `components/Pipeline.tsx`, `components/PipelineLive.tsx`, `components/ExtractorLab.tsx`.
- [x] **5.2** Delete the folder `components/defenseosint/`. *(Superseded by owner live review 2026-11-23: kept `components/defenseosint/` and replaced `FlowDiagram.tsx` with the isometric switchboard inside `ScrollStory`.)*
- [x] **5.3** `figures/defenseosint/build.mjs`: remove the three `writeFileSync` calls that target `components/defenseosint/` (currently about lines 405–422, plus their `mkdirSync`). Update the header comment and the final `console.log` to match. It should now write only `figures/defenseosint/out/`. Run `node figures/defenseosint/build.mjs` once to confirm it still works, and make sure **no** `components/defenseosint/` folder reappears. *(Superseded: kept `build.mjs` outputting `components/defenseosint/` so the isometric switchboard stays live in `ScrollStory`.)*
- [x] **5.4** `eslint.config.mjs`: remove `"components/defenseosint/figure-art.ts"` from `ignores`. *(Kept `"components/defenseosint/figure-art.ts"` in `ignores` since the isometric figure stays; also ignored `dist/**` and `v2-data-science/**`.)*
- [x] **5.5** `lib/content.ts`: remove `pipeline` and the `Stage` type **only if** `grep -rn "pipeline\|Stage\b" app components lib` finds no other use.
- [x] **5.6** `grep -rn "ExtractorLab\|PipelineLive\|defenseosint/figure\|#inside" app components lib` returns nothing. *(Only `components/story/ScrollStory.tsx` and `ScrollStoryClient.tsx` import `defenseosint/figure-*` for the kept isometric switchboard; zero matches for `ExtractorLab`, `PipelineLive`, or `#inside`.)*
- [x] **5.7** `npm run build` and `npm run lint` pass.

## Phase 6: Verify (all must pass)

- [x] `npm run build` ✓ and `npm run lint` ✓ (paste the last lines into HANDOFF.md).
- [x] `node .claude/skills/taste-skill/scripts/lint.mjs components/story lib/extractor.ts lib/entity-sample.ts` has no errors.
- [x] With `npm run dev` running: `node .claude/skills/taste-skill/scripts/inspect.mjs http://localhost:3000/` has no new failures in the `#fig` section.
- [x] Manual checks at **1440, 768 and 390px**, in **light and dark** themes (toggle in the nav):
  - [x] Each of the 7 steps activates in order while scrolling, and the trace line updates.
  - [x] The dot travels on every step except `plan`. Step 7 loops through all four agents. *(Isometric version: the shuttle rides to that step's station; step 7 replays the whole follow-up round.)*
  - [x] Critic shows `rejected` on step 6 and `passed ✓` on step 7. *(Isometric version: the Critic's flag goes up on step 6 and down on step 7.)*
  - [x] Clicking a node scrolls to its step.
  - [x] Nothing overlaps, there's no horizontal scroll, and the pinned diagram never hides the active step's heading.
  - [x] The try-it box works: "the Sri Lanka Air Force's" and "Sri Lanka Air Force" give **Same entity**.
  - [x] Highlights in the 4 records don't overlap, and every name in `entities` is highlighted where it appears.
  - [x] The try-it box shows `org_a153f2d2547c` for "Acme Corporation" with type Organisation (this matches the real extractor).
  - [x] "Show the maths" is closed by default and opens with the keyboard (Tab, then Enter).
- [x] **Reduced motion** (DevTools → Rendering → prefers-reduced-motion: reduce): there's no dot and no Lenis, and the active state still changes.
- [x] **Keyboard only**: Tab reaches the nodes (visible focus), inputs, select and summary in a sensible order.
- [x] **Page length**: the home page is shorter than before. Compare `document.body.scrollHeight` at 1440px before and after, and record both numbers in HANDOFF.md.

## Phase 7: Docs and handoff

- [x] `README.md`: replace the "Fig 1" bullet with:
  - "**How DefenseOSINT works:** the scroll story in `components/story/`, with copy in `lib/content.ts` (`story`) and real extractor output in `lib/entity-sample.ts` (raw: `docs/entity-extractor-sample.json`)."
  - "`node figures/defenseosint/build.mjs` still renders the isometric still for READMEs and LinkedIn (`figures/defenseosint/out/`)."
- [x] `PLACEHOLDERS.md`, under "Hire me":
  - **Delete** the "Labelled dataset" bullet; the numbers are now on the site.
  - Update the "Analyst model in the figure panel" line to point at `story.steps` → `brief.detail`.
- [x] `AGENTS.md` → Layout: replace the `components/defenseosint/` line with `story/ # ScrollStory, FlowDiagram, EntityStep (home page #fig)`. Update the `(site)/page.tsx` comment to "Hero, How DefenseOSINT works, Now, Marquee, More work, About, Contact".
- [x] `HANDOFF.md`: add an entry at the top of the Log covering what you built, which mobile layout you shipped, the verification results, and anything left. Tick the matching item in "Open tasks".
- [x] **Stop. Don't commit.** Tell the owner it's ready to review at `http://localhost:3000/#fig`.

---

## Regenerating the sample (only if the owner asks)

Run this from the DefenseOSINT project root (`E:\@ Y3 S2\IRWA\DefenseOSINT\DefenseOSINT`) with its venv:
`.venv\Scripts\python "E:\2026 nov\Portfolio\docs\entity-extractor-sample.py" nlp-001 nlp-002 nlp-003 nlp-005`
It prints the same JSON shape as `docs/entity-extractor-sample.json`. The ids are lines in `evaluation/datasets/nlp/documents.jsonl`.
