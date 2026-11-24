# arunusampath.me v2

Portfolio for AI and data science internship applications. Next.js (App Router) and Tailwind CSS v4, deployed on Vercel.

- `/`: Hire me (recruiters)
- `/freelance`: clients
- `/lab`: design, 3D experiments and side projects

v1 (the Vite and React site) lives on `main` and is tagged `v1-mern-final`.

## Develop

```bash
npm install
npm run dev
```

Copy lives in `lib/content.ts`; open placeholders are listed in `PLACEHOLDERS.md`.

- **Projects:** Sanity Studio at `/studio` (schema in `sanity/schemaTypes`). Without Sanity env vars the pages use `lib/content.ts`.
- **How DefenseOSINT works:** the scroll story in `components/story/`, with copy in `lib/content.ts` (`story`) and real extractor output in `lib/entity-sample.ts` (raw: `docs/entity-extractor-sample.json`). The pinned picture is the isometric switchboard.
- `node figures/defenseosint/build.mjs` regenerates that switchboard (`components/defenseosint/`) and the still for READMEs and LinkedIn (`figures/defenseosint/out/`).
- **Tracking links:** `/?ref=company` is logged to Postgres; `/admin` lists visits (Basic auth, `ADMIN_PASSWORD`).
- **Launch:** `DEPLOY.md`. Environment variables: `.env.example`.
