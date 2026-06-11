# "Answers at end" game mode

Add a new game mode option in Settings. Two modes:

- **Auto-reveal** (current default) — each question reveals its answer right after the timer, then advances.
- **Slideshow** (new) — questions play back-to-back with no answer reveal between them. At the end of the round, the result screen lists every question and its correct answer.

## Settings UI

In **`src/data/gameOptions.ts`**:
- Add `gameMode: "auto_reveal" | "slideshow"` to `GameSettings`.
- Default to `"auto_reveal"` so existing behavior is preserved.

In **`src/components/SettingsPanel.tsx`** → "Game Settings" section, add a new "Game Mode" control above the sliders. Two `ToggleRow`-style rows (mutually exclusive — picking one turns off the other):
- "Reveal after each question"
- "Reveal all at the end"

State plumbed through `handleApply` like the other settings.

## Gameplay

In **`src/components/TriviaGame.tsx`**:
- When `settings.gameMode === "slideshow"`:
  - Skip the `"answered"` state entirely — when the question timer hits zero, advance directly to the next question (or `"finished"` if it's the last).
  - No reveal sound, no answer text rendered on the card, no answer-phase countdown shown in the footer.
  - Mascot stays in `"idle"` (no celebrate bounce per question).
- Track each question shown in a `playedQuestionsRef` so the result screen can list them in order. (Today the question pool is in state already; we just need to keep the same `activeQuestions` array around for the results view — it's already preserved until `handleRestart`/`handlePlayAgain`, so no new ref is strictly needed.)

`QuestionCard` and `GameFooter` don't need new props — they just won't see `answered === true` in slideshow mode.

## Result screen

In **`src/components/ResultScreen.tsx`**:
- Accept new optional props: `questions: Question[]` and `mode: "auto_reveal" | "slideshow"`.
- When `mode === "slideshow"`, render a numbered Q&A list above the CTAs:
  - Glass-styled scrollable list, capped height with internal scroll on small viewports.
  - Each row: `1.` question text on top, correct answer below in gold/teal accent.
  - Header: "Round Recap".
- When `mode === "auto_reveal"`, render exactly as today (no list).

`TriviaGame.tsx` passes `activeQuestions` and `settings.gameMode` into `<ResultScreen>`.

## Analytics

In **`src/lib/analytics.ts`** → `trackGameStart`, add `game_mode: settings.gameMode` to the payload so we can compare engagement between modes. No new event names, no allowlist changes.

## Out of scope

- No changes to scoring, sounds, or timing sliders.
- No persistence of mode across sessions beyond the existing in-memory `settings` state.
- No new pause/resume behavior.
