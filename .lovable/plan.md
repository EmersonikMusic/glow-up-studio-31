## Goal

Replace the verbose object entries in `profiles.game_settings_history` with a compact fixed-width string per game, and include number of questions, question time, and answer time.

## Encoding format

```
CCCCCCCCCCCCCCCCCCCCCCCCC-DDDDD-EEEEEEEEEEEE-NNN-QQ-AA
```

- 25 chars — categories, alphabetical (matches `ALL_CATEGORIES` order after sorting)
- 5 chars — difficulties, ascending (Casual, Easy, Average, Hard, Genius)
- 12 chars — eras, chronological (Pre-1500 → 2020s)
- 3 chars — number of questions, zero-padded (e.g. `050`)
- 2 chars — time per question, zero-padded seconds
- 2 chars — time per answer, zero-padded seconds

Each slot is `o` when the option is selected for that game, `x` otherwise. Groups separated by `-`. Total length: 25+1+5+1+12+1+3+1+2+1+2 = **54 chars**.

Example (all cats/diffs/eras, 10 questions, 10s/5s):
```
ooooooooooooooooooooooooo-ooooo-oooooooooooo-010-10-05
```

## Plan

1. **`src/lib/gameSettingsCode.ts`** (new)
   - Export ordered constants for the three axes (sorted copies of `ALL_CATEGORIES`, ascending `ALL_DIFFICULTIES`, chronological `ALL_ERAS` — these already match the required orders in `src/data/gameOptions.ts`).
   - `encodeGameSettings(session, numQuestions, timePerQuestion, timePerAnswer): string` builds the 54-char code by mapping each ordered list to `o`/`x`, then appending the three zero-padded numbers.
   - Small unit-testable pure function.

2. **`src/lib/badgeEvaluator.ts`**
   - Extend `GameSessionData` with `numQuestions`, `timePerQuestion`, `timePerAnswer` (numbers). No change to badge logic.

3. **`src/components/TriviaGame.tsx`**
   - When constructing the `GameSessionData` passed to `handleGameCompletion`, include the three new numeric fields from the active `GameSettings`.

4. **`src/lib/gameCompletion.ts`**
   - Replace the object entry with the encoded string from `encodeGameSettings(...)`.
   - Keep `game_settings_history` as a JSONB array of strings (still valid `Json`). Preserve the append + 50-entry logic; no schema change (column stays `jsonb`, still accepts an array of strings).

## Out of scope

- Guest (signed-out) tracking, extra profile fields (country/locale/timezone), and any UI to display the history — those remain in the earlier deferred plan.
- No migration or backfill of existing entries; old object entries stay as-is until they age out of the 50-entry window.

## Technical details

Files touched:
- new `src/lib/gameSettingsCode.ts`
- `src/lib/badgeEvaluator.ts` — extend `GameSessionData`
- `src/components/TriviaGame.tsx` — pass 3 new fields into the session
- `src/lib/gameCompletion.ts` — push encoded string instead of object

No DB migration. No changes to badge evaluation, counters, or UI.
