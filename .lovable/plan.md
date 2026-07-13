## Goal
Replace per-click rating writes with a single Submit Ratings action, lock already-rated questions, and — for guests — keep the rating UI visible but nudge them to sign in when they try to use it.

## Behavior changes (`src/components/ResultScreen.tsx`)

- **Local staging only.** `handleVote` no longer calls the RPC. It updates the local `feedback` map (toggle off supported, switch up↔down supported). Nothing hits the DB until submit.
- **Submit Ratings button.** Rendered inside the Review Your Game dialog, below the table. Enabled only when:
  - user is signed in, AND
  - at least one row has a staged vote, AND
  - not currently submitting, AND
  - not already submitted this session.
- **On submit:** call `recordQuestionRating(q.id, direction)` in parallel for each staged rating, then flip `submitted = true`. Button becomes a non-interactive "Ratings Submitted" state; all thumbs buttons in the table become disabled so nothing can be re-submitted.
- **Per-question lock.** Persist rated question IDs in `localStorage` under `triviolivia:ratedQuestionIds` (JSON `number[]`). Load into a `Set` on mount. Rows whose `q.id` is in the set render thumbs in a muted, disabled state with a "You've already rated this question" title. On successful submit, add the newly-rated IDs to the set and persist.

## Guest handling (keep UI visible)

- Rating UI (thumbs buttons + Rate column) is rendered exactly the same for guests.
- Auth state tracked via `supabase.auth.getSession()` + `onAuthStateChange` into `isSignedIn`.
- When a guest clicks a thumbs button:
  - do NOT stage a vote,
  - show a toast via the existing `useToast` hook: title "Sign in to rate questions", description "Ratings are only saved for signed-in players.",
  - keep the button visually un-pressed.
- Submit Ratings button:
  - guests: rendered but disabled, with subtext under it: "Sign in to submit ratings." Clicking the disabled button is a no-op (button is `disabled`); a small inline "Sign In" link next to the subtext opens the existing AuthModal via the same trigger StartScreen uses. (If wiring an AuthModal open-handler through props is too invasive, fall back to just the subtext — no link — since AuthButton lives in the header and remains reachable.) Plan: subtext only, no new modal wiring.
  - signed-in: normal enabled/disabled logic as above.

## Helper (`src/lib/questionRatings.ts`)
Add:
- `loadRatedQuestionIds(): Set<number>` — reads localStorage, tolerant of parse errors.
- `saveRatedQuestionIds(ids: Set<number>): void` — writes localStorage.
Keep `recordQuestionRating` unchanged (fire-and-forget RPC).

## Non-goals
- No DB schema changes, no per-user rating rows, no RPC changes. "Cannot rate same question twice" stays client-side via localStorage — consistent with the aggregate-only data model.
- No changes to auth flows, profile, or grants.

## Files
- `src/components/ResultScreen.tsx` — auth state, staged submission, Submit button, per-question lock, guest toast nudge.
- `src/lib/questionRatings.ts` — localStorage helpers.
