# Plan: fill the remaining placeholders (Hire me, Freelance, Lab)

**Status:** ready for Gemini. Owner asked on 2026-11-24 to "fill in the other remaining parts".
**Branch:** `v2-data-science`. **Executor:** Gemini (Antigravity). **Author:** Claude Code (plans only).

> Read `AGENTS.md` and `HANDOFF.md` first. Work phase by phase and tick each box.
> **Every fact below was checked against the owner's files** (CV, DWBI reports and SQL, the DefenseOSINT
> repo, GitHub). Copy text exactly. Don't invent numbers, links or dates. If something doesn't match,
> stop and write it in HANDOFF.md. Don't commit. Don't add dependencies.

## Sources used (for the reviewer)

| Fact | Source |
|---|---|
| CV, modules, project wording | `C:\Users\Arunu_Sampath\Downloads\Arunu_Sampath_CV_AI_Engineer_v2_1.pdf` (latest general CV, 23 Oct 2026) |
| H&M schema | `E:\@1 Y3S1\DWBI\Assingment 1 report\IT23839656_DWBI_assignment_01.docx`, `...\assinment 2\IT23839656_DWBI_assignment_02.docx`, `E:\@1 Y3S1\DWBI\dataset H&m\SQLQuery1.sql` / `SQLQuery2.sql` / `SQLQuery2224.sql` |
| Gateway / Collector / Analyst tech | `E:\@ Y3 S2\IRWA\DefenseOSINT\DefenseOSINT\services\*\requirements.txt`, `services/analyst-agent/analyst_agent/config.py` (`ANALYST_MODEL` default `gpt-4o-mini`) |
| Repo and live links | `https://api.github.com/users/Blitz2001/repos` |
| Freelance start | earliest client repos: POS projects May–Jun 2026, Africa Travel Jun 2026, MyHelper Aug 2026 |
| SLIIT start | student ID `IT23…` = 2023 intake; CV says "Expected 2027" |

**Not found anywhere, so left for the owner:** Fiverr profile URL, bank-marketing metrics, a POS screenshot, a public red-team report, Three.js experiments, and whether to publish the WhatsApp number.

---

## Phase 1: Hire me page (`lib/content.ts`, `components/StarSchema.tsx`, `app/(site)/page.tsx`)

### 1.1 DefenseOSINT story tech (`story.steps`)
- [x] `ask` step: `detail: "Python · FastAPI · JWT"`
- [x] `collect` step: `detail: "Python · DuckDuckGo search, RSS, BeautifulSoup, Shodan"`
- [x] `brief` step: leave `"Python · gpt-4o-mini"`. That's the configured default (`ANALYST_MODEL`), so it's correct as written.

### 1.2 Red-teaming row
- [x] Leave `link: "#"` (a `#` link is hidden by design). Replace the comment with `// no public report yet; "#" hides the Code link`.

### 1.3 H&M warehouse: correct the facts
The site currently shows a separate `FactFulfilment` table with guessed columns. **That table doesn't exist.** The real warehouse is:
- `FactSales` with three accumulating-snapshot columns
- 3 dimensions: DimArticle (SCD1), DimCustomer (SCD2 on `postal_code`) and DimDate
- completion times that come from a separate **simulated** staging table, `HM_Staging.dbo.OrderFulfillment`, through SSIS package 4

- [x] `warehouse.body` →
  `"A Kimball star schema on the H&M Kaggle dataset, millions of transactions. Four SSIS packages load it, with SCD Type 2 customers and accumulating-snapshot columns that time each order’s fulfilment from a separate, simulated orders database. An SSAS cube and four Power BI reports sit on top."`
- [x] `warehouse.link`: leave `"#"`, since there's no public repo. Replace the comment with `// no public repo; "#" hides the Code link`.
- [x] Replace `warehouse.tables` with:

```ts
  tables: {
    article: ["ArticleSK", "index_name › product_group_name", "product_type_name", "colour_group_name", "department_name"],
    customer: ["CustomerSK", "club_member_status · age", "postal_code", "StartDate · EndDate"],
    sales: ["DateKey", "ArticleSK", "CustomerSK", "sales_channel_id", "price", "accm_txn_create_time", "accm_txn_complete_time", "txn_process_time_hours"],
    date: ["DateKey", "CalendarYear · Quarter · Month", "Week"],
    orders: ["TransactionID", "accm_txn_complete_time"],
  },
```

- [x] `components/StarSchema.tsx`:
  - `FactSales` gets `tag="accumulating"`.
  - Replace the `FactFulfilment` box with `<Table name="OrderFulfillment" tag="source" cols={t.orders} className="[grid-area:s] border-dashed" />`. The dashed border shows it's a source table that feeds the fact, not part of the star.
  - Set `aria-label` to `"Star schema: FactSales with accumulating fulfilment columns, joined to DimArticle, DimCustomer (SCD type 2) and DimDate; completion times come from a separate OrderFulfillment source table"`.
  - If the `fact` box is now taller than the others at 390px, that's fine. Make sure nothing overflows horizontally.

### 1.4 Bank marketing: no metrics found, so show the work, not fake numbers
Remove the `[0.00]` table; publishing placeholder numbers is worse than none.

