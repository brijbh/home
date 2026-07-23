Project: Rebuild `C:\dev\home` into the new Git Home portfolio system

Workspace:
- Local folder: `C:\dev\home`
- Git repo info is available inside the folder.
- This is a plain static site.
- Keep it lightweight: HTML, CSS, vanilla JS, JSON data files.
- Do not add React/Vue/Next/Vite/package.json/build tooling.
- Do not install dependencies.

Approved references:
- Homepage wireframe: `assets/images/git-home-homepage-wireframe-v2.svg`
- Page system wireframes: `assets/images/git-home-page-system-wireframes-v1.svg`
- Existing visual mockups/assets in:
  - `mockup/git-home-homepage-wireframe-v2.svg & git-home-page-system-wireframes-v1.svg`
  - `assets/images/`
  - `assets/icons/`
  - `assets/illustrations/`
  - `v0-layout/assets/images/`

Current folder structure:
- `index.html`
- `admin.html`
- `app-pages/app.html`
- `art-pages/index.html`
- `css/style.css`
- `css/components.css`
- `css/responsive.css`
- `css/admin.css`
- `js/main.js`
- `js/data-loader.js`
- `js/mobile-navigation.js`
- `js/quotes.js`
- `js/admin.js`
- `data/site.json`
- `data/apps.json`
- `data/artwork.json`
- `data/quotes.json`

High-level goal:
Rebuild Git Home as a personal portfolio that positions Brij as a product designer with strong technical understanding, UX/design craft, and AI-assisted implementation ability.

The site should not feel like a generic app directory. It should feel like an editorial product/design profile with working projects and art as evidence.

Core visual direction:
- Warm editorial
- Mobile should feel app-like
- Strong written sections
- Fewer homepage cards
- Larger case-study style project rows on homepage
- Apps page should be card-based masonry/flexible grid
- Screenshots support the story, but are not the main identity
- Terminal-style details are part of the personality
- Keep the design calm, crafted, and readable

Palette:
Use this expanded palette:
- Deep red: `#780000`
- Red: `#C1121F`
- Warm paper: `#FDF0D5`
- Deep ink/navy: `#003049`
- Soft blue: `#669BBC`
- Olive: `#526828`
- Orange: `#CC5500`
- Terminal green: `#0DB729`
- Teal: use a temporary `#005B55` until corrected

Use `#FDF0D5` / warm paper as the primary background direction.
Use `#003049` for terminal/deep ink moments.
Use `#CC5500` as the primary action/accent.
Use red/olive/blue/teal sparingly for identity, project accents, tags, and visual rhythm.

Important content direction:
Hero heading:
`Built from curiosity, shaped by product thinking, and refined through design.`

Hero supporting line:
`I explore ideas by turning them into usable tools, visual systems, and working prototypes, combining UX, design craft, technical understanding, and AI-assisted development.`

## Homepage desired flow:
1. Name / Git Home brand area
2. Terminal-style Vedic shloka line
3. Bold editorial positioning statement
4. Thin divider lines
5. Page links: Apps, Art, About, Notes/Contact
6. Mental model boxes:
   - Concept
   - UX and Design
   - AI-assisted Build
7. Short dotted divider
8. Featured project story rows:
   - Hoodi
   - Ulsoor / Kolam
   - Domlur
9. Artwork preview section
10. Terminal-style footer

## Terminal shloka requirement:
The terminal shloka line must be responsive.
- It should handle longer shlokas.
- Desktop: can sit beside brand if space allows, but must wrap cleanly.
- Tablet/mobile: stack below brand.
- Mobile: allow multi-line terminal block; do not overflow off-screen.
- Data should support Sanskrit, transliteration, translation, and source.

Pages to implement/refine:
1. `index.html`
   - Editorial homepage based on `git-home-homepage-wireframe-v2.svg`

2. `app-pages/app.html`
   - Apps index page and single app detail behavior can stay in one static page if that matches current architecture.
   - Apps index should use a responsive masonry/flexible card grid.
   - Desktop: 2 or 3 columns where comfortable.
   - Tablet: 2 columns.
   - Mobile: 1 column.
   - Cards do not need equal heights. Let each card accommodate its own text.
   - Avoid one long horizontal-card vertical list on desktop.
   - Each app card should include logo/icon, app name, app question/why, short description, status/type/tags, preview image, `Read story`, and `Visit site`.

