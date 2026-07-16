## Goal

Prove — with browser-engine-accurate screenshots — that the SettingsPanel bottom sheet never appears on-screen until the user opens it, on iOS Safari (WebKit), Chromium, and Firefox. Then fix the root cause so the regression actually passes on all three engines.

The current `/tmp/browser/settings-hidden/test.py` runs Chromium only and polls via `evaluate`, which can miss a paint-gap flash that only WebKit's compositor exhibits. The user still sees the sheet slide down and fade on all three browsers, so both the harness and the component need work.

## 1. Add a proper Playwright spec at `tests/settings-panel-hidden.spec.ts`

- Run under the existing `tests/` Playwright project so it's part of `npx playwright test`, not an ad-hoc `/tmp` script.
- Configure three projects in `playwright.config.ts` overrides: `webkit` (iOS Safari surrogate), `chromium`, `firefox`. Use `devices['iPhone 13']` for WebKit and matching 390×844 viewports for Chromium/Firefox so all three run the mobile branch of `useIsMobile`.
- Per browser, cover four scenarios:
  1. Cold load of `/` — sheet must never intersect the viewport before the user clicks the gear.
  2. Reload after settings were previously opened (localStorage state carried over).
  3. Orientation flip via `page.setViewportSize` from 390×844 → 844×390 → back.
  4. Crossing the 768px breakpoint (desktop → mobile) to force the `useLayoutEffect` reset path.
- Detection strategy — belt and braces, because the flash is a paint issue:
  - Install a `MutationObserver` + `requestAnimationFrame` sampler via `addInitScript` that records, on every frame from `navigationStart` until 1500ms, the `getBoundingClientRect` of `[data-testid="settings-sheet"]` and `[data-testid="settings-drawer"]`. The array is read out with `page.evaluate` after settling.
  - A frame counts as a violation when the element is in the DOM AND its `bottom > 0` AND its `top < innerHeight - 1` AND computed `visibility !== hidden` AND `opacity > 0.01`.
  - In addition, capture `page.screenshot` at 0, 16, 32, 64, 120, 250ms via `setTimeout`-scheduled shots into `tests/__screenshots__/settings-hidden/<browser>/frame-Nms.png` so a human can eyeball the flash.
  - Assert the violations array is empty; on failure, attach the frame log + screenshots to the Playwright report.
- Add a fifth "opens correctly" scenario per browser: click the gear, assert the sheet reaches `translateY(0)` and is fully inside the viewport within 500ms — so we don't regress the fix by hiding the panel forever.

## 2. Fix the actual flash

The two-step `mounted` → `animated` gate helps but does not eliminate the flash on WebKit/Firefox because:

- `useLayoutEffect` runs after React commits the initial VDOM. On the very first mount the initial state is `mounted=false`, so nothing renders — good.
- But when `isMobile` flips (which happens on real devices right after mount because `useIsMobile`'s own `useEffect` re-runs `computeIsMobile()` and can toggle the value once), the effect sets `mounted=false` again and schedules `requestAnimationFrame`. Between the state flip and the next frame, WebKit has already composited the previously-mounted panel at its open-state layout because the transform-off style is only applied on the *next* render. That is the "slide down while fading" the user reports.

Changes to `src/components/SettingsPanel.tsx`:

1. Make the closed-state transform the default via CSS (a class in `index.css`), not an inline style computed at render time, so the very first layout after mount already has `translateY(100%)` — no dependency on React state reaching the DOM.
   ```css
   .settings-sheet { transform: translateY(100%); }
   .settings-sheet[data-open="true"] { transform: translateY(0); }
   .settings-sheet[data-animated="true"] { transition: transform 0.38s cubic-bezier(0.16, 1, 0.3, 1); }
   ```
   Same treatment for the desktop drawer with `translateX(calc(100% + 64px))`.
2. Drop the inline `transform` / `transition` style props on the sheet and drawer. Drive state through `data-open` and `data-animated` attributes so the initial paint uses the stylesheet's closed transform even before React's effects run.
3. Keep the `mounted` gate (`if (!mounted) return null`) but stop keying it on `isMobile`. Instead, key it on a single mount-only effect; branch changes just re-render with the new class, they don't need to unmount.
4. In `src/hooks/use-mobile.tsx`, remove the redundant `onChange()` call inside `useEffect` — it fires an unnecessary state update on the first commit that is one of the triggers of the flash.
5. Add `data-testid="settings-sheet"` and `data-testid="settings-drawer"` (already partly present per prior turn; verify and keep stable for the spec).

## 3. Wire the spec into CI-visible output

- Extend the existing `tests/__screenshots__/REPORT.md` generator (see `tests/visual-regression.spec.ts`) so it also lists the settings-hidden results per browser, with a Pass/Fail column and the first offending frame inlined.
- Add a short `docs/testing/settings-panel-hidden.md` explaining how to run just this spec: `npx playwright test tests/settings-panel-hidden.spec.ts --project=webkit`.

## Out of scope

- No behavior changes when the panel is open.
- No backdrop/scrim changes.
- No changes to desktop drawer semantics beyond the transform-via-class refactor.

## Acceptance

- `npx playwright test tests/settings-panel-hidden.spec.ts` passes on `chromium`, `firefox`, and `webkit` for all four "should stay hidden" scenarios and the one "opens correctly" scenario.
- Per-browser screenshot folders under `tests/__screenshots__/settings-hidden/` show no visible sheet in frames 0–250ms after load.
- Manual check on a real iPhone (Safari) after deploy: no visible sheet during load or rotation.