- [x] In `lib/content.ts` → `bank`:
  - delete `caption`, `columns` and `rows`
  - add `steps: ["Correlation and confound analysis across all features", "Outlier treatment and categorical encoding", "Trained and tuned the XGBoost model", "Built the model comparison table the team used to pick the final model"]`
  - change `meta` to `"Team project · Python, pandas, scikit-learn, XGBoost, UCI Bank Marketing dataset"`
  - leave `link: "#"`, with comment `// no public repo; "#" hides the Code link`
- [x] Create `components/StepList.tsx`. It's a server component with props `{ caption: string; steps: string[] }` that renders:

```tsx
<div data-ui className="rounded-[28px] bg-sand-2 p-4 md:p-8">
  <p className="mb-3 font-semibold">{caption}</p>
  <ol className="grid gap-3">
    {steps.map((s) => (
      <li key={s} className="flex gap-3 border-b-2 border-cobalt pb-3 last:border-0 last:pb-0">
        <span aria-hidden="true" className="mt-2 size-2.5 shrink-0 rounded-full bg-cobalt" />
        <span>{s}</span>
      </li>
    ))}
  </ol>
</div>
```

  No numbering text; taste-skill flags "01 / 02".
- [x] `app/(site)/page.tsx`: `<WorkRow {...bank}><StepList caption="My part of the team pipeline" steps={bank.steps} /></WorkRow>`. Remove the now-unused `DataTable` import only if nothing else uses it (the red-team row still does, so it probably stays).
- [x] `TableRow` type: keep it (red-team uses it).

### 1.5 CV
- [x] Copy `C:\Users\Arunu_Sampath\Downloads\Arunu_Sampath_CV_AI_Engineer_v2_1.pdf` over `public/resume.pdf`. Same filename, so every link keeps working. Use the general AI Engineer CV, **not** the TwistDigital one, which is addressed to one company.

### 1.6 Path so far (`timeline`)
- [x] DefenseOSINT entry: `when: "2026"`.
- [x] Freelance entry: `when: "2026 – now"`.
- [x] SLIIT entry: `when: "2023 – 2027"`, `detail: "GPA 3.54. Modules include Machine Learning & Optimization Methods, Data Warehousing & Business Intelligence, and Information Retrieval & Web Analytics."`

### 1.7 Achievements
- [x] Leave the list empty (the section stays hidden). The only candidate, the DataCamp certification, is still in progress.

## Phase 2: Freelance page

### 2.1 Fiverr link (URL unknown, so degrade gracefully)
- [x] `app/(site)/freelance/page.tsx`: add `const onFiverr = site.fiverr !== "#";`.
  - Hero: if `onFiverr`, keep as is. Otherwise use `action={{ href: "#direct", label: "Contact me directly" }}` and no `secondary`.
  - The Contact `<li>` Fiverr link: render it only when `onFiverr`.
- [x] `components/DirectContact.tsx`: render the "Prefer a marketplace?" block only when `site.fiverr !== "#"`.
- [x] `freelance.steps[0]` → `"Message me directly with the form below, or on Fiverr."` This still reads correctly without the Fiverr link.

### 2.2 Direct contact
- [x] `freelance.direct.reply` → `"I reply within one working day."`
- [x] `freelance.direct.budgets` → `["Not sure yet", "Under $300", "$300 – $1,000", "$1,000 – $3,000", "Over $3,000"]`. USD, to match Fiverr; the owner can change the ranges.
- [x] `site.whatsapp`: leave `""` (hidden). The owner hasn't confirmed publishing a phone number.

### 2.3 Client work: real pictures, optional image
- [x] Change the `work` item type so `image` is optional and structured: `image?: { src: string; alt: string; width: number; height: number }`.
- [x] In the page, render `next/image` (`className="aspect-[16/10] w-full rounded-[28px] object-cover object-top"`, `sizes="(min-width: 768px) 50vw, 100vw"`) when `image` exists, and **nothing** otherwise. `WorkRow` needs `children`, so pass `null` if that's allowed; otherwise make `children` optional in `WorkRow` and render the media column only when present.
- [x] **MyHelper Lanka:** copy `E:\fiverr\Health-Care-App-FIverr-project-01\stitch_myhelper_lanka_brand_assets\myhelper_lanka_homepage\screen.png` to `public/freelance/myhelper-lanka.png`. Set `image: { src: "/freelance/myhelper-lanka.png", alt: "MyHelper Lanka home page design: book a verified helper for an elderly parent", width: <real px>, height: <real px> }`. Read the real pixel size from the file.
- [x] **Africa Travel & Life:** screenshot `https://africa-travel-demo.vercel.app` (script in Phase 4) and save it as `public/freelance/africa-travel.jpg`. Alt: `"Africa Travel & Life magazine site home page"`.
- [x] **POS:** `meta: "React, Supabase"` (true for every POS build on disk). **No image.**
- [x] Remove the `Shot` import from the freelance page if it's no longer used.

## Phase 3: Lab page

