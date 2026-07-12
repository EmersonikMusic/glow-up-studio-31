## Goal

Figure out why `game_settings_history` stays `[]` even though other profile counters update on game completion, and fix it.

## What we know

- Migration ran; column exists with default `'[]'::jsonb`.
- After 4 completed games, `total_games_played`, `category_counts`, `difficulty_counts`, `era_counts`, `play_history` all update correctly on the same row — so the `.update()` call itself reaches Postgres and RLS is fine.
- Only `game_settings_history` stays `[]`. The code in `src/lib/gameCompletion.ts` appends an entry and includes the key in the update payload, so on paper it should work.
- The `.update()` call has no `.select()` / error check, so a silent per-column rejection or a stale client bundle would look identical from our side.

## Plan

1. **Add error visibility to the update in `src/lib/gameCompletion.ts`.**
   - Destructure `{ error }` from the `await supabase.from("profiles").update({...}).eq("id", userId)` call.
   - `console.error("[gameCompletion] profile update failed", error)` when present. This is what will actually tell us if PostgREST is rejecting the JSONB payload.

2. **Harden the JSONB payload** so a bad value can't cause a silent reject:
   - Build the new entry as a plain object first.
   - Cast the full array via `JSON.parse(JSON.stringify(...))` before assigning, so it's guaranteed serializable and matches the `Json` type without a `as unknown as` chain. This removes the current `as unknown as Json` cast, which can mask a shape mismatch.
   - Keep the existing `Array.isArray(data.game_settings_history)` guard for the prior array.

3. **Verify end-to-end.**
   - Ask the user to hard-refresh the preview once (Cmd/Ctrl-Shift-R) and play one more game — a stale HMR bundle is the most likely non-code cause given the other columns work.
   - Then query `profiles.game_settings_history` for that user via `supabase--read_query`; expect at least one entry with `played_at`, `mode`, `categories`, `difficulties`, `eras`.
   - If it's still `[]`, the console error from step 1 will point at the real cause (schema cache, column type, RLS on the specific column, etc.) and we address that next.

## Out of scope

- No schema changes (column already exists and is correctly typed).
- No changes to badge logic, counters, or the UI.
- No new UI surface for the history yet.

## Technical details

Files touched:
- `src/lib/gameCompletion.ts` — add `{ error }` destructure + `console.error`, and switch the `game_settings_history` value construction to a JSON round-trip instead of `as unknown as Json`.

No other files change.