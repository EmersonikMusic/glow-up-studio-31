## Update Kids difficulty ID: 6 → 72

The admin URL `/admin/configure/difficulty/72/change/` confirms the Kids row's real primary-key ID is **72**, not 6. That's why excluding `6` still leaked Kids questions — `6` isn't the Kids ID at all; it's just the "Score" (point value) field. The backend was excluding a nonexistent difficulty, so Kids questions passed through unfiltered.

### Change in `src/lib/triviaApi.ts`

1. **Line 22** — Update the DIFFICULTY_IDS map so Kids maps to its real PK:
   ```ts
   Casual: 1, Easy: 2, Average: 3, Hard: 4, Genius: 5, Kids: 72,
   ```

2. **Line 27** — Update the constant:
   ```ts
   const KIDS_DIFFICULTY_ID = 72;
   ```

3. **Lines 175–180** — Remove the client-side Kids safety filter now that the exclusion will actually work server-side:
   ```ts
   return shuffle(raw).map(adaptQuestion);
   ```

### Verification (before removing the safety filter)

Before I strip the client filter, I'll probe the live API with `difficulty=72` and count how many Kids questions come back in three 50-question batches. Only if all three return zero Kids will I remove the filter in the same change. If any leak through, I'll leave the filter in place and report back — that would mean Kids questions themselves are tagged with a different FK than the row's own PK, which is a backend data issue.

### One thing worth confirming on the backend list page

On the `Difficulties` list page (the one before you clicked into Kids), please confirm there is **only one** row named "Kids". If there's a duplicate (e.g. leftover from the earlier `0 → 6` attempt), its questions won't be excluded by `72` alone. If there is a duplicate, delete it or tell me its ID and I'll add it to the exclusion list.
