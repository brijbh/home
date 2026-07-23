Refinement task: improve typography, reduce visual heaviness, and constrain layout width

Context:
The latest Git Home implementation is directionally correct, but the page feels too visually loud. The font sizes are too large, headings are too bold, the layout is too wide, and the overall composition feels harsh on the eyes.

Do not redesign the site from scratch. Keep the current structure, content, palette direction, and editorial concept. This is a visual refinement pass focused on type scale, font pairing, spacing, width, and readability.

Font system:
Use this font pairing:

- H1: `Melodrama` medium or regular
- H2: `Melodrama` regular
- Body text: `Inter` regular
- Links: `Inter` semibold
- Badges/kickers: `Inter` medium, small uppercase
- Footer: `IBM Plex Mono`
- Terminal: `IBM Plex Mono`

Implementation notes for fonts:
- If using external font loading, keep it lightweight.
- Prefer Google Fonts or locally available font files only if already present.
- Do not add a build system.
- Do not use too many weights.
- Recommended weights:
  - Melodrama: regular/medium only
  - Inter: regular, medium, semibold
  - IBM Plex Mono: regular/medium
- Add sensible fallbacks:
  - Display: `Melodrama, Georgia, serif`
  - Body: `Inter, system-ui, sans-serif`
  - Mono: `"IBM Plex Mono", "SFMono-Regular", Consolas, monospace`

Layout width rules:
- The page background can fill the full viewport.
- The actual site layout must not expand endlessly on large monitors.
- Add a centered page shell with max width:
  - `max-width: 1920px`
  - `margin-inline: auto`
- On 4K monitors, the site should remain centered inside this 1920px shell.
- Main content sections should have a narrower content max width:
  - around `1180px` to `1320px`
  - centered with adequate left/right margins
- Hero text should be constrained:
  - max width around `980px` to `1100px`
- Supporting paragraphs should be narrower:
  - max width around `720px` to `860px`
- Do not let text stretch across the full 1920px width.
- Wide decorative/background bands may extend within the 1920px shell, but readable content must stay constrained.

Current problems:
1. Hero heading is too huge and too heavy.
2. Section headings are too large and bold.
3. The page width feels too wide.
4. On large screens, the layout stretches too much.
5. The deep ink text feels visually aggressive at the current size/weight.
6. The mental model card row feels too wide and stretched.
7. The project section heading is too loud.
8. Overall the design needs more restraint, softer hierarchy, and better reading comfort.

Typography changes:
- Reduce hero heading size significantly.
- Desktop hero heading should be strong but not dominating.
- Target desktop hero heading around `clamp(3.2rem, 4.6vw, 5.4rem)`.
- Use `Melodrama` regular/medium, not heavy bold.
- Reduce hero line-height tension slightly; use around `1.04` to `1.1`.
- Section headings should be clearly smaller than the hero.
- Target section headings around `clamp(2rem, 3vw, 3.4rem)`.
- Mental model heading should not feel like a second hero.
- Project story question headings should be smaller and calmer.
- Body text should stay readable, around `1rem` to `1.125rem`.
- Avoid large blocks of bold text.

Hero refinement:
- Reduce vertical height of the top section.
- Reduce top/bottom padding.
- Keep the terminal shloka block, but make it smaller and less visually dominant.
- Brand row should feel subtle.
- Hero heading should likely be 2-3 lines on desktop, not a massive block.
- Supporting line should sit closer to the heading with calm spacing.

Color/contrast refinement:
- Keep `#003049`, but avoid making huge heavy blocks of it.
- Do not switch to black.
- Do not introduce a new palette.
- Orange/red accents should stay small and controlled.

Mental model section:
- Reduce heading size.
- Reduce card height/padding slightly.
- Keep the three columns on desktop.
- Make text and icon sizes more refined.
- The strip should feel like supporting evidence, not a major hero block.

Selected work section:
- Reduce “Projects as questions, not just links.” heading size.
- Make the featured project card less huge.
- Reduce project question heading size.
- Screenshot should remain useful, but the text should not fight it.
- Keep the card refined and readable.

Spacing:
- Reduce excessive vertical gaps between sections.
- Keep enough whitespace, but avoid empty oversized bands.
- Tighten divider/page-link area.
- Make the first viewport feel balanced.

Responsive:
- Check desktop around 1440px and 1920px.
- On 4K screens, confirm content remains centered inside max 1920px shell.
- Check tablet and mobile after changes.
- Mobile should still feel app-like and readable.
- Do not make mobile text tiny.
- No horizontal overflow.

Implementation notes:
- Prefer changing CSS variables and shared layout rules rather than editing every component individually.
- Look for root variables like heading sizes, max widths, section spacing, and content containers.
- Use `clamp()` for responsive type.
- Keep changes mostly in CSS unless HTML changes are truly necessary.
- Do not alter content wording.
- Do not remove sections.

Verification:
After changes, verify:
1. Hero heading is noticeably smaller and calmer.
2. Melodrama is applied only to H1/H2 or display headings.
3. Inter is used for body, links, badges.
4. IBM Plex Mono is used for terminal/footer.
5. Page content no longer stretches too wide on desktop.
6. On 4K, layout is centered with max 1920px shell.
7. Main readable content is constrained to a comfortable width.
8. Section headings are clearly secondary to the hero.
9. Mental model row feels refined, not stretched.
10. Selected work section feels calmer.
11. No mobile regression.
12. No horizontal overflow.

Please err on the side of restraint. This should feel like a calm editorial portfolio, not a poster with oversized display type.