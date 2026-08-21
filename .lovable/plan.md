# Settings sheet: consistent height + slide-in on mobile

## Problem

On mobile the settings bottom sheet has no fixed height — it only hugs its content up to a `max-height`, and that max-height is set inline as `85dvh`. On browsers that don't support `dvh` (older Android WebView / older Safari) the inline value is dropped and the sheet falls back to a different limit, so it can open shorter than expected — the "only opens half way" behaviour. The height also depends on which trigger opened it, because the panel's content differs slightly between the start screen and an in-progress game.

Separately, the closed state today is a pure opacity fade (`opacity: 0` + `visibility: hidden`), so the sheet fades in instead of sliding up.

## Fix

1. Give the mobile sheet a deterministic height instead of content-driven height:
   - a single `height` rule in CSS with a layered fallback chain (`vh` → `svh` → `dvh`) so every engine gets a valid value
   - remove the inline `maxHeight: "85dvh"` from the component so no inline value can override or fail silently
   - identical height whether the panel is opened from the gear icon or the "Customize Game" CTA
2. Restore a slide-up entrance: closed state is `translateY(100%)`, open state is `translateY(0)` with an ease-out curve, paired with the existing opacity so it slides and settles.
3. Keep the first-paint guarantee: the sheet stays `visibility: hidden` with transitions suppressed until the app has mounted, so it never flashes or slides on page load, rotation, or breakpoint crossing.
4. Keep the drag-to-dismiss handle working — the drag sets an inline transform, so the slide transition is disabled while dragging and re-enabled on release.

## Verification

- Extend `tests/settings-panel-hidden.spec.ts` (already runs Chromium, Firefox, WebKit/iPhone 13) with:
  - opening from the gear icon and from the "Customize Game" CTA, asserting both produce the same sheet height (within 1px) and that the height is ~85% of the viewport
  - the same height assertion at several mobile sizes (360x640, 390x844, 414x896, 393x852) and in landscape
  - a frame sampler check that the sheet's `top` decreases over the open animation (proving it slides rather than fades)
- Re-run the existing hidden-on-first-paint tests to confirm no load flash regression.
- Manual pass in the preview at mobile viewport.

## Technical notes

- Files: `src/index.css` (sheet visibility/height block), `index.html` (the duplicated `<style data-critical="settings-panel">` block must stay in sync), `src/components/SettingsPanel.tsx` (drop inline max-height, add a "mounted" flag that gates the transition), `tests/settings-panel-hidden.spec.ts`.
- Desktop side drawer behaviour is unchanged.
