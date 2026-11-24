# Open items before launch

Everything below lives in `lib/content.ts` unless noted. Search `/`, `/freelance`, and `/lab` for `[` to confirm nothing else is left open.

## Pending from owner

- **Fiverr profile URL** (`site.fiverr` in `lib/content.ts`): set from `"#"` to your public profile URL; the Fiverr hero action, direct-contact link, and footer link reappear automatically.
- **WhatsApp number** (`site.whatsapp` in `lib/content.ts`): left empty (hidden); set in international format without `+` only if you want your number public.
- **Bank marketing metrics** (`bank` in `lib/content.ts`): send precision, recall, F1, and ROC AUC per model (and which model was picked) if you want the comparison table back instead of the pipeline step list.
- **Budget ranges and reply time** (`freelance.direct.budgets` and `freelance.direct.reply`): confirm `"I reply within one working day."` and `"Under $300"` .. `"Over $3,000"` suit your pricing.
- **Missing screenshots**:
  - **Custom POS with inventory** (`public/freelance/pos.png`): no screenshot found on disk; row currently renders text-only.
  - **Africa Travel & Life** (`public/freelance/africa-travel.jpg`): `https://africa-travel-demo.vercel.app` currently returns Vercel `503: DEPLOYMENT_PAUSED`, so the screenshot was skipped. Resume the deployment (or supply an image) and re-run `node scripts/shoot.mjs`.
- **Public repo / report links** (`redteam.link`, `warehouse.link` in `lib/content.ts`): currently `"#"` (hides the `"Code"` link); replace if either repo or report becomes public.
- **Three.js experiments** (`lab.experiments` in `lib/content.ts`): currently `[]` (the section stays hidden until items are added).
- **Achievements** (`achievements` in `lib/content.ts`): hidden while empty (add the DataCamp Data Engineer certification once completed).
- **Optional ongoing updates**:
  - Morgij logo mockup (`public/lab/morgij.webp`): replace if you prefer another crop/mockup.
  - `"Currently working on"` (`now` in `lib/content.ts`, or `/studio`): swap the `"Looking for"` card once an internship offer lands, and update `now.updated` monthly.
  - **Next.js security upgrade**: decide whether to upgrade from `16.4.3`.

## Before launch

- Push the v1 tag from your machine: `git push origin v1-mern-final`.
- Walk through `DEPLOY.md` for Vercel environment variables, Sanity Studio, and Postgres tracking links.
