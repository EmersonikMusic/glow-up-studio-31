# Plan: Fire Google Ads conversion on game start

## Goal
Fire the Google Ads "Other" conversion event (`AW-18392006298/eqgwCJvR7uIcEJr9_sFE`) exactly once per game that successfully starts, covering all three entry points: Quick Play, Custom, and Kids Mode.

## Approach

All three start paths in `TriviaGame.tsx` (`handleStart`, `handleStartKids`, and the Play-Again/replay path) funnel through `runFetchAndStart`, which only proceeds past the fetch when questions load successfully. `trackGameStart(settings)` already fires at line 529 right after `setGameState("playing")` — the same single chokepoint where a start is confirmed. Fire the new conversion right there.

This mirrors the existing pattern used for the two game-completion conversions (`fireQuizConversion` + `fireSearchGameConversion`), which already fire on every finished game regardless of mode.

## Changes

### 1. `src/lib/conversion.ts` — add `fireGameStartConversion()`
Add a new exported helper next to `fireQuizConversion` / `fireSearchGameConversion`:

```ts
export function fireGameStartConversion(): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  try {
    window.gtag("event", "conversion", {
      send_to: "AW-18392006298/eqgwCJvR7uIcEJr9_sFE",
    });
  } catch {
    // swallow — analytics must never break the app
  }
}
```

No `value`/`currency` — the user's snippet omits them, matching Google's config for this label.

### 2. `src/components/TriviaGame.tsx` — wire it into the start chokepoint
- Import `fireGameStartConversion` alongside the existing `fireQuizConversion, fireSearchGameConversion` import (line 26).
- Call `fireGameStartConversion()` immediately after `trackGameStart(newSettings);` (line 529), inside the success branch of `runFetchAndStart`.

Because this is in the shared success path, it fires once per started game for Quick Play, Custom (including mid-game Apply), and Kids Mode — and never fires on a failed fetch (empty results or error toast path returns early before reaching this line).

## Verification
- `tsgo` typecheck passes.
- Confirm the helper is reachable and the call sits after the early-`return` guards in `runFetchAndStart` so failed loads don't fire the conversion.
