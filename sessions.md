# 2026-07-24 02:44:23 +05:30

## What was planned

- Rebuild the portfolio from `new-design.md` using plain HTML, CSS, and vanilla JavaScript.
- Treat the SVG mockups as visual direction rather than exact pixel specifications.
- Preserve the intended structure, hierarchy, spacing, palette, and mobile behaviour.
- Keep typography and scaling comfortable at 1920×1080, cap the design around 2K, and avoid oversized type on larger displays.
- Use `mockup/bb-icon.svg` with “Brijesh Bhaskaran” as the site wordmark.
- Make the homepage and inner pages visually consistent.
- Use one shared footer across every public page, fixed to the bottom on desktop and static on mobile.
- Build a visual, form-based local content editor over the JSON data files.
- Establish a reliable Git and deployment workflow.

## What was completed

### Public website

- Rebuilt the homepage and inner pages with a common visual system.
- Added consistent warm backgrounds, typography, page widths, spacing, header, wordmark, mobile navigation, and footer behaviour.
- Added public pages for:
  - Homepage
  - Apps and app case studies
  - Art gallery and artwork details
  - About
- Added responsive behaviour for desktop and mobile.
- Limited large-screen scaling so 3K and 4K monitors do not continue enlarging the design.
- Added JSON-driven rendering for site settings, apps, artwork, about content, and quotes.
- Corrected section spacing and the desktop footer’s bottom gap based on feedback screenshots.
- Made footer labels `--work`, `--art`, and `--about` into working links.

### Local visual admin

- Built a visual editor with sections for:
  - Site
  - Homepage
  - Apps
  - Art
  - About
  - Theme
  - Motion
  - Export
- Added text inputs, textareas, toggles, visibility and featured controls, link fields, colour controls, image path fields, previews, add/remove controls, and reordering.
- Added an “Update changes” action for saving modifications.
- Added File System Access API support for writing updated JSON into the selected local project folder.
- Added JSON download/export as a fallback.
- Kept raw JSON as an advanced option rather than the primary editing interface.

### Admin privacy

- Removed every Admin link from the public website.
- Removed `admin.html`, `js/admin.js`, and `css/admin.css` from Git tracking.
- Added those files to `.gitignore`.
- Added them to `.vercelignore`.
- Confirmed both public GitHub Pages URLs return 404:
  - `/home/admin`
  - `/home/admin.html`
- The admin files remain available locally at:
  - `http://127.0.0.1:8080/admin.html`

Visitors cannot use the local editor to modify GitHub or the deployed website. The editor writes only to a folder explicitly selected on the visitor’s own computer.

### Publishing and deployment

- Merged the redesign into `main`.
- Pushed the completed work to GitHub.
- Confirmed the repository is connected to Vercel with `main` as the production branch.
- Added `publish-site.ps1` for Windows publishing.
- The script:
  - Validates all JSON files.
  - Confirms the current branch is `main`.
  - Fetches and checks `origin/main`.
  - Shows all changes before staging.
  - Accepts `yes` in any capitalization.
  - Commits and pushes changes.
  - Relies on the GitHub integration to trigger deployment.
  - Can optionally run `vercel --prod` with `-DirectVercelDeploy`.
- GitHub Pages also rebuilds from changes pushed to `main`.

### URL correction

- Updated the Ulsoor live URL to `https://ulsoor.vercel.app`.
- Added external-link normalization so a domain entered without a protocol automatically receives `https://`.
- Updated JSON loading to revalidate content and reduce stale browser-cache issues after publishing.

## Current content-update workflow

1. Start the local web server.
2. Open `http://127.0.0.1:8080/admin.html`.
3. Make content additions or updates.
4. Click “Update changes”.
5. Select `C:\dev\home` when the browser asks for the project folder.
6. Refresh and review the local public pages.
7. From PowerShell in `C:\dev\home`, run:

   ```powershell
   .\publish-site.ps1 -Message "Describe the content update"
   ```

8. Review the listed files and enter `yes` at the confirmation prompt.
9. Wait for GitHub Pages and Vercel to rebuild.
10. Refresh the live page after deployment completes.

The direct Vercel CLI option is normally unnecessary because pushing `main` already triggers Vercel:

```powershell
.\publish-site.ps1 -Message "Describe the update" -DirectVercelDeploy
```

## Pending checks

- Confirm the latest deployment displays the Ulsoor “Visit site” link as `https://ulsoor.vercel.app`.
- Continue reviewing all live links after future content changes.
- Confirm each newly added image path exists in the repository before publishing.
- Decide whether both GitHub Pages and Vercel should remain active, or whether one should become the single canonical production site.
- The local-only admin files are intentionally absent from Git. Consider keeping a secure private backup so the editor can be recovered if this computer or folder is lost.

## Possible future additions

- Add image selection/copying to the admin so images can be placed into the correct asset folder instead of entering paths manually.
- Add stronger URL validation and an external-link preview inside the admin form.
- Add a pre-publish link checker to `publish-site.ps1`.
- Add a deployment-status check after pushing.
- Add automatic local-server startup through a second PowerShell script.
- Add content validation for duplicate IDs, missing required fields, broken image paths, and invalid colours.
- Add a private backup strategy for local-only admin files.
- Add custom 404 and social-sharing metadata if needed.

## Final repository state for this session

- Active branch: `main`
- Latest pushed functional fix: `32ae275` — `Normalize external app URLs and refresh content data`
- Public admin page: removed
- Local admin page: retained
- Local JSON publishing script: available as `publish-site.ps1`
