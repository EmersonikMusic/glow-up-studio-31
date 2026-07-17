# Fix: Kids questions leaking into regular games

## Root cause (verified against the live API)

`src/lib/triviaApi.ts` already tries to exclude Kids by always adding difficulty ID `0` to the excluded list. The problem is the backend, not the client:

Probes against `https://triviolivia.herokuapp.com/api/questions/`:

- `difficulty=0` alone → returns **all** difficulties including Kids (exclusion ignored).
- `difficulty=3,4,5,0` → correctly returns only Casual + Easy (exclusion honored).
- `difficulty=1,2,3,4,5` → correctly returns only Kids.

So the API silently drops `0` when it's the only token in the exclude list. That's exactly the case that triggers in normal play: when the user has all five regular difficulties selected, our excluded set is just `[0]`, we send `difficulty=0`, the backend ignores it, and Kids questions slip through.

## Fix

Do not rely on the backend to honor the Kids exclusion. Enforce it on the client too.

In `src/lib/triviaApi.ts`, inside `fetchAndStartGame`, after parsing the JSON response and before shuffling/adapting:

- When `options.kidsMode !== true`, drop every raw question whose `difficulty_name === "Kids"`.
- Keep the existing URL-level exclusion as-is (it still helps in the mixed-selection case and keeps payloads smaller).

That's a one-spot, presentation-layer guard. No settings, no schema, no UI changes.

## Technical details

File to change:

- `src/lib/triviaApi.ts` — add a post-fetch filter in `fetchAndStartGame`:

  ```ts
  const raw = (await response.json()) as RawApiQuestion[];
  if (!Array.isArray(raw)) throw new Error("Unexpected API response");
  const filtered = options.kidsMode === true
    ? raw
    : raw.filter((q) => q.difficulty_name !== "Kids");
  return shuffle(filtered).map(adaptQuestion);
  ```

Note: this may return fewer than `numQuestions` on the (now-impossible-in-practice) chance the backend served an all-Kids batch to a non-Kids request. The engine already tolerates short batches, and once the backend stops leaking in the common case the shortfall won't occur.

## Verification

- Re-run the probe: `curl ".../api/questions/?questions=20&difficulty=0"` still returns Kids from the server, but after the client filter no adapted `Question` will have `difficulty === "Kids"`.
- Manual: start a regular game with all difficulties selected and confirm no Kids-flavored questions appear.