3. Single app detail view
   - Can be route/hash-based using `app-pages/app.html#app-id` if current architecture supports it.
   - Must feel like a case study.
   - Sections:
     - app logo/name
     - app question
     - why it exists
     - product thinking
     - UX/design decisions
     - screenshots
     - what I learned
     - links: live site, all apps, optional GitHub

4. `art-pages/index.html`
   - Art gallery page
   - Gallery should support cards/masonry.
   - Art cards link to individual art detail view by hash or static detail mechanism.
   - Include previous/next navigation for individual artwork.

5. About page
   - If no separate file exists, create `about.html`.
   - Purpose: professional profile derived from LinkedIn-style positioning.
   - Should read like a thoughtful profile, not a resume dump.
   - Include:
     - product/design/technical positioning
     - career story
     - strengths
     - how Brij works
     - contact/social links

6. `admin.html`
   - Local content studio.
   - Must allow editing all configurable content and theme values.
   - Public site content should come from JSON/config wherever practical.
   
##Mobile design requirements:

The mobile version is very important. It should feel like a polished personal app, not just a squeezed desktop website.

`mockup = C:\dev\home\mockup\mobile-page-system-wireframe.svg`

Overall mobile feel:
- App-like
- Fast
- Clean
- Touch-friendly
- Editorial but compact
- No cramped desktop leftovers
- No tiny links
- No horizontal overflow

Mobile layout rules:
- Use a single-column flow for primary reading pages.
- Use generous but efficient spacing.
- Keep sections clearly separated.
- Avoid large empty vertical gaps.
- Keep headings strong but not oversized.
- Every tap target should be comfortable, ideally at least 44px tall.
- Bottom navigation is allowed and preferred for core sections.
- Avoid traditional desktop-style top nav on mobile.

Mobile homepage:
- Brand and terminal shloka stack vertically.
- Terminal shloka should wrap cleanly inside the screen.
- Hero heading should be readable and impactful, but not occupy the entire first screen.
- Page links should become large app-like navigation rows or compact buttons.
- Mental model boxes should stack vertically.
- Featured project rows should become compact story cards.
- Each featured project should show:
  - question
  - title
  - short paragraph
  - preview image
  - primary link
- Artwork previews can become a horizontal strip or 2-column compact grid.

Mobile Apps page:
- Use a 1-column card layout.
- Cards should feel like app library cards.
- Each card should include:
  - icon/logo
  - app name
  - short question/why
  - concise description
  - preview thumbnail
  - `Read story`
  - `Visit site`
- Avoid overly tall cards.
- Text should wrap naturally.
- Cards do not need equal heights.

Mobile single app page:
- Start with app icon, name, question, and primary action.
- Screenshot should appear in a stable landscape frame.
- Story sections should be readable, with clear headings.
- Avoid placing long text beside screenshots on mobile.
- Use previous/next app links near the bottom.

Mobile art gallery:
- Use either:
  - 2-column compact grid for thumbnails, or
  - 1-column if artwork needs more space.
- Keep image cards simple.
- Tapping an artwork opens the single artwork view.

Mobile single artwork page:
- Artwork should be the focus.
- Image should fit within the viewport width.
- Previous/next controls should be large and easy to tap.
- Include links back to gallery, apps, and home.

Mobile About page:
- Read like a clean profile.
- Avoid dense resume formatting.
- Use short sections:
  - intro
  - what I do
  - how I work
  - experience
  - links/contact

Mobile Admin page:
- Admin should still be usable on mobile, but desktop/tablet can be the primary admin experience.
- On mobile, use stacked sections and large form controls.
- Color pickers, toggles, textareas, and reorder controls must be touch-friendly.
- Admin should not rely on hover-only interactions.

Mobile navigation:
- Prefer a bottom nav with:
  - Home
  - Apps
  - Art
  - About
  - Admin or Menu
- Active state should be clear.
- Keep it lightweight and CSS/vanilla JS only.

Mobile motion:
- Use very subtle motion.
- No large scroll animations.
- No motion that delays reading or tapping.
- Respect `prefers-reduced-motion`.   
   
   
   

