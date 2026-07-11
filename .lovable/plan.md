Unify the sticky anchor nav with the About screen header so they read as one block, and ensure body copy never shows through the nav when scrolling.

## Change

In `src/components/AboutScreen.tsx`, move the anchor nav out of the scrollable body and place it as part of the header region (a sibling directly below the title block, above the scroll area). This makes it structurally part of the header instead of a sticky overlay inside the scroll container.

## Details

1. Relocate the nav
   - Move the `<div ref={navRef} ...>` block (the anchor button row) out of `<div ref={scrollAreaRef} ...>` and place it between the header block and the scroll area, as a `shrink-0` element in the flex column.
   - Remove `sticky top-0 z-10` — no longer needed since it now sits above the scroll area and never overlaps content.

2. Match the header's visual treatment so the two blend seamlessly
   - Remove the opaque `background: hsl(var(--game-bg))` on the nav.
   - Let the nav inherit the card's glass background (the card already has `rgba(0, 0, 0, 0.25)` + `blur(24px)`), same as the header block above it. No explicit background on the nav wrapper.
   - Keep the bottom border (`1px solid rgba(255, 255, 255, 0.1)`) to separate nav from scroll content, matching the header's bottom border.
   - Drop `backdrop-blur-xl` on the nav (the card already blurs) and drop the drop-shadow, since it no longer floats over scrolling content.

3. Scroll-spy and anchor scrolling
   - Keep `navRef`, `navHeight` measurement, and the existing `scrollTo` offset logic unchanged — anchor targets still need to clear the nav since it sits above the scroll area and reduces the visible top of the scroll viewport.
   - Scroll-spy logic continues to work as-is (it already uses `navHeight` as the trigger offset relative to the scroller top).

4. No other visual, copy, or behavioural changes
   - Active-section teal highlight, inactive button styling, section content, divider, and sign-off all unchanged.

## Result

The header and anchor row share one continuous glass surface (same background, same blur, same border treatment). Because the nav is no longer inside the scroll container, body copy scrolls beneath the scroll-area boundary — nothing can appear behind the nav buttons.
