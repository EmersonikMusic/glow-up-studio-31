
## Goal

Track the specific settings (categories, difficulties, eras) used for every game a user plays, appended per game to their profile row.

## Schema change

Add one column to `public.profiles`:

- `game_settings_history jsonb not null default '[]'::jsonb`

Each entry appended on game completion will look like:

```json
{
  "played_at": "2026-07-12T20:14:08Z",
  "mode": "quickplay" | "custom",
  "categories": ["history", "science", ...],
  "difficulties": ["easy", "medium", "hard"],
  "eras": ["1900s", "2000s", ...]
}
```

Stored as an array so the full history is preserved in chronological order, and it can be queried/aggregated later (e.g. "most-played category filter"). JSONB keeps it flexible if we add fields (timer, question count) without another migration.

## Code change

Update `src/lib/gameCompletion.ts` so `handleGameCompletion` builds one entry from `sessionData` (mode + selected categories/difficulties/eras) and appends it to `game_settings_history` in the same profile update it already performs. Applies to both quickplay and custom paths — this is pure logging and does not affect badge unlocking logic.

Regenerated `src/integrations/supabase/types.ts` will pick up the new column automatically after the migration runs.

## Out of scope

- No UI surface for this history yet (can be added later on the profile panel if desired).
- No backfill — existing rows start with `[]`.

## Technical details

- Migration: `ALTER TABLE public.profiles ADD COLUMN game_settings_history jsonb NOT NULL DEFAULT '[]'::jsonb;`
- No RLS/GRANT changes needed (column inherits existing table policies).
- Append pattern in code: read current array, push new entry, write back in the same update call already used for counters.
