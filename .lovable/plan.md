## Summary
Two targeted changes to the Result (end) screen: (1) make "Play Again" restart immediately with the same user-selected settings, and (2) increase vertical spacing between the two action buttons on mobile/tablet.

## Details

### 1. "Play Again" restarts with same settings
**Current behavior:** clicking "Play Again" calls `handleRestart`, which resets the game state to `"start"` and returns the user to the start screen.

**New behavior:** clicking "Play Again" should immediately fetch and start a new game round using the same `settings` object (same categories, difficulties, eras, question count, and timer durations).

**Implementation:**
- In `src/components/TriviaGame.tsx`, add a new `handlePlayAgain` callback that:
  - Clears active timers (`clearTimer`, `clearAnswerTimer`)
  - Resets `questionIndex`, `score`, and `animKey`
  - Calls the existing `runFetchAndStart(settings)` to launch a new round with the current settings
- Pass `handlePlayAgain` into `ResultScreen` as the `onRestart` prop.
- Leave `handleRestart` untouched; it will continue to be used by the "Change Settings" flow and the home button.

### 2. More button spacing on mobile/tablet
**Current:** the CTA container in `src/components/ResultScreen.tsx` uses a fixed `gap-3` (12px) at all breakpoints.

**New:** increase the gap on smaller screens where the buttons feel cramped, while keeping desktop spacing as-is.
- Change `gap-3` to `gap-5 sm:gap-3` in the button flex container. This yields 20px spacing below the `sm` breakpoint (mobile/tablet) and 12px on desktop (`sm` and up).

## Files changed
- `src/components/TriviaGame.tsx` — add `handlePlayAgain`, wire it to `ResultScreen`
- `src/components/ResultScreen.tsx` — responsive gap tweak
