## Root cause of "nothing recorded"

The `anonymous_plays` table was created with RLS + an insert policy, but the migration never ran `GRANT INSERT ... TO anon, authenticated`. PostgREST checks table privileges before RLS, so every guest insert is being rejected with `permission denied for table anonymous_plays` and the fire-and-forget path swallows it. Verified via `information_schema.role_table_grants` — the table currently has zero grants.

## Fix

**Migration** — add the missing Data API grants (kept minimal to match the write-only-from-client policy):

```sql
GRANT INSERT ON public.anonymous_plays TO anon, authenticated;
GRANT ALL ON public.anonymous_plays TO service_role;
```

No schema/policy changes; the existing `INSERT` policy (`WITH CHECK (true)`) already allows the row and there are still no SELECT/UPDATE/DELETE policies, so rows stay readable only by service_role.

## `game_settings_history` for guests

For signed-in plays, `game_settings_history` is a JSONB array on `profiles` that accumulates one `encodeGameSettings(...)` string per completed game. In the guest schema, each game is its own row and the `settings_code` column on `anonymous_plays` already stores the exact same encoded string produced by the exact same `encodeGameSettings(...)` call (same fields: categories, difficulties, eras, numQuestions, timePerQuestion, timePerAnswer, completedAt, isKidsMode). Reading `settings_code` across a device's rows, ordered by `completed_at`, reconstructs the same information as `game_settings_history`.

So functionally the data is already recorded identically — no new column needed. Once grants are fixed, guest rows will start flowing in with the encoded settings string per game.

**Question before I finalize:** do you want me to
1. leave the column named `settings_code` (already stores the encoded history entry), or
2. rename it to `game_settings_history` on `anonymous_plays` so the naming matches the signed-in field?

I'll wait for your call on the rename before writing the migration if that matters to you; otherwise I'll ship option 1 (just the grant fix).

## Files touched

- `supabase/migrations/<timestamp>_anonymous_plays_grants.sql` (new) — the two GRANT statements above.

## Out of scope

- Any client changes (the insert code is already correct; it was only failing because of missing table privileges).
- Any Profile panel / UI changes.