## Admin requirements:
The admin page should support editing:
- site title
- hero text
- shloka data
- page links
- mental model boxes
- homepage featured apps/art
- app metadata
- app case-study content
- app links
- app screenshots/icons
- artwork metadata/images/notes
- about page text
- footer content
- social/contact links
- theme colors
- section-level colors
- element-level colors
- motion settings

Admin color control:
Support three levels:
1. Global theme colors
2. Section-level overrides
3. Element-level overrides

Examples:
- App card accent color
- App preview background
- CTA color
- Mental model icon color
- Terminal cursor color
- Footer link color
- Artwork category color

Color fields should be optional. If empty, inherit from global theme.

Admin save behavior:
Because this is a static site, browser JS cannot always write files directly.
Implement:
- File System Access API save-to-folder if supported
- Export/download JSON fallback
- Import/load JSON option
- Clear validation and preview

Data architecture:
Prefer structured JSON:
- `data/site.json`
- `data/home.json` if useful
- `data/apps.json`
- `data/artwork.json`
- `data/about.json` if useful
- `data/quotes.json`

Every reusable item should support:
- `id`
- `visible`
- `featured`
- `order`

Motion / micro animations:
Include subtle micro animations only.
Allowed:
- terminal cursor blink
- terminal line reveal
- link underline slide
- card hover lift
- image hover slight scale
- CTA press state
- section reveal with `IntersectionObserver`
- art previous/next fade
- admin save confirmation pulse

Avoid:
- heavy parallax
- bouncing elements
- constant movement
- JS animation libraries
- distracting scroll effects

Motion must respect `prefers-reduced-motion`.
Add motion config in JSON, for example:
```json
{
  "motion": {
    "enabled": true,
    "terminalTyping": true,
    "sectionReveal": true,
    "cardHover": true,
    "imageHoverZoom": true,
    "duration": "normal"
  }
}
```

Implementation constraints:
- No frameworks.
- No dependency installs.
- No build system.
- Keep HTML/CSS/JS readable.
- Use CSS custom properties for theme.
- Keep JS modular but simple.
- Avoid over-engineering.
- Do not delete useful existing assets.
- Do not modify `v0-layout` unless only copying assets from it into the active site.
- Preserve current files unless a new page/data file is clearly needed.

Use existing assets:
- Hoodi assets exist in `v0-layout/assets/images/` and some in current `assets/`.
- If needed, copy useful assets from `v0-layout/assets/images/` into active `assets/images/` or `assets/icons/`.
- Do not hotlink external images.
- Keep asset paths configurable in JSON.

Verification:
After implementation:
1. Validate JSON files parse.
2. Check JS syntax.
3. Open the local site and verify:
   - homepage
   - apps page
   - single app view
   - art gallery
   - single art view
   - about page
   - admin page
4. Check responsive layout at:
   - desktop
   - tablet
   - mobile
5. Confirm long terminal shloka does not overflow.
6. Confirm apps page is card-based masonry/flexible grid, not a long vertical list.
7. Confirm admin can edit/export config.
8. Confirm reduced motion setting is respected.

Commands you may run without asking me first:
- `git status`
- `git diff`
- `git log --oneline -5`
- `dir`
- `tree`
- `rg --files`
- `rg "text"`
- `Get-Content`
- `Select-String`
- JSON validation with Node or PowerShell
- JS syntax checks with Node
- Start a simple local static server if needed, for example:
  - `python -m http.server 8080`
  - or another available local static server

Do not run without asking me first:
- Any dependency install command
- Any destructive Git command
- Any command that deletes files
- Any command that resets or restores files
- Any command that pushes to remote
- Any command that commits unless I explicitly ask
- Any command that modifies files outside `C:\dev\home`

Expected deliverables:
- Updated homepage
- Updated apps page
- Updated app detail behavior/page
- Updated art gallery and art detail behavior/page
- About page
- Local admin page
- Updated JSON/data architecture
- Updated CSS theme/motion system
- Responsive behavior
- Short final summary:
  1. what changed
  2. where to edit content
  3. where to edit colors/theme
  4. how admin save/export works
  5. what was verified