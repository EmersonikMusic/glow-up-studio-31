# Fix: Ads conversion appearing to fire on game_start

## Verified current state (code)

- `TriviaGame.tsx:530` (inside `runFetchAndStart`, the game-start path) calls **only** `trackGameStart(newSettings)`. That emits a GA4 `game_start` event with no `send_to`, so it is **not** a Google Ads conversion.
- `TriviaGame.tsx:294–296` (inside `advanceOrFinish`, the `isLastNow` game-complete branch) are the **only** places the three Ads conversions fire:
  - `fireQuizConversion()` → `AW-18392006298/Xo0pCKn31-IcEJr9_sFE`
  - `fireSearchGameConversion()` → `AW-18392006298/y8ggCNWF6OIcEJr9_sFE`
  - `fireGameStartConversion()` → `AW-18392006298/eqgwCJvR7uIcEJr9_sFE`

So **no** `gtag('event','conversion', …)` snippet sits in the start function. The conversion code is already strictly inside the game-complete block.

## Why you still see a "conversion" on game_start in GA4

This is a GA4 configuration issue, not an app-code issue. Two likely causes (both on Google's side, not changeable from here):

1. **`game_start` is marked as a Key Event (conversion) in GA4.** GA4 calls key events "conversions." If `game_start` is flagged as a key event, GA4 reports it as a conversion on every game start regardless of your snippet.
   - Fix: GA4 Admin → Events → find `game_start` → toggle off "Mark as key event" (or replace it with `game_complete`).
2. **Enhanced Conversions / auto-tagging** or a Tag Manager trigger still bound to `game_start`/page view.

## Code change to make (optional but recommended)

Rename the misnamed function so it stops implying a start trigger:

- `fireGameStartConversion` → `fireOtherCompletionConversion` (label `eqgwCJvR7uIcEJr9_sFE` stays the same)
- Update the doc comment in `src/lib/conversion.ts` to state it fires only on game completion.
- Update the import + call site in `src/components/TriviaGame.tsx` (line 26 import, line 296 call).

No logic changes — same label, same trigger point, just an honest name.

## What I will NOT do

- Move any snippet, because nothing is misplaced.
- Touch the start path's `trackGameStart` GA4 event (it's a measurement event, not a conversion).
- Change any label values.

## Action on Google's side (you, after approval)

- In GA4: Admin → Events → confirm `game_start` is NOT a key event; make `game_complete` the key event instead.
- If you use Tag Manager: remove any trigger bound to `game_start` for the Ads conversion.
