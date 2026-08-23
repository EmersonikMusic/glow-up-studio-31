# Fix: conversion must fire only on game_complete, not game_start

## Verified current state (read this turn)

The Ads conversion snippet is **already** strictly inside the game-complete block — it is NOT in the start function.

- `TriviaGame.tsx:530` (the game-start path, inside `runFetchAndStart`) calls **only** `trackGameStart(newSettings)`. That emits a GA4 `game_start` event with **no `send_to`** — it is a measurement event, not a Google Ads conversion.
- `TriviaGame.tsx:294–296` (inside `advanceOrFinish`, the `if (isLastNow)` game-complete branch) are the **only** places the three Ads conversions fire:
  - `fireQuizConversion()` → `AW-18392006298/Xo0pCKn31-IcEJr9_sFE`
  - `fireSearchGameConversion()` → `AW-18392006298/y8ggCNWF6OIcEJr9_sFE`
  - `fireGameStartConversion()` → `AW-18392006298/eqgwCJvR7uIcEJr9_sFE`

Nothing is misplaced, so there is no snippet to physically move.

## Why a "conversion" still appears on game_start in GA4

The cause is on Google's side, not in the app code:

1. **`game_start` is marked as a Key Event (conversion) in GA4.** GA4 calls key events "conversions." If `game_start` is flagged, GA4 reports it as a conversion on every game start regardless of the snippet.
   - Fix: GA4 Admin → Events → `game_start` → turn off "Mark as key event"; make `game_complete` the key event instead.
2. **Enhanced Conversions / auto-tagging**, or a Tag Manager trigger still bound to `game_start`/page view.

## Code change to make (removes the confusion at the source)

Rename the misnamed function so it stops implying a start trigger — same label, same trigger point, just an honest name:

- `fireGameStartConversion` → `fireOtherCompletionConversion` (label `eqgwCJvR7uIcEJr9_sFE` unchanged)
- `src/lib/conversion.ts`: rename function + update its doc comment to say it fires only on game completion.
- `src/components/TriviaGame.tsx`: update the import (line 26) and the call site (line 296).

No logic changes, no label changes, no new/different trigger points.

## What this will NOT do

- Move any snippet (nothing is misplaced).
- Touch `trackGameStart` on the start path (it's a GA4 event, not a conversion).
- Change any conversion label values.

## After approval — action on your side (Google)

- In GA4: Admin → Events → confirm `game_start` is NOT a key event; set `game_complete` as the key event.
- If you use Tag Manager: remove any trigger bound to `game_start` for the Ads conversion.
