# Plan: fill "Currently working on" (#now)

**Status:** ready for Gemini. Approved by the owner on 2026-11-24.
**Branch:** `v2-data-science`. **Executor:** Gemini (Antigravity). **Author:** Claude Code.

> Read `AGENTS.md` and `HANDOFF.md` first. This is a **content-only** change: no component, style or
> layout edits. Copy the text below **exactly**, including the curly apostrophes where shown. Don't commit.

## Where the facts come from (don't change them)

- **Building:** the owner's "Jarvis v1 — Build Plan" doc. Jarvis is a push-to-talk voice assistant on the owner's laptop. It sends each request down the cheapest path that can handle it: local rules for quick actions, Gemini for reading and research, Claude for coding. It has a learning mode, Watch / Pair / Solo; in Pair, the owner writes the parts with real decisions. Built from 24 Nov 2026.
- **Learning:** the owner's research role (P4, "Ask, Look or Hedge?"). It's a decision policy for a drone team: Ask the operator, Look again, or Hedge, chosen by expected loss and the value of information.
- **Looking for:** the owner is **still waiting to hear back** on internships, so the card is open-ended. There's no start date and no company.

## Step 1: `lib/content.ts` → `now`

- [x] Replace the `updated` value and the `items` array of `export const now` (currently the `[Month 2026]` / `[Project you are building now]` placeholders) with exactly this. Leave `title`, `lead` and the `satisfies NowItem[]` as they are:

```ts
  updated: "November 2026",
  items: [
    {
      status: "Building",
      title: "Jarvis v1, a voice assistant for my own work",
      detail: "Press a hotkey and speak: local rules handle quick actions, Gemini does the reading, and Claude only gets the coding. A learning mode makes me write the important parts myself.",
      since: "Nov 2026",
    },
    {
      status: "Learning",
      title: "Decision theory and the value of information",
      detail: "For my research role: a policy that decides whether a drone should ask its operator, look again or hedge, by weighing expected loss.",
    },
    {
      status: "Looking for",
      title: "An AI or data science internship",
      detail: "Open now and able to start quickly: full or part time, on site in Colombo or remote. I learn fastest on real data with a team that ships.",
    },
  ] satisfies NowItem[],
```

- [x] Don't add a `link` to any item; Jarvis has no public repo yet.

## Step 2: `PLACEHOLDERS.md`

- [x] Find the "**Currently working on**" bullet under "Hire me (`/`)". Keep its opening (the part in brackets about `/studio`), and replace everything after the colon with:

```
all three items are filled in. "Looking for" is open-ended because internship replies are pending: when an offer lands, change that card (or move it to the timeline). Change `updated` each month.
```

## Step 3: Verify

- [x] `npx tsc --noEmit` and `npm run lint` pass.
- [x] `node .claude/skills/taste-skill/scripts/lint.mjs lib/content.ts` has 0 FAIL.
- [x] With `npm run dev` running, open `http://localhost:3000/#now` and check, at 1440 and 390 wide, in light and dark:
  - [x] the three cards show the new titles and text, with no `[` brackets left in the section
  - [x] "Building" has the live dot and "since Nov 2026"
  - [x] the GitHub card ends with "Updated November 2026"
  - [x] no title wraps to more than 3 lines at 390px
- [x] `curl -s http://localhost:3000/ | grep -c "\[Project you are building now\]"` prints `0`.

## Step 4: Handoff

- [x] Add a HANDOFF.md log entry: what changed and the verification results. Tick "Fill #now" in Open tasks. **Stop; don't commit.**

## Owner can change later (not part of this run)

- Location wording: "on site in Colombo or remote" is an assumption from the site's Colombo clock. The owner may want "anywhere in Sri Lanka" or "remote only".
- When Jarvis gets a GitHub repo, add `link` to the Building item.
