# Track Quiz/Game Completion with Google Ads Conversion

## Goal
Fire a Google Ads conversion (label `Xo0pCKn31-IcEJr9_sFE`) every time a quiz/game is completed — for both signed-in and guest players. This is a separate conversion from the existing sign-up conversion.

## How game completion works today
In `src/components/TriviaGame.tsx`, `advanceOrFinish` (the callback that advances or ends the game) calls `trackGameComplete(...)` right before `setGameState("finished")` (~line 286). This fires for every finished game regardless of auth state, so it's the single correct hook point.

The snippet the user provided:
```js
gtag('event', 'conversion', {
    'send_to': 'AW-18392006298/Xo0pCKn31-IcEJr9_sFE',
    'value': 1.0,
    'currency': 'CAD'
});
```
Note: this snippet has no `event_callback` / navigation — it's a plain conversion event, not the `gtag_report_conversion(url)` helper (which is hardcoded to the sign-up label). So a dedicated helper is needed.

## Change 1 — Add `fireQuizConversion()` helper (src/lib/conversion.ts)
Add a new exported function that calls `window.gtag('event', 'conversion', {...})` with the quiz-completion label. It should:
- No-op when `window.gtag` is not a function (gtag.js not loaded).
- Fire on every completed game — no fire-once/dedupe (unlike sign-up, each completed quiz is a distinct conversion).
- Be wrapped in try/catch so analytics can never break the game.

```ts
export function fireQuizConversion(): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  try {
    window.gtag("event", "conversion", {
      send_to: "AW-18392006298/Xo0pCKn31-IcEJr9_sFE",
      value: 1.0,
      currency: "CAD",
    });
  } catch {
    // swallow — analytics must never break the app
  }
}
```

## Change 2 — Call it on game completion (src/components/TriviaGame.tsx)
In `advanceOrFinish`, immediately after the existing `trackGameComplete({...})` call (~line 286), call `fireQuizConversion()`. Import it alongside the existing `handleGameCompletion` import.

Both signed-in and guest games end through `advanceOrFinish`, so this covers all completed quizzes.

## Scope & limitations
- Edits only `src/lib/conversion.ts` and `src/components/TriviaGame.tsx`.
- Fires once per completed game for every player (guest and signed-in). No dedupe — each finished quiz is a valid conversion.
- Only the quiz-completion label `Xo0pCKn31-IcEJr9_sFE` is added; the sign-up conversion is untouched.
- Abandoned/incomplete games (user quits mid-quiz) do not reach `advanceOrFinish`'s finish branch, so they are not counted — only fully completed quizzes fire the conversion.
