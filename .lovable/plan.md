

## Two small fixes

### 1. Keyboard "Next" (→ / N) only fires once
**File:** `src/components/TriviaGame.tsx`

Root cause: `advanceOrFinish` (line 184) closes over `isLast` and `settings.timePerQuestion`. While the `advanceOrFinishRef` is updated via effect, the timing of the ref update vs. when the keydown handler reads it can drift after the first advance, causing subsequent presses to invoke a stale closure that no-ops or behaves unexpectedly.

Fix: stabilize `advanceOrFinish` so its identity never changes — read `isLast` (via `questionIndex` + `activeQuestions.length`) and `settings.timePerQuestion` from refs instead of closure.

Changes:
- Add `questionIndexRef`, `activeQuestionsLenRef`, `timePerQuestionRef` updated in small `useEffect`s mirroring the existing `gameStateRef` pattern.
- Rewrite `advanceOrFinish` with `useCallback(..., [])` so it has a stable identity, reading `isLast` from `questionIndexRef.current === activeQuestionsLenRef.current - 1` and using `timePerQuestionRef.current` when calling `startCountdown`.
- Drop the now-unnecessary `advanceOrFinishRef` indirection in the keyboard handler — call `advanceOrFinish` directly. Update the answer-expiry effect (line 199) and `handleNext` to call the same stable function.

This guarantees `→` / `N` works on every "answered" state until the final question.

### 2. Add "contact us" line to end screen
**File:** `src/components/ResultScreen.tsx`

Below the "Change Settings" button, inside the same flex column wrapper (so it inherits centering), add:

```tsx
<a
  href="mailto:mark.mazurek@triviolivia.com"
  className="mt-3 text-xs sm:text-sm font-body text-white/70 hover:text-white transition-colors underline-offset-4 hover:underline"
>
  Contact us at mark.mazurek@triviolivia.com
</a>
```

- Renders as a plain text link (no button styling) so it doesn't compete visually with the two CTAs above.
- White/70 color with hover-to-white + underline transition matches the existing minimalist aesthetic.
- `mailto:` opens the user's default email client with the address pre-filled.
- Wrapped in the existing `flex flex-col items-center gap-3 w-full` container so it sits centered directly below "Change Settings".

### Files to edit
- `src/components/TriviaGame.tsx` — stabilize `advanceOrFinish` via refs.
- `src/components/ResultScreen.tsx` — add mailto link below Change Settings CTA.

