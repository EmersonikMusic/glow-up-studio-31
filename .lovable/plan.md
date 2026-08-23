# Fix: conversion must fire only on game_complete

## What's actually in the code

The Ads conversion snippet is **already** inside the game-complete block — not the start function.

- On game **start** (`TriviaGame.tsx:530`): only `trackGameStart()` fires — a plain GA4 event, no `send_to`, not a conversion.
- On game **complete** (`TriviaGame.tsx:294–296`, the `isLastNow` branch): all three Ads conversions fire.

So there's nothing to physically move.

## The real cause

A "conversion" still shows on `game_start` in GA4 because of a Google-side setting:

- **`game_start` is marked as a Key Event (conversion) in GA4.** GA4 calls key events "conversions," so it reports `game_start` as a conversion regardless of your code.
- Or Enhanced Conversions / a Tag Manager trigger is bound to `game_start`.

## What I'll change in the code

Rename the misleading function so it stops looking like a start trigger:

- `fireGameStartConversion` → `fireOtherCompletionConversion`
- Same label (`eqgwCJvR7uIcEJr9_sFE`), same trigger point (game complete only).

Files: `src/lib/conversion.ts` (rename + comment), `src/components/TriviaGame.tsx` (import + call site).

## What you'll change on Google's side

- GA4 → Admin → Events → turn off "Mark as key event" for `game_start`; set `game_complete` as the key event.
- Tag Manager: remove any trigger bound to `game_start`.
