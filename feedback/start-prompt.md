We will need to build the page-the page and the mobile must match 100% to the mockup that you have made.
provide me html, css, js as individual files.
But before you start coding, here are some thoughts..

the directory struct will be

c:\dev\home
	index.html
		- /css / style.css <- i leave that you to decide if you want to use one common css or one for page and one for apps and one for art. I leave that to you.
		- /js / script.js <- i leave that you to decide if you want to use one common js or one for page and one for apps and one for art. I leave that to you.
		- /mockup
		- /app-pages/one html per app
			-- /app-images
		- /art-pages / this will be gallery <- i leave that to you on how you want to organize this.
		-- /art-gallery <- i will be uploading all my artwork here.
		
	

Important - Must match the mockups in the c:\dev\home\mockup folder.

QUESTIONS FOR YOU -- Updating the site
- Can I have an interface to manage my site?
- I will need a way to add apps, its images, text etc etc..for each app, -- HOW DO I DO IT?
- HOW DO I ADD NEW ARTWORK?



# Git Home Redesign — Phase 1

Build the new Git Home homepage in the repository root.

## Repository

Local path:

`C:\dev\home`

The previous site has been archived under:

`v0-layout/`

Do not modify or delete anything inside `v0-layout/`.

The approved visual references are:

- `mockup/desktop-homepage.png`
- `mockup/mobile-ui-screens.png`

These mockups are the authoritative design specification.

The desktop and mobile implementations must match them as closely as practical in HTML, CSS, and vanilla JavaScript.

## Before starting

1. Run `git status`.
2. Confirm the current branch is `feature/git-home-redesign`.
3. Inspect both mockup images carefully.
4. Inspect the old content and assets in `v0-layout/`.
5. Reuse suitable existing project logos, screenshots, links, and descriptions where useful.
6. Do not overwrite or alter the archived layout.

## Technology

Use:

- semantic HTML5
- modern CSS
- vanilla JavaScript
- JSON data files
- no framework
- no build tool
- no package manager
- no external UI library

The site must run through a basic local server such as:

```powershell
python -m http.server 8080
```

## Create this structure

```text
C:\dev\home
│
├── index.html
├── admin.html
│
├── css
│   ├── style.css
│   ├── components.css
│   ├── responsive.css
│   └── admin.css
│
├── js
│   ├── main.js
│   ├── data-loader.js
│   ├── mobile-navigation.js
│   ├── quotes.js
│   └── admin.js
│
├── data
│   ├── site.json
│   ├── apps.json
│   ├── artwork.json
│   └── quotes.json
│
├── assets
│   ├── images
│   ├── icons
│   ├── textures
│   └── illustrations
│
├── app-pages
│   ├── app.html
│   └── app-images
│
└── art-pages
    ├── index.html
    └── art-gallery
        ├── originals
        └── thumbnails
```

For Phase 1, create the full structure, but focus implementation effort on the homepage.

## Main visual direction

The site combines:

- Japanese editorial restraint
- Indian warmth and saturated pigments
- warm ivory paper background
- subtle grain and imperfect texture
- vermilion red
- deep indigo
- charcoal black
- muted gold
- occasional leaf green
- serif editorial typography
- monospace terminal typography

Avoid generic portfolio styling.

Avoid obvious decorative clichés such as excessive mandalas, lotus symbols, torii gates, or ornamental borders.

Use space, asymmetry, brush textures, ink-like compositions, restrained shadows, and occasional bold colour.

## Desktop homepage

Match `mockup/desktop-homepage.png`.

### Header

