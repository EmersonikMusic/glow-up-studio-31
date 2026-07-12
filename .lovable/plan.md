# Kids Mode

A dedicated play mode that pulls exclusively from the new backend `Kids` difficulty. All existing modes (Quick Play, Customize) must never surface Kids questions.

## Assumptions

- Django difficulty ID for **Kids = 0** (from your note that its score is 0). Tell me if the ID is different.

## UX

- **Entry point**: third CTA on the Start Screen, below "Customize Game", labeled **"Kids Mode"**. Reuses `SecondaryCTA` styling. Tapping it fetches Kids questions and starts immediately (like Quick Play).
- **Settings panel**: unchanged. `Kids` is not user-selectable.
- **Gameplay**: same engine, timers, and result screen. No visual reskin in this pass.

## Data / API wiring

`src/lib/triviaApi.ts`:
- Add `Kids: 0` to `DIFFICULTY_IDS`.
- Add optional `kidsMode?: boolean` on the settings passed to `fetchAndStartGame`:
  - When `true`: exclude every difficulty ID *except* `0`; ignore `selectedDifficulties`.
  - When `false`/absent: always append `0` to the excluded difficulty list so Kids questions never leak into other modes.

`src/data/gameOptions.ts`: unchanged. `Kids` is a mode, not a difficulty checkbox.

## Wire-through

- `StartScreen.tsx`: add `onStartKids` prop + third CTA.
- `TriviaGame.tsx` / `Index.tsx`: new `handleStartKids` path calling `fetchAndStartGame` with `kidsMode: true` and Quick Play defaults. Sets `isKidsMode` on the session.
- `gameCompletion.ts` + `gameSettingsCode.ts`: accept `isKidsMode`. When true, encode the entry with the same segment structure and widths as usual, but **replace every `o` and `x` in the categories, difficulties, and eras masks with `k`**. Timestamp, chunk spacing, pipes, and the numeric fields (`NNN|QQ|AA`) stay exactly the same. Example:

  ```
  2026-07-12T21:40Z|kkkkk kkkkk kkkkk kkkkk kkkkk|kkkkk|kkkkkk kkkkkk|010|10|05
  ```

- **Counters**: Kids games increment `total_games_played` and `play_history` only. They do NOT increment `category_counts`, `era_counts`, `difficulty_counts`, `quickplay_games`, or `custom_games`.

## Files touched

- `src/lib/triviaApi.ts` — add Kids ID, `kidsMode` param, always-exclude guard.
- `src/lib/gameSettingsCode.ts` — accept `isKidsMode`, emit all-`k` masks.
- `src/lib/gameCompletion.ts` — pass `isKidsMode` through; skip counter bumps.
- `src/lib/badgeEvaluator.ts` — add `isKidsMode` to `GameSessionData` type.
- `src/components/TriviaGame.tsx` — new start path, session flag.
- `src/components/StartScreen.tsx` — third CTA.
- `.lovable/plan.md` — updated.

No DB migration needed.
