## Goal
Persist end-of-game thumbs up / down feedback on individual questions so ratings survive the session. Only rated questions are logged, and repeated ratings on the same question increment counters instead of creating duplicate rows.

## Data model
New table `public.question_ratings`:
- `question_id` bigint, primary key (matches `Question.id` from the Triviolivia API)
- `thumbs_up` int, default 0
- `thumbs_down` int, default 0
- `created_at`, `updated_at` timestamps

One row per question. No user/device column — ratings are aggregate counts. This keeps the "no duplicate entries" behavior naturally (upsert by `question_id`).

## Access control
The table is aggregate-only and must be writable by both guests and signed-in users. Rather than exposing broad INSERT/UPDATE grants (which would let anyone overwrite counts), all writes go through a `SECURITY DEFINER` RPC:

```
public.increment_question_rating(qid bigint, direction text)
```

- `direction` is validated to `'up'` or `'down'`
- Performs `INSERT ... ON CONFLICT (question_id) DO UPDATE SET thumbs_up = thumbs_up + 1` (or `thumbs_down`) and bumps `updated_at`
- `GRANT EXECUTE` to `anon` and `authenticated`

Table itself: RLS enabled, no public policies, `GRANT ALL` only to `service_role`. Clients never touch the table directly.

## Client behavior (`src/components/ResultScreen.tsx`)
The existing `handleVote(i, choice)` already tracks local vote state and supports toggling. Extend it so each *setting* of a vote calls the RPC once:

- Clicking thumbs up when not up → RPC `up` (+1 up)
- Clicking thumbs down when not down → RPC `down` (+1 down)
- Clicking the same button again to un-vote → no RPC call (nothing to record)
- Switching from up to down (or vice versa) → RPC for the new direction (+1 on the new side). We do not decrement the previous side; the spec is "add an up or down to its count."

Fire-and-forget: no await blocking the UI, log errors to console only. Use `question.id` from the passed `questions` array as the identifier.

No other components change. No Profile panel changes. No changes to anonymous_plays or profile-side history.

## Technical details
- Migration: create table, grants (service_role only), enable RLS, create RPC, grant execute on RPC to anon + authenticated.
- After migration approval, types regenerate and I'll wire `supabase.rpc('increment_question_rating', { qid, direction })` into `ResultScreen.handleVote`.
- No new files required; a small helper can live inline in `ResultScreen.tsx` or a tiny `src/lib/questionRatings.ts` — I'll use the latter for testability.

## Files
- `supabase/migrations/<ts>_question_ratings.sql` (new)
- `src/lib/questionRatings.ts` (new, ~15 lines)
- `src/components/ResultScreen.tsx` (edit `handleVote` only)