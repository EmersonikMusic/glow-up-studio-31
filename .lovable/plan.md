

## Plan: Landscape support for tablet & mobile (layout-only)

### Goal
Make the game fully usable when devices are rotated to landscape, without changing portrait behavior or desktop. Tablet landscape inherits the existing desktop layout. Phone landscape gets targeted layout tweaks because vertical space is severely limited (~360–430px tall). Settings drawer on phones — including landscape — must continue sliding up from the bottom.

### Problems observed
1. `useIsMobile` uses `max-width: 768`. In phone landscape, modern devices (iPhone 12+, Pixel) measure 844–956px wide → they incorrectly get the desktop layout (right-side drawer instead of bottom sheet).
2. True narrow phone landscape keeps the mobile layout but the mobile mascot (`clamp(180px, 55vw, 280px)`) and card padding (`pb-[160px]`) consume too much of the ~360px-tall viewport, causing overlap.
3. Header right-side cluster can crowd at narrow landscape widths.

### Approach

**A. Detect "phone-shape" not just narrow width.**
Update `useIsMobile` to treat a viewport as mobile when EITHER:
- `width < 768` (current rule), OR
- landscape AND `height ≤ 500` AND `width ≤ 950` (covers all phones in landscape; tablets in landscape have height ≥ 768 so are excluded).

This routes phone landscape to the bottom-sheet drawer.

**B. Add mobile-landscape layout adjustments via `@media (max-height: 500px) and (orientation: landscape)`.**
- Card column bottom padding: drop from `pb-[160px]` to ~96px in mobile landscape.
- Mobile mascot: switch sizing to `clamp(120px, 28vh, 180px)` (vh-anchored) so it shrinks with short viewports; keep `bottom-6 -right-2` anchor.

**C. Header crowding in mobile landscape.**
- Show the compact mobile username pill (instead of the desktop pill) in mobile landscape.
- Reduce header vertical padding in mobile landscape to reclaim ~20–30px of vertical space.

**D. Tablet landscape.**
Already passes `md:` breakpoint and renders the desktop layout. No changes needed.

### Files touched
- `src/hooks/use-mobile.tsx` — broaden `isMobile` to include phone-landscape detection.
- `src/components/TriviaGame.tsx` — mobile-landscape card padding and mascot sizing only (Tailwind arbitrary `[@media...]:` variants).
- `src/components/GameHeader.tsx` — show compact username pill and reduce vertical padding in mobile landscape.
- `src/index.css` — mobile-landscape media-query rules that can't be expressed as Tailwind variants (header padding override, username-pill visibility toggle).

### Out of scope (layout-only change)
- Any gameplay logic, timer behavior, scoring, answer reveal, or question flow.
- Animations, transitions, hover effects, float/pulse/shake/breathe motion.
- Styling beyond layout (colors, gradients, glassmorphism, typography weights, font families, font sizes outside of what's strictly needed for layout to fit).
- Desktop layout, tablet portrait, phone portrait — all unchanged.
- Settings panel content, drawer width on desktop, About/HowToPlay/Result/Start/Login screens.
- Mascot scale on desktop, mascot float animation, mascot fade-on-settings-open behavior.
- Card width split (70/30), card content, footer pill content.
- Question card font-size clamps, text color, divider styling.
- Adding orientation-lock or "rotate device" prompts.

### Verification (interactive elements visible & operable per screen + orientation)
Confirm for each viewport that header buttons (logo, login/username, About, Settings gear, Fullscreen), question card text, footer countdown pill, and (where applicable) mascot are all on-screen and tappable, and that opening Settings reveals the correct drawer style:

1. **Phone portrait 390×844** — unchanged. Bottom-sheet drawer. All header icons + footer + mascot visible.
2. **Phone landscape 844×390 / 932×430** — bottom-sheet drawer (slides from bottom). Compact username pill. Mascot shrunk, no overlap with card text. Footer pill fully tappable. All header icons fit on one row.
3. **Small Android landscape 736×360** — same as #2; mascot ~120px.
4. **Tablet portrait 768×1024 / 820×1180** — unchanged. Desktop layout, side drawer.
5. **Tablet landscape 1024×768 / 1180×820** — desktop layout, side drawer (right). 70/30 card+mascot split. All controls visible.
6. **Desktop 1280 / 1440 / 1920** — unchanged.
7. Settings open on phone landscape: backdrop visible, sheet scrolls, Apply button reachable.
8. Settings open on tablet landscape: side drawer slides in from right, Apply button visible.

