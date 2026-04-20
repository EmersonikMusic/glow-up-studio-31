

## Plan: Fix "Play Again" to fully reset game like first Start

### Problem
On the Result screen, clicking "Play Again" calls `handleRestart`, which sets `gameState` back to `"start"`. The user then sees the Start screen and must click "Start Game" again — which should trigger a fresh fetch + countdown. But the report says the countdown timer and animation aren't resetting.

Looking at `handleRestart` in `TriviaGame.tsx`:
```ts
const handleRestart = useCallback(() => {
  clearTimer();
  clearAnswerTimer();
  setPaused(false);
  setQuestionIndex(0);
  setScore(0);
  setGameState("start");
  setPanelOpen(!window.matchMedia("(max-width: 767px)").matches);
  setAnimKey((k) => k + 1);
}, [clearTimer, clearAnswerTimer]);
```

Issues:
1. `countdown` state is **not reset** — it's left at whatever value it had when the previous game ended (often `0`). When the user starts the next game, `handleStart` calls `deferCountdown(...)` which waits ~350ms before `startCountdown` runs. During that gap, the footer reads the stale `countdown=0`, so the timer/progress bar appears stuck/empty until the deferred call kicks in.
2. `answerCountdown` similarly not reset to `null`.
3. `activeQuestions` is left populated from the previous game — minor, but means a stale `currentQuestion` could briefly flash.

### Fix (single file: `src/components/TriviaGame.tsx`)
Update `handleRestart` to reset all gameplay state to the same baseline the component had on first mount:

```ts
const handleRestart = useCallback(() => {
  clearTimer();
  clearAnswerTimer();
  setPaused(false);
  setQuestionIndex(0);
  setScore(0);
  setActiveQuestions([]);
  setCountdown(settings.timePerQuestion); // reset to full
  setAnswerCountdown(null);
  setGameState("start");
  setPanelOpen(!window.matchMedia("(max-width: 767px)").matches);
  setAnimKey((k) => k + 1);
}, [clearTimer, clearAnswerTimer, settings.timePerQuestion]);
```

Why this matches first-Start behavior:
- On first mount, `countdown` is initialized to `DEFAULT_SETTINGS.timePerQuestion` and `answerCountdown` is `null`. After restart we reset to the **current** `settings.timePerQuestion` (which respects any user customization).
- `activeQuestions = []` clears the stale question so the footer/card don't render leftover content during the brief transition.
- `setAnimKey` already bumps the question card animation; combined with the cleared questions, the next Start fetch + `deferCountdown` will produce a clean fade-in identical to the very first game.

### Files touched
- `src/components/TriviaGame.tsx` — extend `handleRestart` (~3 added lines, 1 dep added).

### Out of scope
- No changes to `handleStart`, `ResultScreen`, footer, or timers themselves.
- No change to the deferred countdown logic — it already works on first Start.

### Verification
Play a full game to the Result screen → click "Play Again" → Start screen appears with settings panel open (desktop) → click "Start Game" → new question loads, countdown bar starts full and ticks down smoothly, mascot animates — identical to the very first game of the session.

