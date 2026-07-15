## Plan: lock down vote counts and polish the Submit button

### 1. Database: make votes impossible to inflate

Create a new migration that:

- Adds a `question_rating_votes` table with columns:
  - `user_id uuid` (references `auth.users`)
  - `question_id bigint`
  - `direction text` (only `'up'` or `'down'`)
  - `created_at timestamp with time zone`
  - primary key on `(user_id, question_id)` so one user can vote exactly once per question
- Grants `SELECT, INSERT` to `authenticated` and `ALL` to `service_role`.
- Enables RLS and adds policies so users can only see/insert their own vote rows.
- Rewrites the `increment_question_rating(qid bigint, direction text)` function to:
  1. Reject null auth or invalid direction.
  2. Insert a vote receipt into `question_rating_votes` with `ON CONFLICT DO NOTHING`.
  3. If the insert actually created a new row, upsert the `question_ratings` aggregate count for that question.
- Locks `search_path` to `public` and keeps the function `SECURITY DEFINER` / `authenticated`-only.

Result: a signed-in user can call the RPC 10,000 times and the aggregate count moves at most once. The protection is enforced by the database, not by the browser.

### 2. Frontend: style the Submit Ratings button like the primary CTA

In `src/components/ResultScreen.tsx`, replace the current custom `<button>` for "Submit Ratings" with the existing `PrimaryCTA` component.

- Same gradient, rounded-full, uppercase, tracking, and shadow as Start Game / Play Again.
- Same hover feel (the component already applies the active/scale transition).
- Same disabled state as the Settings panel's "Apply Settings" button (`disabled:opacity-60` from `PrimaryCTA` itself), shown when:
  - user is not signed in,
  - no votes have been staged,
  - currently submitting,
  - or already submitted.
- Keep the subtext "Sign in to submit ratings." for guests.
- Keep the "Ratings Submitted" label after a successful submit.

No other UI changes. The thumb icons, dialog layout, and guest toast stay exactly as they are.

### Files touched

- `supabase/migrations/<new>.sql` — table, grants, RLS, rewritten function.
- `src/components/ResultScreen.tsx` — swap the submit button for `PrimaryCTA`.

### Non-goals

- No rate-limiting beyond the one-vote-per-user constraint.
- No guest voting.
- No backfill of existing inflated counts unless you explicitly ask.
- No changes to the thumbs-up/thumbs-down UI behavior beyond the button styling.

Ready to implement once you approve.
