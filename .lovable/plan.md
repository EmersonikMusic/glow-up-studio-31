
All edits in `src/components/AboutScreen.tsx`.

## 1. Fix sticky nav readability
The current sticky bar uses `rgba(0,0,0,0.55)` + `backdrop-blur-xl`, but the parent card already sets `overflow-hidden` and the scroll area sits above a translucent card — the blur isn't compositing cleanly against the scrolling content, so text bleeds through.

Fix: make the bar visually solid while keeping it on-theme.
- Swap the background to a near-opaque dark: `rgba(10, 10, 14, 0.92)` (matches the card's dark glass tone) and keep `backdrop-blur-xl` as a fallback.
- Add a subtle bottom shadow (`box-shadow: 0 8px 16px -8px rgba(0,0,0,0.5)`) so it reads as a floating bar over content.
- Keep the existing `border-bottom` hairline.

## 2. Correct anchor offset
Sections currently use `scroll-mt-20` (80px), but the sticky bar's real height varies (buttons wrap on narrow widths). Two-part fix:
- Measure the sticky bar with a `ref` + `ResizeObserver`, store `navHeight` in state.
- In `scrollTo`, compute the target's position relative to the scroll container and call `scrollContainerRef.current.scrollTo({ top: targetTop - navHeight - 8, behavior: "smooth" })` instead of `scrollIntoView`. This guarantees the section heading lands just below the bar regardless of wrap.
- Remove the `scroll-mt-*` utility (no longer needed since we manage offset manually).

Also add a `ref` to the scrollable `about-scroll-area` container so scroll math is scoped to it, not `window`.

## 3. Active-section highlight (scroll spy)
- Track `activeSection: "who" | "apart" | "faq" | "philosophy"` in state.
- Use one `IntersectionObserver` on the scroll container with `rootMargin: "-{navHeight + 8}px 0px -60% 0px"` and `threshold: 0` so a section is "active" once its top crosses just below the sticky bar.
- Observe all four section refs; on intersect, set `activeSection` to the entry with the highest intersection ratio (or the last one whose top is above the trigger line).
- Nav button styling when active:
  - `background: hsl(var(--game-gold) / 0.15)`
  - `border-color: hsl(var(--game-gold))`
  - `color: hsl(var(--game-gold))` (unchanged) + `font-black` swap or a subtle `shadow` glow
  - Inactive stays as-is.
- Add `aria-current="location"` on the active button for a11y.

## Technical details
- New state: `navHeight` (number), `activeSection` (string).
- New refs: `scrollAreaRef`, `navRef`.
- Effects:
  - `useEffect` sets up ResizeObserver on `navRef` → updates `navHeight`.
  - `useEffect` sets up IntersectionObserver (root = scrollAreaRef.current, rootMargin depends on navHeight) → updates `activeSection`. Rebuild when `navHeight` changes.
- The nav button array grows a `key: "who" | "apart" | "faq" | "philosophy"` field so active state can be matched.
- No content, ordering, or copy changes. Sign-off, FAQ accordion, philosophy list, sticky nav order all stay identical.

## Out of scope
- Any restyling beyond the sticky bar background/active state.
- Changing which sections exist or their labels.
