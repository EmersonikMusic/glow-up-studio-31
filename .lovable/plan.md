# Fix Quickplay Badge Exploit

## Problem
A single Quickplay game selects all 25 categories, all 5 difficulties, and all eras. Because the current completion logic increments `category_counts`, `difficulty_counts`, and `era_counts` from the session, it instantly satisfies:
- **The Polymath** (all 25 categories)
- **The Spectrum** (all 5 difficulties)
- **Century Hopper** (5+ eras)

## Changes

### 1. `src/lib/gameCompletion.ts` — separate Quickplay and Custom stat paths

**Quickplay path:** Only update counters that are intended to be affected by Quickplay:
- `total_games_played`
- `last_played_at`
- `first_game_completed_at` (if null)
- `play_history` (append, trim to last 50)
- `quickplay_games`

**Do NOT update** when `isQuickplay` is true:
- `category_counts`
- `era_counts`
- `difficulty_counts`
- `min_timer_games`
- `custom_games`

**Custom path:** Keep the existing behavior and increment all relevant JSONB counters and mode counters.

### 2. `src/lib/badgeEvaluator.ts` — make all-encompassing badges key-based

These badges should measure lifetime variety across distinct keys in the database JSONB objects, not whether one session happened to include everything.

- **The Polymath:** `Object.keys(stats.category_counts).length >= 25`
- **The Spectrum:** `Object.keys(stats.difficulty_counts).length >= 5`
- **Century Hopper:** `Object.keys(stats.era_counts).length >= 5`

Because Quickplay no longer writes these JSONB maps, these badges can only be earned through genuinely varied Custom games.

### 3. Reset current user's profile data

Run an `UPDATE` on `profiles` for the currently authenticated user (`auth.uid()`) to reset all counters and badges to a fresh state:
- `total_games_played = 0`
- `category_counts = '{}'`
- `era_counts = '{}'`
- `difficulty_counts = '{}'`
- `play_history = '{}'`
- `min_timer_games = 0`
- `quickplay_games = 0`
- `custom_games = 0`
- `unlocked_badges = '{}'`
- `first_game_completed_at = null`
- `last_played_at = null`

## Files touched
- `src/lib/gameCompletion.ts` (edit)
- `src/lib/badgeEvaluator.ts` (edit)
- `profiles` table data for the current user only

## Out of scope
- No schema changes
- No UI changes
- No analytics changes
- No retroactive unlocks for other users