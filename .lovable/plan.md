## Update Kids difficulty ID: 0 → 6

Backend has reassigned the Kids difficulty from ID `0` to ID `6`. The client needs one constant change and the client-side safety filter can be removed since the backend will now honor the exclusion in a single call.

### Changes in `src/lib/triviaApi.ts`

1. **Line 22** — Update the DIFFICULTY_IDS map:
   ```ts
   Casual: 1, Easy: 2, Average: 3, Hard: 4, Genius: 5, Kids: 6,
   ```

2. **Line 27** — Update the constant:
   ```ts
   const KIDS_DIFFICULTY_ID = 6;
   ```

3. **Lines 178–180** — Remove the client-side `difficulty_name !== "Kids"` filter (no longer needed now that the backend honors the exclusion):
   ```ts
   return shuffle(raw).map(adaptQuestion);
   ```

The existing guardrail on lines 128–130 (always pushing Kids into the excluded list for non-Kids modes) stays — it now sends `difficulty=6` (truthy), which the backend parses correctly.

### Verification

- Type-check.
- Playwright: run a 50-question standard game 3× and assert zero questions have `difficulty_name === "Kids"` and count === 50.
- Playwright: run a Kids Mode game and assert every question has `difficulty_name === "Kids"`.

No other files reference the Kids ID.