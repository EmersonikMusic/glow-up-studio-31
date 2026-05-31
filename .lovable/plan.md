# Fix: Law (and other) questions leaking past category filter

## Root cause

The questions API (`https://triviolivia.herokuapp.com/api/questions/`) does **not** honor the Law category in its `category=` exclude parameter. I reproduced this directly:

- `?category=33` (Law's documented ID) → response still contains Law questions
- Tried every ID 25–40, 50, 100 — none excludes Law
- Excluding every other ID (1..24) returns ~all-Law results, confirming Law is in the pool but unreachable via the exclude param

The bug is on the backend, but we can patch it safely on the client without touching anything else.

## Fix (frontend only)

Add a defensive post-fetch filter in `src/lib/triviaApi.ts` so any question whose `category_name` isn't in the user's `selectedCategories` is dropped before the game starts. This makes the UI honor the user's selection regardless of what the API returns.

### Change in `src/lib/triviaApi.ts` — `fetchAndStartGame`

After parsing `raw` and before `shuffle().map(adaptQuestion)`:

```ts
const allowed = new Set(settings.selectedCategories);
const filtered = raw.filter(
  (q) => !q.category_name || allowed.has(q.category_name),
);
return shuffle(filtered).map(adaptQuestion);
```

Notes:
- Uses the existing `settings.selectedCategories` already passed in — no new params.
- Only filters categories (the reported bug). Difficulty/era filters appear to work; not touching them.
- If filtering empties the batch, the existing "No questions matched your filters" toast in `TriviaGame.runFetchAndStart` will fire naturally.

## Files changed

- `src/lib/triviaApi.ts` — add the 4-line post-filter inside `fetchAndStartGame`.

No other files, no UI changes, no settings/state changes.
