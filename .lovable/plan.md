# Why guest play counts look low

## What the data shows

- `anonymous_plays` holds 26 rows today across 15 devices, 11 rows yesterday. So recording works.
- Signed-in players are never in this table: their completions live on their profile row (16 profiles, 40 lifetime games total).

## Why it lags Google Analytics

Three separate reasons, all structural — not a broken insert:

1. **This table only counts finished games.** A row is written only when the final answer reveal timer runs out. Anyone who quits mid-game, hits Home, or closes the tab on the last question is counted by Analytics (they fired `game_start`) but never lands in the table.
2. **Analytics counts starts and sessions; the table counts completions.** `game_start` fires on every loaded game, so the two numbers can never match.
3. **Signed-in completions are missing from this table entirely** — they only increment the profile counters.

Unverified but plausible on top of that: some guest inserts may fail silently (privacy blockers / offline). Today the failure is only written to the browser console, so it is invisible.

## Proposed fix

Make the numbers comparable and stop losing data:

1. Record guest **game starts** as well as completions, so start-vs-completion drop-off is visible in the database and directly comparable to Analytics' `game_start`.
2. Record a completion the moment the last question is revealed, and also flush a record when the player leaves mid-game, so quitting no longer erases the play.
3. Retry failed guest writes once and keep a lightweight local queue so a temporarily blocked or offline write is sent on the next visit instead of vanishing.
4. Give signed-in plays the same start/completion rows (with no personal data beyond the existing device id) so one table answers "how many games were played" for everyone.

## Technical details

- Migration: add `event_type text not null default 'complete'` (`start` | `complete`) and `is_signed_in boolean not null default false` to `public.anonymous_plays`; keep the existing insert-only policy for `anon`/`authenticated`; no read grant change.
- `src/lib/gameCompletion.ts`: add `recordAnonymousGameStart()`, extract a shared insert helper with one retry plus a `localStorage` pending-writes queue flushed on app mount.
- `src/components/TriviaGame.tsx`: call the start recorder inside `runFetchAndStart` next to `trackGameStart`/`fireGameStartConversion`; fire the completion write in `advanceOrFinish` alongside `trackGameComplete` rather than via the `finished` state effect, and guard the existing duplicate path where a failed Play Again fetch re-enters `finished`.
- No UI changes.
