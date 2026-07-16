# Settings panel hidden-on-load regression

Runs on every PR via `.github/workflows/settings-panel-hidden.yml` against
Chromium and WebKit. Firefox is exercised locally but not gated in CI
(the user only requires Chromium + WebKit on PRs).

`tests/settings-panel-hidden.spec.ts` verifies the `SettingsPanel` bottom sheet
(and desktop side drawer) never appear on-screen between initial paint and the
moment the user taps the settings gear. It runs on all three browser engines so
we catch paint-gap flashes that only reproduce on iOS Safari (WebKit).

## Run

```bash
# All engines
npx playwright test tests/settings-panel-hidden.spec.ts

# Just iOS Safari surrogate
npx playwright test tests/settings-panel-hidden.spec.ts --project=webkit

# Just Chromium / Firefox
npx playwright test tests/settings-panel-hidden.spec.ts --project=chromium
npx playwright test tests/settings-panel-hidden.spec.ts --project=firefox
```

Screenshots land in `tests/__screenshots__/settings-hidden/<browser>/`.

## How it works

An `addInitScript` sampler is registered before app scripts run. It records the
sheet's `getBoundingClientRect` + computed `opacity`/`visibility` on every
animation frame for the first 1500ms after navigation. A frame is a violation
when the sheet is in the DOM, has non-zero height and opacity, is not
`visibility: hidden`, and any part of it overlaps the viewport.

The spec covers cold load, reload, orientation flip (390×844 → 844×390),
crossing the 768px breakpoint (desktop → mobile), the positive case
(clicking the gear reveals the sheet within 500ms), and a strict
**"not visible on first paint"** check.

## First-paint check

A second init script installs a `MutationObserver` on `document.documentElement`
plus a 16ms polling fallback. The instant a `[data-testid="settings-panel-sheet"]`
or `[data-testid="settings-panel-desktop"]` element enters the DOM, the sampler
records its `getBoundingClientRect`, computed `transform` matrix, opacity,
visibility, and the timestamps of `first-paint` / `first-contentful-paint`.

The assertion fails if the very first appearance of the panel has:

- a translate offset smaller than its own height/width (i.e. not fully off-screen), AND
- non-zero opacity AND `visibility !== hidden` AND `display !== none`.

On failure the recorded state JSON and a `first-paint.png` screenshot are
attached to the Playwright report under the browser's screenshot folder.

## Guarding the CSS ordering

The closed-state rules for `.settings-sheet-mobile` / `.settings-sheet-desktop`
are both inlined in `index.html` (as `<style data-critical="settings-panel">`)
and defined in `src/index.css`. This guarantees the CSSOM has the closed
transform before React ever renders. If you edit one, edit the other.

