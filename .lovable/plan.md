

## Plan: Card-height regression test + iOS Safari viewport stability

### Part 1 — Automated card-height check (Playwright)

A Vitest/jsdom test cannot measure real layout heights — it has no painted layout. Use Playwright (already installed: `@playwright/test` + `playwright.config.ts`) for a real-browser check.

**New file:** `tests/card-height.spec.ts`
- Launch the app at the preview URL, click Start to enter gameplay.
- Read the bounding box height of the question card (`[data-testid="question-card"]`) on Q1.
- Submit/advance through 3 questions (skip via the answer-phase auto-advance or click Next).
- Re-measure the card height after each transition.
- Assert all heights are within 1px of the Q1 baseline.
- Run at mobile viewport (390×844) and desktop (1280×720) in two projects.

**Required tweak:** add `data-testid="question-card"` to the wrapper `<div>` in `src/components/QuestionCard.tsx` (line 17) so the test has a stable selector. No visual change.

**Script:** add `"test:e2e": "playwright test"` to `package.json` so the user can run it.

### Part 2 — iOS Safari toolbar stability (scroll/resize listener)

**Problem:** when the iOS Safari address bar collapses on scroll, the visual viewport changes height. `100svh` handles the static case, but in-flight scroll events plus rubber-band scrolling can briefly hide the footer or cover the card.

**Fix — `src/components/TriviaGame.tsx`:**
1. Add a `useEffect` that subscribes to `window.visualViewport` `resize` and `scroll` events (with `window.resize` + `orientationchange` fallbacks for browsers without `visualViewport`).
2. On each event, write the current visual viewport height to a CSS variable on `document.documentElement`:
   ```ts
   const h = window.visualViewport?.height ?? window.innerHeight;
   document.documentElement.style.setProperty("--app-vh", `${h}px`);
   ```
3. Throttle with `requestAnimationFrame` to avoid layout thrash; clean up listeners on unmount.

**Fix — root container (`<div className="min-h-[100svh] grid ...">`)**:
- Change min-height to use the live variable with a graceful fallback chain:
  ```
  style={{ minHeight: "var(--app-vh, 100svh)" }}
  ```
- Keep `100svh` as the CSS fallback for SSR/first paint and non-iOS browsers.

**Fix — `<main>` (line ~257):**
- Already uses `min-h-0` + grid `1fr`, so it inherits the corrected height automatically. No changes needed.

**Fix — keep footer in view on rubber-band scroll:**
- Add `overscroll-behavior-y: none` to the root container (Tailwind `overscroll-none`) so iOS rubber-band can't drag the footer off-screen during gameplay.

### Part 3 — Optional Vitest sanity test
Add a lightweight `src/components/__tests__/QuestionCard.test.tsx` that renders the card with two different questions and asserts the wrapper has the `h-full` class — guards against future regressions where someone re-introduces `min-h-[60vh]` or content-sized heights. Fast, runs in CI on every commit.

### Files touched
- `src/components/QuestionCard.tsx` — add `data-testid="question-card"`.
- `src/components/TriviaGame.tsx` — visual-viewport listener + `--app-vh` variable + `overscroll-none`.
- `tests/card-height.spec.ts` (new) — Playwright regression spec.
- `src/components/__tests__/QuestionCard.test.tsx` (new) — Vitest class-presence guard.
- `package.json` — add `test:e2e` script.

### Out of scope
No changes to game logic, timers, animations, colors, fonts, header/footer styling, or desktop layout.

### Verification
1. `npm run test` passes (Vitest guard).
2. `npm run test:e2e` passes; card heights identical (±1px) across Q1→Q4 on mobile and desktop projects.
3. iOS Safari (real device or 390×844 emulation): scroll/swipe to collapse address bar → footer remains visible, card never overlaps footer, no visible jumpiness.
4. Android Chrome + desktop: no regressions; layout identical to current build.