- Brij wordmark on the left (use this image and brand monogram "C:\dev\home\mockup\bb-icon.svg" and also as favicon. This becomes -> [ monogram ] [brij ]
- navigation:
  - Work
  - Art
  - Notes
  - About
- dark `veda --random` command pill on the right
- spacious horizontal layout

### Hero

Headline:

> Designing clarity.  
> Building with intention.

Use red emphasis on:

- clarity
- intention

Supporting text:

> Product designer. Developer. Technical writer.  
> AI enthusiast. Creator. Always learning.

Include a large Japanese-Indian-inspired abstract composition with:

- vermilion sun
- indigo and black brush strokes
- warm paper texture
- restrained architectural or landscape details

Do not use the mockup image itself as the complete webpage background.

Recreate the composition using available assets, CSS layers, gradients, SVG shapes, or extracted design elements.

### Terminal quote card

Use a dark terminal panel containing:

`brij@home:~$ insight --random`

Display a verified Vedic or Bhagavad Gita quote from `data/quotes.json`.

Initial example:

> योगः कर्मसु कौशलम्  
> Yoga is skill in action.  
> — BG 2.50

- Show a new quote to users on every visit


### Selected work

Display four project cards on desktop.

Initial projects:

- Hoodi
- Gavipuram
- Kolampodu
- Hopefarm

Each card should include:

- artwork or project image
- project icon
- title
- short description
- tags
- arrow button

Use content from `data/apps.json`.

Reuse appropriate assets from `v0-layout/assets/images/` where possible, but copy required files into the new `assets` or `app-pages/app-images` folders.

Do not reference archived files directly in final production paths.

### About section

Include:

`WHO AM I?`

Main statement:

> I help complex ideas become simple, useful and human.

Supporting copy should describe Brij as someone with deep technical communication experience who now designs and builds digital products around thoughtful interfaces, documentation, AI, and local-first tools.

Include:

- ink-circle visual
- restrained vase or botanical visual
- “More about me” link

### Sketchbook preview

Show artwork as an editorial gallery strip.

Use temporary representative artwork where needed.

The layout should include:

- temple or architectural sketch
- indigo/vermilion abstract
- bird drawing
- monochrome ink abstract
- bold colourful abstract

Include:

`Explore all art →`

### Terminal footer

Build the dark CLI-inspired footer shown in the mockup. Split the footer into two halves

Right Half Include:

`brij@home:~$ explore`
Show a random text from vedic texts.

Left Half Include

Status information:

```text
status: building thoughtful things
location: bengaluru, india
currently: exploring AI, product design and local-first tools
```

Include one verified Sanskrit quote with source.

Add GitHub, LinkedIn, and email icons. This can also be managed via the admin interface.

Include:

```text
© 2026 Brij
made with chai and vim
```

Use accessible text labels for icons.

## Mobile experience

Match the interaction model in `mockup/mobile-ui-screens.png`.

The mobile site must feel like a mobile app, not merely a compressed desktop page.

### Mobile home

The first viewport should include:

- compact Brij header
- hamburger icon
- hero statement
- abstract red-sun artwork
- terminal quote card
- clear affordance to continue downward

### Navigation drawer

The hamburger button must open an app-like drawer or full-height overlay.

Include:

- Work
- Art
- Notes
- About
- Contact
- `veda --random`
- currently exploring text

Include icons beside menu items.

The drawer must:

- trap focus while open
- close with Escape
- close using the visible close button
- restore focus to the menu button
- prevent body scrolling while open

### Mobile work section

Use a one-card-at-a-time horizontal project carousel.

Requirements:

- first card almost fills the viewport width
- part of the next card remains visible
- swipe and horizontal scroll support
- pagination dots
- keyboard accessible
- current slide indicator where appropriate

### Mobile bottom navigation

On mobile internal views, use an app-style bottom navigation:

- Home
- Work
- Art
- Notes
- About

Do not show bottom navigation on desktop.

### Mobile art gallery

For Phase 1, create the preview layout and basic gallery page shell.

The mobile gallery should use a two-column grid with varied tile heights.

### Mobile quote expansion

The Vedic quote card should open an expanded terminal-style overlay or page.

Include:

- Sanskrit
- translation
- source
- short explanation
- command to show another quote
- close button

### Footer on mobile

Keep the CLI footer, but stack its content vertically.

Touch targets must be at least approximately 44px.

## Data-driven content

Create JSON files and render content from them.

### `data/apps.json`

Include at least:

- Ejipura
- Gavipuram
- Kolampodu
- Hopefarm

Suggested fields:

```json
{
  "id": "",
  "name": "",
  "tagline": "",
  "shortDescription": "",
  "status": "",
  "featured": true,
  "order": 1,
  "categories": [],
  "coverImage": "",
  "icon": "",
  "websiteUrl": "",
  "githubUrl": "",
  "whyItExists": [],
  "designPrinciples": [],
  "features": [],
  "screenshots": []
}
```

### `data/artwork.json`

Include representative temporary gallery entries.

Suggested fields:

```json
{
  "id": "",
  "title": "",
  "year": 2026,
  "medium": "",
  "featured": true,
  "order": 1,
  "thumbnail": "",
  "image": "",
  "alt": "",
  "description": "",
  "tags": []
}
```

### `data/quotes.json`

Every quote must include:

```json
{
  "id": "",
  "sanskrit": "",
  "transliteration": "",
  "translation": "",
  "source": "",
  "reference": "",
  "explanation": ""
}
```

Use only quotes whose wording and source can be confidently verified.

### `data/site.json`

Include:

- name
- headline
- introduction
- about statement
- current interests
- location
- email
- GitHub URL
- LinkedIn URL

## Responsive behaviour

Use deliberate breakpoints rather than relying on accidental wrapping.

Suggested ranges:

- desktop: 1200px and above
- tablet: 768px to 1199px
- mobile: below 768px

Ensure the site works well around:

- 1440px desktop
- 1280px laptop
- 1024px tablet
- 768px tablet portrait
- 430px phone
- 390px phone
- 360px phone

## Accessibility

Implement:

- semantic landmarks
- visible keyboard focus
- accessible navigation labels
- proper button elements
- meaningful image alt text
- reduced-motion support
- sufficient text contrast
- screen-reader text for icon-only controls
- no inaccessible click-only divs

## Performance

- use optimised image sizes
- lazy-load below-the-fold images
- avoid oversized image files
- avoid large JavaScript dependencies
- avoid layout shifts
- use CSS for effects where practical

## Admin interface

Create a basic first version of `admin.html`.

It does not need to be visually complete in Phase 1.

It should allow:

- loading current JSON data
- adding or editing app metadata
- adding or editing artwork metadata
- adding or editing quotes
- exporting updated JSON files

Use localStorage as temporary working storage.

Do not attempt to silently write files to disk.

Include clear export buttons for:

- `apps.json`
- `artwork.json`
- `quotes.json`
- `site.json`

## Important design constraints

- Do not create a generic SaaS landing page.
- Do not use large gradient blobs.
- Do not use glassmorphism everywhere.
- Do not use excessive animation.
- Do not replace the design with Bootstrap-like cards.
- Do not make the mobile version just a narrow desktop page.
- Do not embed the entire mockup screenshot as the page.
- Do not modify `v0-layout/`.
- Do not commit automatically.

## Validation

After implementation:

1. Start a local server.
2. Open the site in a browser.
3. Check the console for errors.
4. Test desktop and mobile widths.
5. Test keyboard navigation.
6. Test the menu drawer.
7. Test quote randomisation.
8. Test project carousel.
9. Test JSON loading.
10. Test admin JSON export.

Run any available HTML, CSS, or JavaScript checks.

## Final response

When complete, report:

- all files created
- all files modified
- assets copied from `v0-layout`
- known visual differences from the mockups
- features completed
- features deferred
- how to run the site locally
- recommended next phase