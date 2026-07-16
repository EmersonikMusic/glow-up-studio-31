## Goal

Prove (via an automated test) that the `SettingsPanel` never becomes visible on mobile until it is intentionally opened — including during initial paint and viewport rotation — and fix whatever the test uncovers.

## Why a Playwright test (not Vitest)

The bug is a **paint-timing / layout-flash** issue. jsdom (Vitest) has no layout engine, no transitions, and no real viewport, so it cannot observe the flash. We need a real browser with a real viewport that we can resize.

## Test plan

New file: `tests/e2e/settings-panel-hidden.spec.ts` (Playwright, driven via `bunx playwright test` or the existing shell-based Playwright workflow — no new test framework wiring in the app itself).

The test does four things:

1. **Initial mobile load**
   - Launch Chromium, viewport `390 × 844` (iPhone-ish), `deviceScaleFactor: 2`.
   - Navigate to `/`.
   - Sample the DOM every ~16 ms for the first ~1 s using `page.evaluate` with `requestAnimationFrame`, capturing for the sheet container (`[data-testid="settings-panel-sheet"]`):
     - computed `opacity`
     - computed `transform`
     - bounding rect `top` vs `window.innerHeight`
   - Assertion: at every sample, **either** `opacity === 0` **or** the rect's `top >= innerHeight` (fully off-screen). Never both visible and on-screen.

2. **Rotation → landscape**
   - Resize viewport to `844 × 390` and repeat the same sampling for ~500 ms.
   - Same assertion.

3. **Rotation back → portrait**
   - Resize back to `390 × 844`, sample again, same assertion.

4. **Open action still works**
   - Click the settings button (`[aria-label="Settings"]` — confirm the exact selector from `TriviaGame.tsx`/header before writing) and assert the sheet becomes visible (`opacity === 1`, `top < innerHeight`) within 600 ms. This guards against a fix that just hides the panel forever.

Screenshots at key frames go to `/tmp/browser/settings-hidden/` for human review.

## Small production changes required by the test

- Add `data-testid="settings-panel-sheet"` to the mobile sheet root and `data-testid="settings-panel-backdrop"` to the backdrop in `src/components/SettingsPanel.tsx`. Purely additive, no behavior change.

## Likely fix the test will force

Current code in `SettingsPanel.tsx` fades the sheet in via `opacity: ready ? 1 : 0` where `ready` flips to `true` in a `useEffect` on mount. Two remaining leak paths:

1. **Cross-breakpoint remount flash on rotation.** When the viewport crosses 768 px, `useIsMobile` flips and a different branch renders — the new branch mounts with `ready=false` for one frame, but the *previous* branch's element was already `ready=true` and on-screen. During the swap the mobile sheet can briefly render with default transform before its inline `translateY(100%)` is applied by React.
   - Fix: gate `ready` on both mount **and** the current `isMobile` value — reset `ready` to `false` synchronously (in a layout effect keyed on `isMobile`) and flip it back to `true` on the next frame via `requestAnimationFrame`. Use `useLayoutEffect` (not `useEffect`) so the hidden state is applied before paint.

2. **Initial `translateY(100%)` not applied before first paint.** The transform is set via inline style, so it *is* on the first paint — but the parent's `transition: transform 0.38s` means if React ever renders `translateY(0)` first (e.g., during an intermediate state), it will animate in. Guard by only enabling the `transition` after `ready` is true (set `transition: ready ? "transform 0.38s ..." : "none"`).

Both fixes are ~5 lines and localized to `SettingsPanel.tsx`.

## Deliverables

- `tests/e2e/settings-panel-hidden.spec.ts` — the visual regression test described above.
- `src/components/SettingsPanel.tsx` — add test ids; switch `useEffect` → `useLayoutEffect` keyed on `isMobile`; suppress `transition` until `ready`.
- Run the test to confirm it passes; capture screenshots to `/tmp/browser/settings-hidden/` and review them.

## Out of scope

- No changes to desktop layout, styling, or the settings feature itself.
- No new npm dependency (Playwright is already available in the sandbox).
