# Placeholders to fill before launch

Everything below lives in `lib/content.ts` unless noted. Search the site for `[` to find any left over.

## Hire me (`/`)
- **Pipeline**: rewritten from the handover guide and viva companion. Check the Gateway and Collector tech (only "Python" is listed), and whether the Analyst should say gpt-4o-mini (production) or qwen2.5:3b (what you ran locally).
- **Labelled dataset**: your CV says you built an evaluation pipeline with a custom labelled dataset for the Entity Extractor. Neither PDF mentions it, so the site doesn't either. If it exists, send the numbers (precision, recall, F1) and it goes in the Entity Extractor panel.
- **Red-teaming row**: link to the report or harness if you can share it (`redteam.link`). The table uses five of your 16 tests; swap any you'd rather show.
- **Bank marketing table**: model names and every metric (`[0.00]`). Mark the model you actually picked with `picked: true`.
- **H&M fulfilment snapshot columns**: `ordered_date_key`, `shipped_date_key`, `delivered_date_key`, `days_to_deliver` are guesses.
- **Code links**: warehouse, bank marketing and red-teaming `link: "#"`. Links left as `#` are hidden, so nothing breaks; fill them to show a "Code" link.
- **CV**: `public/resume.pdf` is the file from v1. Replace it with your current CV.

- **Analyst model in the figure panel**: says gpt-4o-mini (production); your tests used qwen2.5:3b.

Projects you add in `/studio` (section "Hire me") appear after these rows.

- **Currently working on** (`now` in `lib/content.ts`, or add "Now" items in `/studio`; published ones replace the defaults): what you are building, learning, and when you are free for an internship; the "Updated [Month 2026]" line.
- **Path so far** (`timeline`): the years for DefenseOSINT, freelancing and your SLIIT start; add modules or projects you want named.
- **Achievements** (`achievements`): certificates, awards, hackathons. Hidden until you add one.
- **Latest on GitHub** fills itself from your public repos once deployed (it cannot reach your profile from the build sandbox). Archived and forked repos are left out; give repos a description on GitHub so the list reads well.

## Freelance (`/freelance`)
- **Fiverr profile URL** (`site.fiverr`).
- **Direct contact** (`freelance.direct`): your reply-time promise, the three budget ranges (in the currency you quote in), and `site.whatsapp` if you want a WhatsApp link (empty hides it).
- **Screenshots**: MyHelper Lanka, Africa Travel & Life, POS. Easiest: add each as a project in `/studio` (section "Freelance") with its screenshot; once any exist they replace the hand-written list. This is also the one check the design gate still fails on this page (no pictures).
- **POS stack** (`[Stack used for the POS]`).
- Check the service and "how to hire me" wording.

## Lab (`/lab`)
- **Three.js experiments**: two titles, one line each, and the live canvases.
- **Side project screenshots and GitHub links**: ProAssignment, Geekspot.
- Logo images are your v1 mockups (first image of each brand, compressed to WebP in `public/lab/`). Morgij's first image is mostly blank; pick a better one if you like.

## Before launch
- Push the tag from your machine: `git push origin v1-mern-final` (the cloud session was not allowed to push tags).
- Fiverr link, CV and LinkedIn as above; then follow `DEPLOY.md`.
