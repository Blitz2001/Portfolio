# Fig 1: DefenseOSINT as a switchboard

An isometric figure of the DefenseOSINT system, built with the anatomy kit (`.claude/skills/anatomy`).

- `model.mjs`: the facts it shows (stations and the real investigation trace from the handover guide).
- `build.mjs`: the geometry. `node figures/defenseosint/build.mjs` regenerates the site files and `out/`.
- `live.mjs`: the animation, shared by the site and `out/defenseosint.html`.
- `out/defenseosint.svg` and `out/defenseosint.png`: stills for READMEs, LinkedIn and slides.

## For the DefenseOSINT README

Copy `out/defenseosint.svg` (or the PNG) to `docs/architecture.svg` in that repo, then:

```markdown
![DefenseOSINT as a switchboard: the Planner hub dispatches to the Collector, Entity Extractor, Analyst and Critic; the Critic's flag sends weak briefs back for a targeted follow-up round](docs/architecture.svg)

The Gateway authenticates each request. The Planner is the only service that holds state: it splits the
objective into tasks and calls each agent over A2A. When the Critic rejects a brief, the Planner turns its
findings into narrow follow-up tasks instead of starting over. Interactive version: https://arunusampath.me
```