- [x] **3D experiments:** none exist on disk or GitHub.
  - Set `lab.experiments: []`.
  - In `app/(site)/lab/page.tsx`, render the "3D experiments" `<section>` only when `lab.experiments.length > 0`.
  - Change `lab.lead` to `"Logos and brand work, and the side projects where I learned to build full stack."`
  - Change the page `description` (line 14) to `"Logo and brand work and side projects."`
- [x] **ProAssignment:**
  - `link: "https://github.com/Blitz2001/ProAssignment"`
  - screenshot `https://pro-assignment-six.vercel.app` → `public/lab/proassignment.jpg`
- [x] **Geekspot:**
  - `link: "https://github.com/Blitz2001/geekspot"`
  - `meta: "React, Vite, Tailwind, Node, Cloudinary, PDFKit"` (matches the CV)
  - screenshot `https://geekspot-five.vercel.app` → `public/lab/geekspot.jpg`
- [x] Give `lab.projects` items an optional `image` (same shape as 2.3) and render `next/image` in place of `<Shot label="[Screenshot: …]">`. With no image, render nothing (same rule as 2.3).
- [x] Remove `Shot` imports that are no longer used. If `components/Shot.tsx` has no users left, leave the file; the owner may want it later.

## Phase 4: Screenshots (one script, no new dependencies)

- [x] Create `scripts/shoot.mjs` using the taste-skill CDP helper:

```js
// node scripts/shoot.mjs : captures live pages for the freelance and lab cards (1440×900, top of page).
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
const { Browser, sleep } = await import(pathToFileURL(resolve(".claude/skills/taste-skill/scripts/lib/cdp.mjs")).href);
const SHOTS = [
  ["https://africa-travel-demo.vercel.app", "public/freelance/africa-travel.jpg"],
  ["https://pro-assignment-six.vercel.app", "public/lab/proassignment.jpg"],
  ["https://geekspot-five.vercel.app", "public/lab/geekspot.jpg"],
];
const browser = await Browser.launch();
try {
  for (const [url, out] of SHOTS) {
    const page = await browser.newPage({ width: 1440, height: 900 });
    await page.goto(url, { timeoutMs: 45000, settleMs: 2500 });
    await sleep(1500);
    await page.screenshot({ path: out, quality: 82 });
    await page.close();
    console.log("saved", out);
  }
} finally {
  await browser.close();
}
```

- [x] Run `node scripts/shoot.mjs`, then **open each image and look at it**. If a page shows an error, a blank screen, a cookie wall or only a login form, **don't use that image**. Leave that card without an image and note it in HANDOFF.md.
- [x] Image dimensions are 1440×900 for `width`/`height`.

## Phase 5: PLACEHOLDERS.md

- [x] Rewrite it so it lists **only what's still open for the owner**:
  - Fiverr profile URL (`site.fiverr`). Once set, the Fiverr buttons reappear on their own.
  - WhatsApp: set `site.whatsapp` only if they want their number public.
  - Bank marketing metrics: send precision / recall / F1 / ROC AUC per model to bring back the comparison table.
  - Budget ranges and reply time: check that the defaults suit them.
  - POS screenshot, and any freelance or lab screenshot the script couldn't capture.
  - Red-team report or warehouse repo, if either becomes public.
  - Three.js experiments: the section reappears when `lab.experiments` has items.
  - Achievements: hidden until one is added (DataCamp certification once finished).
  - Morgij logo image (optional), the "Looking for" card when an offer lands, `now.updated` monthly.
  - Before launch: `git push origin v1-mern-final`, then `DEPLOY.md`.

## Phase 6: Verify

- [x] `npx tsc --noEmit`, `npm run lint` and `npm run build` pass. The Next.js security banner in build output isn't an error; just report it, and **don't** run `next upgrade`.
- [x] `node .claude/skills/taste-skill/scripts/lint.mjs lib/content.ts components/StarSchema.tsx components/StepList.tsx "app/(site)"` has 0 FAIL.
- [x] With `npm run dev` running, each of these prints `0`:

```bash
for p in / /freelance /lab; do curl -s "http://localhost:3000$p" | grep -o '\[Screenshot[^]]*\]\|\[0\.00\]\|\[Year\]\|\[Start year\]\|\[Stack used\|\[Budget range\|\[I reply\|\[Three\.js\|\[Modules' | wc -l; done
```

- [x] `node .claude/skills/taste-skill/scripts/inspect.mjs http://localhost:3000/freelance --widths 1440,390` and the same for `/lab`: no new FAILs. The earlier "no pictures" FAIL on /freelance should now pass.
- [x] Manual check at 1440 and 390, light and dark:
  - [x] star schema: the dashed OrderFulfillment box and the accumulating tag are readable
  - [x] bank row shows the step list
  - [x] freelance: no Fiverr button, "Contact me directly" is the main action, and pictures sit in MyHelper and Africa Travel only
  - [x] lab: no 3D section, and both side projects have pictures and working Code links
  - [x] "Download CV" opens the new CV (top line: "AI Engineer Intern Applicant")
- [x] Add a HANDOFF.md log entry with the results and any image that couldn't be used. Tick "Fill remaining placeholders" in Open tasks. **Stop; don't commit.**
