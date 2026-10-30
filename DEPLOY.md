# Launching v2 on Vercel with arunusampath.me

v1 stays live on GitHub Pages until step 6. Nothing here touches `main` until you merge.

## 1. Import the project (5 minutes)

1. Go to vercel.com, sign in with GitHub, **Add New → Project**, pick `Blitz2001/Portfolio`.
2. Framework preset: **Next.js** (detected). Leave build and output settings alone.
3. Before the first deploy, open **Environment Variables** and add what you have from steps 2–4 (you can add them later and redeploy).
4. Deploy. Vercel builds every branch, so `v2-data-science` gets its own preview URL. Use that URL until launch.

## 2. Sanity, for adding projects yourself (10 minutes)

1. Go to sanity.io/manage → **Create project** (free plan). Note the **Project ID**. Dataset: `production`, public.
2. In the project, **API → CORS origins → Add**: your Vercel preview URL, `https://arunusampath.me`, and `http://localhost:3000`, each with **Allow credentials** ticked (the Studio needs it).
3. In Vercel add `NEXT_PUBLIC_SANITY_PROJECT_ID` = your project ID and `NEXT_PUBLIC_SANITY_DATASET` = `production`. Redeploy.
4. Open `/studio` on the site, log in, and add a project. Pick **Shown on** (Hire me, Freelance or Lab), tick **Published**, and it appears within a minute.

Until a page has published Sanity projects it keeps showing the hand-written ones in `lib/content.ts`.
"Now (currently working on)" items work the same way: publish one and they replace the defaults on the home page.

## 3. Analytics (1 minute)

Vercel → your project → **Analytics** → **Enable**. The code is already in place (`@vercel/analytics`).

## 4. Tracking links and /admin (5 minutes)

1. Vercel → your project → **Storage → Create Database → Neon** (free). Connect it to the project; it sets `DATABASE_URL` for you. The table is created on the first visit.
2. Add `ADMIN_PASSWORD` (any long password) in Environment Variables. Redeploy.
3. Send each application its own link, for example `https://arunusampath.me/?ref=ryzera`. Use letters, numbers, `-` or `_`.
4. Open `/admin`, enter any username and that password. You see each link, how many visits, and first/last visit in Sri Lanka time.

## 5. Try it on the preview URL

Check `/`, `/freelance`, `/lab`, `/studio`, `/admin`, and one `?ref=` link before touching the domain.

## 6. Move the domain (15 minutes, then DNS time)

1. Vercel → project → **Settings → Domains** → add `arunusampath.me` and `www.arunusampath.me` (redirect `www` to the bare domain).
2. Vercel shows the DNS records to set. At your domain registrar, replace the four GitHub Pages `A` records (`185.199.108–111.153`) with the `A` record Vercel shows, and point `www` with the `CNAME` Vercel shows. Use exactly the values on that screen.
3. DNS usually switches in minutes, sometimes hours. Vercel issues the HTTPS certificate on its own.
4. In GitHub → repo **Settings → Pages**, set the source to **None** so Pages stops serving the old site.

## 7. Make v2 the main branch

1. Open a pull request from `v2-data-science` into `main`. In the same PR delete `.github/workflows/deploy.yml` (the Pages workflow; it would fail on the Next.js build) and `public/CNAME`.
2. Merge. In Vercel → **Settings → Git**, make sure the production branch is `main`.
3. v1 is safe under the tag `v1-mern-final` (push it from your machine if you haven't: `git push origin v1-mern-final`).

## Environment variables, all in one place

| Name | Where it comes from | Needed for |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | sanity.io/manage | `/studio` and Sanity projects |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | same |
| `DATABASE_URL` | Vercel Storage → Neon | tracking links |
| `ADMIN_PASSWORD` | you choose | `/admin` |
| `GITHUB_TOKEN` (optional) | github.com → Settings → Developer settings → tokens, no scopes | more headroom for "Latest on GitHub" |
