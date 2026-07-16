# Settings panel hidden-on-load regression

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
crossing the 768px breakpoint (desktop → mobile), and the positive case
(clicking the gear reveals the sheet within 500ms).
