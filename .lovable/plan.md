## Goal

Two changes that together guarantee — and prove — that the SettingsPanel never renders visibly on first paint:

1. Make the closed-state transform apply on the very first paint even in adverse conditions (slow stylesheet parse, Safari FOUC window, Vite HMR reload).
2. Add a Playwright test whose failure mode is "the panel's first paint happened visible" — not a sampled approximation.

## 1. CSS load / apply ordering

The closed-state rules currently live at the bottom of `src/index.css` (imported from `main.tsx`). That's usually applied before mount, but three edge cases can leak:

- WebKit briefly composites a frame before the `.settings-sheet-mobile` rule is matched to the newly-inserted element.
- Vite dev inlines CSS via `<style>` injection after the module graph loads — a slow module can push CSS past first paint.
- Any future refactor that moves the panel above `if (!mounted) return null` would silently regress.

Changes:

- **Inline the closed-state rules into `index.html` `<head>` inside a small `<style data-critical="settings-panel">` block.** These are eight lines of CSS with no design tokens — safe to duplicate. Because they're parsed with the document itself, they are guaranteed to be in the CSSOM before React ever runs.
- **Keep the same rules in `src/index.css`** so component styles stay collocated and the design system remains the source of truth.
- **Belt-and-braces inline style in `SettingsPanel.tsx`:** re-apply the closed transform as an inline style *only when `open` is false and `animated` is false*. This means during the two-frame gate the transform is set three ways — critical CSS, main stylesheet, inline style — and the "open" state removes the inline style so the class transition can run. Prevents regression if a future edit removes the class.
- **Verify `main.tsx` imports `./index.css` before `createRoot(...).render(...)`** (it does today) and add an ESLint-style comment marker so it isn't accidentally reordered.

## 2. First-paint Playwright test

New test in `tests/settings-panel-hidden.spec.ts` (append to the existing suite) called **"panel is not visible on first paint"** that runs under `chromium`, `firefox`, and `webkit`.

Detection uses three independent signals, all recorded before React scripts execute via `addInitScript`:

- **MutationObserver on `document.documentElement`, `subtree: true`.** The very first time a node matching `[data-testid="settings-panel-sheet"]` or `[data-testid="settings-panel-desktop"]` is added, capture:
  - `element.getBoundingClientRect()`
  - `getComputedStyle(element).transform`
  - `getComputedStyle(element).opacity`
  - `performance.now()` relative to `navigationStart`
  - Whether any `paint` entry has fired yet (via a pre-registered `PerformanceObserver({ type: 'paint' })`).
- **`PerformanceObserver` for `first-paint` and `first-contentful-paint`.** Record their timestamps.
- **rAF at `t=0`** — capture the same rect on the frame immediately following insertion.

The test asserts, for the very first insertion event:

- `transform` matrix decodes to a Y translation ≥ element `height` (mobile) or X translation ≥ element `width` (desktop). This is the strict "closed" check.
- `rect.top >= innerHeight - 1` (mobile) or `rect.left >= innerWidth - 1` (desktop).
- The insertion timestamp is **before** `first-contentful-paint` OR the transform check passes at FCP time.

On failure the test attaches:

- The captured rect + computed style JSON.
- A `page.screenshot()` taken as soon as `first-contentful-paint` fires (via a `page.exposeFunction` callback the sampler triggers).

This is stronger than the existing rAF-only sampler because it catches the exact frame where the DOM node first exists, regardless of frame rate, and it fails loudly if the transform ever reads as `matrix(1, 0, 0, 1, 0, 0)` (identity) at insertion.

## 3. Housekeeping

- Add a comment in `src/index.css` pointing to the inlined critical block in `index.html` so a future edit updates both.
- Update `docs/testing/settings-panel-hidden.md` with the new "first paint" test and the failure-artifact locations.

## Out of scope

- No changes to open-state visuals or animation timing.
- No changes to `useIsMobile` beyond what already shipped.
- No new dependencies.

## Acceptance

- `npx playwright test tests/settings-panel-hidden.spec.ts` passes on chromium, firefox, webkit — including the new "not visible on first paint" case.
- Manually deleting the critical `<style>` block from `index.html` causes the new test to fail on WebKit (proves it actually guards the ordering issue).
- No visible sheet on real iOS Safari on cold load and hard reload.
