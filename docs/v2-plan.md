# v2: dark mode, motion, and what makes it stand out

## Research (what the best-scored portfolios do)

Live portfolio sites were blocked by this session's network, so the research base is taste-skill's study of 202 gallery sites, 49 of them portfolios, scored by a panel.

- **Haoqi (design engineer, 7.6).** Nearly our palette: a cobalt field, then everything on blue-black with white type and tone-on-tone blue. Live readouts (local time, coordinates) make a static page feel instrumented. **Take:** dark mode as "cobalt night", and one live readout.
- **Huy Phan (7.7) and Samuel Räikkönen (7.6).** One fixed stage where only the content swaps. **Take:** the Pipeline panel already works this way; keep it.
- **Hebbia (7.7).** Mixed work as a ruled specimen table. **Take:** our tables are real data; let them carry more weight.
- **What separated winners in the study:** an idea from the subject, and one live thing the visitor can use, built from real content.

## Plan

1. **Dark mode: "cobalt night".** Blue-black ground, sand ink, the cobalt section turning into a sand field (the inverse of light). It follows the system setting, has a toggle in the nav, and never flashes the wrong theme on load. The figure gets a night palette too.
2. **Motion, from the taste-skill and Emil Kowalski skills:**
   - Signature: the **masked headline**. Each word rises from behind its own baseline on load (strong ease-out, staggered).
   - **Theme switch:** the new theme opens as a circle from the toggle (View Transitions), instant under reduced motion.
   - **Rolling figures:** the red-team totals (16 tests, 79 runs, 6 vulnerabilities, 3 high) roll up as they arrive.
   - **Interval bars:** each test's 95% interval is drawn as a bar that grows into place.
   - **Scaling wordmark:** the closing name grows to full size as the page ends (scroll-driven CSS, skipped where unsupported).
   - **Page change:** a short rise and fade between tabs.
   - Everything keeps its content without JavaScript, and reduced motion keeps state changes but drops travel.
3. **Stand-out: one live thing from real content.** "Try my extractor's rules": type two names and see whether the Entity Extractor would treat them as one entity (its real `normalize()` and SHA-1 `canonical_id`), then move two sliders to see its real confidence formula and corroboration floor. A recruiter sees how you think, not a claim about it.
4. **Instrumented detail:** a live "it's 14:32 in Colombo" in the contact section, so a recruiter knows when you'll reply.
5. **Verify:** taste-skill lint and inspect in both themes, screenshots at 390 / 768 / 1440, reduced motion, build and lint.
