# Add second Google Ads conversion label on game completion

## Goal
Fire a second Google Ads conversion event — label `y8ggCNWF6OIcEJr9_sFE` ("Triviolitia Search Game Completions") — every time a game completes, in addition to the existing quiz-completion conversion (`Xo0pCKn31-IcEJr9_sFE`). Both must fire for Quick Play, Custom, and Kids Mode games (all three end through the same `advanceOrFinish` path in `TriviaGame.tsx`).

## How it works today
- `src/lib/conversion.ts` exports `fireQuizConversion()`, which calls `window.gtag("event", "conversion", { send_to: "AW-18392006298/Xo0pCKn31-IcEJr9_sFE", ... })`.
- `src/components/TriviaGame.tsx` calls `fireQuizConversion()` inside `advanceOrFinish`, right after `trackGameComplete(...)`, on the finish branch — so it already covers every completed game regardless of mode.

## Change — Add `fireSearchGameConversion()` (src/lib/conversion.ts)
Add a second exported helper mirroring `fireQuizConversion()` but with the new label:

```ts
export function fireSearchGameConversion(): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  try {
    window.gtag("event", "conversion", {
      send_to: "AW-18392006298/y8ggCNWF6OIcEJr9_sFE",
      value: 1.0,
      currency: "CAD",
    });
  } catch {
    // swallow — analytics must never break the app
  }
}
```

## Change — Call it on game completion (src/components/TriviaGame.tsx)
In `advanceOrFinish`, immediately after the existing `fireQuizConversion()` call, call `fireSearchGameConversion()`. Import it alongside the existing `fireQuizConversion` import.

Both helpers run back-to-back on every finished game, so both labels fire for Quick Play, Custom, and Kids Mode. No dedupe — each completed quiz is a distinct conversion for both labels.

## Scope
- Edits only `src/lib/conversion.ts` and `src/components/TriviaGame.tsx`.
- Does not touch the sign-up conversion or the existing quiz-completion label.
- Abandoned/incomplete games do not reach the finish branch, so they fire neither conversion.
