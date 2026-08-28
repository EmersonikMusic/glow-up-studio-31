# Plan: Record game starts in the database

## Goal
Today the database only records **completed** games (`anonymous_plays` for guests, profile counters for signed-in users). Google Analytics counts every game **start**, so the two numbers never reconcile. Add a new table that records every game start — guests and signed-in users — so you can compute a real start→complete rate from the database alone.

## 1. New table: `game_starts`

Mirror of `anonymous_plays`, plus a nullable `user_id` so signed-in starts are captured too.

Columns:
- `id` uuid PK (default `gen_random_uuid()`)
- `user_id` uuid **nullable** — references `auth.users(id)`; null for guests, the user's id when signed in
- `device_id` text not null — same `getDeviceId()` value used by `anonymous_plays`
- `settings_code` text not null — same encoded settings string (via `encodeGameSettings`) used by `anonymous_plays`
- `is_kids_mode`, `is_quickplay`, `is_custom`, `is_minimum_timer` booleans, default false — identical meaning to `anonymous_plays`
- `started_at` timestamptz not null default now() — when the round began (client timestamp, like `completed_at` in `anonymous_plays`)
- `created_at` timestamptz not null default now()

Security (write-only analytics, identical posture to `anonymous_plays`):
- `GRANT INSERT ON public.game_starts TO anon, authenticated;` and `GRANT ALL ON public.game_starts TO service_role;`
- `ENABLE ROW LEVEL SECURITY`
- One policy: anyone (anon + authenticated) may `INSERT` when `length(device_id) > 0`
- `SELECT / UPDATE / DELETE` denied (no policies) — rows are never readable from the client, only via the backend dashboard

This is a data table change → handled via the migration tool (with GRANT + RLS + policy in the same migration, per project rules). The Supabase types file regenerates automatically after the migration runs.

## 2. New helper: `recordGameStart`

New file `src/lib/gameStart.ts`, following the fire-and-forget pattern of `handleAnonymousGameCompletion` in `src/lib/gameCompletion.ts`:

- Build `settings_code` with `encodeGameSettings(...)` using the same fields (categories, difficulties, eras, numQuestions, timePerQuestion, timePerAnswer, isKidsMode) — same format `anonymous_plays` uses, so the two tables are directly comparable.
- Insert one row into `game_starts`: `device_id` from `getDeviceId()`, `user_id` = the signed-in user's id or `null`, the four boolean flags, and `started_at = new Date().toISOString()`.
- Errors are logged to the console and swallowed (analytics must never break a game).

Signature:
```ts
export async function recordGameStart(params: {
  userId: string | null;
  settings: GameSettings;
  isKidsMode: boolean;
  isQuickplay: boolean;
  isCustom: boolean;
  isMinimumTimer: boolean;
}): Promise<void>
```

## 3. Wire into the start flow

In `src/components/TriviaGame.tsx`, inside `runFetchAndStart` right where the game already begins (next to `beginRound()` / `trackGameStart(newSettings)` at ~line 527), call `recordGameStart` once with the flags computed the same way the completion effect computes them:
- `isKidsMode` = `opts.kidsMode === true`
- `isQuickplay` = `!hasCustomized && !isKidsMode`
- `isCustom` = `hasCustomized && !isKidsMode`
- `isMinimumTimer` = `settings.timePerQuestion <= 5 && settings.timePerAnswer <= 5`
- `userId` = `currentUser?.id ?? null` (existing component state already tracks the signed-in user)

This fires exactly once per started round, mirroring the existing `trackGameStart` analytics call, so DB starts and GA4 starts line up.

## What you get
- A full start count across all users in one table.
- Guest completion rate: `game_starts WHERE user_id IS NULL` vs `anonymous_plays`.
- Signed-in completion rate: `game_starts WHERE user_id IS NOT NULL` vs profile `total_games_played` increments.
