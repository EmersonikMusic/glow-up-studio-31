# Panels: real slide-in, stable mobile height, aligned under the header

## What's wrong today

1. **Desktop/tablet drawers fade, they don't slide.** The shared CSS only animates opacity/visibility for `.settings-sheet-desktop` — there is no horizontal transform, so both the Settings and Profile drawers just fade in from their final position.
2. **Mobile profile panel drops lower every time.** Drag-to-dismiss writes an inline `transform: translateY(Npx)` on the sheet. When the drag passes the dismiss threshold the panel closes but that inline transform is never cleared, so it stays on the element and stacks on top of the CSS transform the next time it opens — each dismissal leaves it sitting lower.
3. **No relationship to the header.** The mobile sheets use a fixed `85vh` height anchored to the bottom, so where the top edge lands depends on the viewport, not on the header. On some sizes it overlaps or leaves a gap.

## The fix

**Slide-in on desktop/tablet**
- Closed state for `.settings-sheet-desktop`: `translateX(100%)` (off-screen right). Open state: `translateX(0)` with the same ease-out curve already used for the mobile sheet, paired with the existing opacity so it slides and settles.

**Slide-in on mobile** (already `translateY(100%)` → `0`) stays, but is no longer defeated by leftover inline transforms.

**Stop the drift**
- In both `SettingsPanel` and `ProfilePanel`, clear the inline `transform` when a drag ends in a dismiss (and whenever the panel transitions to closed), so the element always returns to the CSS-controlled position.

**Anchor the mobile sheets under the header**
- Measure the app header height once and publish it as a CSS variable (`--app-header-h`) on the document root, kept up to date on resize/orientation change.
- Mobile sheets switch from a fixed `85vh` height to `top: var(--app-header-h, 64px); bottom: 0; height: auto`, so the top of the panel always sits flush under the nav bar, identical whether opened from the gear icon, the "Customize Game" CTA, or the profile avatar.
- A sensible literal fallback stays in the critical inline CSS so nothing jumps before the measurement lands.

## Verification

- Playwright at several mobile sizes (360x640, 390x844, 414x896, 393x852) plus landscape: assert the sheet's top edge equals the header's bottom edge, and that opening → drag-dismiss → reopening produces the identical top edge three times in a row.
- Frame sampling to prove motion: mobile sheet `top` decreases over the open animation; desktop drawer `left` decreases (slides in from the right) rather than only its opacity changing.
- Re-run the existing `tests/settings-panel-hidden.spec.ts` first-paint tests so there's no load flash regression.

## Technical notes

- Files: `src/index.css` (panel visibility/transform block), `index.html` (the duplicated `<style data-critical="settings-panel">` block must stay byte-for-byte in sync), `src/components/SettingsPanel.tsx` and `src/components/ProfilePanel.tsx` (clear inline transform on close, drop the inline `maxHeight`), a small header-measurement hook, `tests/settings-panel-hidden.spec.ts`.
- Drag handling keeps disabling the transition while dragging and re-enabling it on release.
- Desktop panel width, styling and content are unchanged.
