## Part 1 — Larger mobile "CUSTOMIZE YOUR EXPERIENCE" header

`src/components/SettingsPanel.tsx`

1. **Two lines on mobile**: change the two heading spans from `inline sm:block` to `block` at all breakpoints and drop the trailing-space hack on the first line. Each span keeps its own gradient + `background-clip: text`, so both lines render the full red→yellow ramp.
2. **Mobile font size**: apply `fontSize: clamp(14px, 6.2vw, 24px)` on mobile only — the same formula used by the About screen's "Endless Trivia World!" heading (`src/components/AboutScreen.tsx:232`). Tablet/desktop keep `sm:text-2xl md:text-4xl`.
3. **Vertical space**: the second line adds ~1 line of height, so trim mobile title padding from `pt-5 pb-4` to about `pt-4 pb-3` to keep the block roughly the same total height as today.
4. **Overlap safety**: keep the mobile bottom sheet at `maxHeight: 85dvh` (bottom-anchored, so its top edge stays below the nav header). Lower it only if a short viewport shows the sheet touching the header.

## Part 2 — About page nav chips: "Follow Us" cut off

`src/components/AboutScreen.tsx` — the mobile chip strip uses `-mx-6 px-6` on the scroller. Browsers commonly drop the trailing padding of a horizontal scroll container, so the last chip ("Follow Us") sits flush against / clipped at the scroll end.

Fix:
- Add an explicit trailing spacer inside the strip (a `shrink-0 w-6` element after the last chip) so the end padding is always honoured across Chrome, Safari, and Firefox.
- Keep the existing auto-scroll-active-chip logic, and make it account for the spacer so "Follow Us" scrolls fully into view when active.

## Verification
Playwright screenshots plus assertions on: 360×640, 360×800, 390×844, 393×873, 414×896, 430×932, and a short landscape case (844×390), run across the browser projects configured in `playwright.config.ts` (Chromium / WebKit / Firefox).

Checks:
- Settings sheet top edge stays below the nav header bottom edge with the panel open.
- Heading renders on exactly two lines, each with its own gradient.
- About nav strip scrolled to the end shows the full "Follow Us" chip inside the visible area.
