---
app: home
status: published
updated: 2026-07-31
repo: https://github.com/brijbh/home
---

## Summary
"Git Home" is Brijesh Bhaskaran's personal product-design portfolio: a static HTML/CSS/vanilla-JS site (home, apps/case-studies, art gallery, about) driven by local JSON content files, with a local-only visual admin for editing that content.

## Recent progress
- Rebuilt the site with a shared visual system (header/wordmark, footer, mobile nav, warm background palette) across home, app-pages, art-pages, and about.
- Built a local-only visual content admin (`admin.html`) with form-based editing of the JSON data, File System Access API writes back into the project folder, and JSON export/download as a fallback; stripped from the public repo and deploy via `.gitignore` / `.vercelignore`.
- Added `publish-site.ps1`, which validates the JSON, confirms `main` is up to date with `origin`, and pushes — GitHub Pages and Vercel both rebuild from `main`.
- Latest commits: updated the "Brijesh was here" logo/Netskope footer text, restored the sticky About menu, and added daily verses plus a watermark feature.

## Next up
- Decide whether GitHub Pages or Vercel should be the single canonical production site (both currently rebuild from `main`).
- Add image selection/copy-in to the admin instead of manually typed asset paths.
- Add a pre-publish link checker and a post-push deployment-status check to `publish-site.ps1`.

## Blockers
None currently.
