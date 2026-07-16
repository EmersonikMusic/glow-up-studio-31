# Settings panel hidden-on-load regression

Runs on every PR via `.github/workflows/settings-panel-hidden.yml` against
Chromium and WebKit. Firefox is exercised locally but not gated in CI.

`tests/settings-panel-hidden.spec.ts` verifies the `SettingsPanel` bottom sheet
(and desktop side drawer) never appear on-screen between initial paint and the
moment the user taps the settings gear. It runs on all three browser engines so
we catch paint-gap flashes across Safari, Chrome, and Firefox.

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

## How the panels stay hidden

Both `SettingsPanel` and `ProfilePanel` mount in their **final open position**
in the layout. They never slide in from off-screen. Instead the closed state is
purely a visibility gate defined in CSS:

```css
.settings-sheet-mobile,
.settings-sheet-desktop {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity .18s ease-out, visibility 0s linear .18s;
}
.settings-sheet-mobile[data-open="true"],
.settings-sheet-desktop[data-open="true"] {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transition: opacity .22s ease-out .08s, visibility 0s linear 0s;
}
```

Two properties on top of `opacity:0` are important:

- `visibility: hidden` — makes the element unhittable and prevents any
  compositor pass from showing a partially-composited frame.
- The **80ms `transition-delay`** on `opacity` when opening means the panel
  stays fully invisible for a beat after `data-open` flips, so a stray click
  or hover can't cause a flicker before the user has clearly interacted.

The same rules are **inlined in `index.html`** as
`<style data-critical="settings-panel">`. This guarantees the CSSOM has the
closed state before React (or the main stylesheet) has loaded, so the first
paint is guaranteed invisible. If you edit one block, edit both.

## First-paint check

The Playwright spec installs a `MutationObserver` on `document.documentElement`
plus a 16ms polling fallback. The instant a `[data-testid="settings-panel-sheet"]`,
`[data-testid="settings-panel-desktop"]`, `profile-panel-sheet`, or
`profile-panel-desktop` element enters the DOM, the sampler records its
`getBoundingClientRect`, computed `opacity`, `visibility`, `display`,
and the timestamps of `first-paint` / `first-contentful-paint`.

The assertion fails if the very first appearance of the panel has:

- `opacity > 0.01`, OR
- `visibility !== "hidden"`, OR
- `data-open !== "false"`

On failure the recorded state JSON and a `first-paint.png` screenshot are
attached to the Playwright report under the browser's screenshot folder.

## Frame-sampler check

A raf-sampler additionally records `getBoundingClientRect` + computed
`opacity`/`visibility` on every animation frame for the first 1500ms. A
frame is a violation when the sheet is in the DOM, has non-zero height and
opacity, is not `visibility: hidden`, and any part of it overlaps the viewport.

The spec covers cold load, reload, orientation flip (390×844 → 844×390),
crossing the 768px breakpoint (desktop → mobile), the positive case
(clicking the gear reveals the sheet within 500ms), and the strict
"not visible on first paint" check.
