# Placeholders to fill before launch

Everything below lives in `lib/content.ts` unless noted. Search the site for `[` to find any left over.

## Hire me (`/`)
- **Pipeline**: rewritten from the handover guide and viva companion. Check the Gateway and Collector tech (only "Python" is listed), and whether the Analyst should say gpt-4o-mini (production) or qwen2.5:3b (what you ran locally).
- **Labelled dataset**: your CV says you built an evaluation pipeline with a custom labelled dataset for the Entity Extractor. Neither PDF mentions it, so the site doesn't either. If it exists, send the numbers (precision, recall, F1) and it goes in the Entity Extractor panel.
- **Red-teaming row**: link to the report or harness if you can share it (`redteam.link`). The table uses five of your 16 tests; swap any you'd rather show.
- **Bank marketing table**: model names and every metric (`[0.00]`). Mark the model you actually picked with `picked: true`.
- **H&M fulfilment snapshot columns**: `ordered_date_key`, `shipped_date_key`, `delivered_date_key`, `days_to_deliver` are guesses.
- **Code links**: warehouse and bank marketing `link: "#"`.
- **CV**: `public/resume.pdf` is the file from v1. Replace it with your current CV.

## Freelance (`/freelance`)
- **Fiverr profile URL** (`site.fiverr`).
- **Screenshots**: MyHelper Lanka, Africa Travel & Life, POS. Drop images in `public/freelance/` and swap the `Shot` stand-ins for `next/image`.
- **POS stack** (`[Stack used for the POS]`).
- Check the service and "how to hire me" wording.

## Lab (`/lab`)
- **Three.js experiments**: two titles, one line each, and the live canvases.
- **Side project screenshots and GitHub links**: ProAssignment, Geekspot.
- Logo images are your v1 mockups (first image of each brand, compressed to WebP in `public/lab/`). Morgij's first image is mostly blank; pick a better one if you like.
