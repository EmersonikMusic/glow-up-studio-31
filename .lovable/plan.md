# Move the start conversion to game completion

## Current state (verified)

- `src/components/TriviaGame.tsx` line 530 calls `fireGameStartConversion()` right after `trackGameStart(...)` in `runFetchAndStart` — it fires when a game starts.
- Lines 294-295 call `fireQuizConversion()` and `fireSearchGameConversion()` inside the `isLastNow` branch of `advanceOrFinish` — the completion path.
- `index.html` contains only the base gtag config plus the sign-up conversion helper; no conversion fires at page load.

## Change

1. `src/components/TriviaGame.tsx`
   - Remove the `fireGameStartConversion()` call at line 530. Keep `trackGameStart(newSettings)` — the GA4 funnel event stays.
   - Add `fireGameStartConversion()` inside the completion branch of `advanceOrFinish`, next to the other two conversion calls.

2. `src/lib/conversion.ts`
   - Update the doc comment on `fireGameStartConversion` so it describes firing on game completion rather than start. (Keeping the function name avoids churn; the comment will note the label is Google's "Other" conversion, now fired on completion.)

## Result

Label `eqgwCJvR7uIcEJr9_sFE` fires only when a player reaches the end of a game, alongside `Xo0pCKn31-IcEJr9_sFE` and `y8ggCNWF6OIcEJr9_sFE`. Because all three sit in the shared `advanceOrFinish` finish branch, they cover Quick Play, Custom, and Kids Mode, and none fire for abandoned games.

## Verification

- Typecheck passes.
- Confirm no remaining reference to the conversion in the start path.
