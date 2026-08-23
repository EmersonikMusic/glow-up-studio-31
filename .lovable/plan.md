# Fix: only one conversion fires on game_complete

## Where the snippet lives

`gtag('event', 'conversion', {'send_to': 'AW-18392006298/Xo0pCKn31-IcEJr9_sFE'})` is in:
- `src/lib/conversion.ts` → function `fireQuizConversion()` (lines 43–55).
- Called at `src/components/TriviaGame.tsx:294`, inside the `isLastNow` (game-complete) branch of `advanceOrFinish`.

It already fires only on game_complete — never on start. The start path (`:530`) calls only `trackGameStart()` (a plain GA4 event, no `send_to`).

## The real problem

Two **other** conversions also fire on game_complete, at `TriviaGame.tsx:295–296`:

- Line 295: `fireSearchGameConversion()` → `AW-18392006298/y8ggCNWF6OIcEJr9_sFE`
- Line 296: `fireGameStartConversion()` → `AW-18392006298/eqgwCJvR7uIcEJr9_sFE`

You want only the `Xo0pCKn31` snippet to fire on game_complete.

## Change

`src/components/TriviaGame.tsx` — in the completion branch (`isLastNow`), remove the two extra conversion calls:

- Remove `fireSearchGameConversion();` (line 295)
- Remove `fireGameStartConversion();` (line 296)
- Keep `fireQuizConversion();` (line 294) — the only conversion that fires on game_complete.
- Keep `trackGameComplete({...})` — the GA4 measurement event stays.
- Update the import line to drop the two removed functions, keeping only `fireQuizConversion`.

`src/lib/conversion.ts` — optionally delete the now-unused `fireSearchGameConversion` and `fireGameStartConversion` functions so they can't be re-added by mistake.

## What this will NOT change

- The `Xo0pCKn31` snippet still fires exactly once per completed game.
- `trackGameStart()` on the start path is untouched (GA4 event, not a conversion).
- Sign-up conversion is untouched.
- Labels `y8ggCNWF6…` and `eqgwCJvR7…` no longer fire anywhere.

## What you'll check on Google's side

In GA4: Admin → Events → confirm `game_start` is NOT marked as a key event (GA4 calls key events "conversions"); only `game_complete` should be. That stops GA4 from reporting a "conversion" on game starts that your code never sends.
