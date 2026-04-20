
## Plan: Fix slider focus shadow + seamless re-start with new settings

### 1. UI fix — slider drop shadow on interaction
The custom `.step-slider` thumb has a `box-shadow: 0 2px 10px rgba(0,0,0,0.5)`. When the user clicks/focuses the range input, the browser adds its own default focus outline/shadow on top, causing the "odd" change. There are no `:hover/:active/:focus` rules defined for `.step-slider` thumbs.

**Edit `src/index.css`** — add focus/active rules so the shadow stays identical across all states:

```css
.step-slider:focus,
.step-slider:focus-visible,
.step-slider:active {
  outline: none;
  box-shadow: none;
}
.step-slider::-webkit-slider-thumb:hover,
.step-slider::-webkit-slider-thumb:active,
.step-slider:focus::-webkit-slider-thumb {
  box-shadow: 0 2px 10px rgba(0,0,0,0.5); /* same as default */
}
.step-slider::-moz-range-thumb:hover,
.step-slider::-moz-range-thumb:active,
.step-slider:focus::-moz-range-thumb {
  box-shadow: 0 2px 10px rgba(0,0,0,0.5);
}
```

This locks the thumb shadow to the default value in every state and removes the browser focus outline on the input itself. No layout/color changes.

### 2. Functionality — "Apply New Game Settings" mid-game restart
Currently the Apply button's label correctly switches to "Apply New Game Settings" when `gameInProgress && hasChanges`, but `handleApply` in `TriviaGame.tsx` only calls `setSettings(newSettings)` — it doesn't restart the game. So the new settings sit unused until the player finishes manually.

**Edit `src/components/TriviaGame.tsx`** — make `handleApply` restart the game when one is already in progress:

```ts
const handleApply = useCallback(async (newSettings: GameSettings) => {
  setSettings(newSettings);
  const wasInGame = gameStateRef.current === "playing" || gameStateRef.current === "answered";
  if (!wasInGame) return;

  // Seamless restart with new settings
  clearTimer();
  clearAnswerTimer();
  setLoading(true);
  try {
    const data = await fetchAndStartGame(newSettings);
    if (!data.length) {
      toast.error("No questions matched your filters. Try widening them.");
      return;
    }
    setActiveQuestions(data);
    setQuestionIndex(0);
    setScore(0);
    setAnimKey((k) => k + 1);
    setPaused(false);
    setPanelOpen(false);
    setGameState("playing");
    startCountdown(newSettings.timePerQuestion);
  } catch (err) {
    console.error("fetchAndStartGame failed:", err);
    toast.error("Couldn't load questions. Check your connection or try again.");
  } finally {
    setLoading(false);
  }
}, [clearTimer, clearAnswerTimer, startCountdown]);
```

Notes:
- Reuses `gameStateRef` (already maintained) so we don't add `gameState` to deps and re-create the callback every render.
- Closes the settings panel on success — same UX as the initial Start.
- Uses the freshly-passed `newSettings` for the fetch + countdown to avoid stale-state issues.
- If not in a game, behaves exactly as today (just stores settings).

### Files touched
- `src/index.css` — add focus/active rules for `.step-slider`.
- `src/components/TriviaGame.tsx` — extend `handleApply` to restart in-game.

### Out of scope
- No changes to `SettingsPanel` (label logic already correct).
- No changes to gameplay timers, scoring, or other UI.

### Verification
End-to-end: start a game → open Settings mid-game → change # questions or filters → button shows "Apply New Game Settings" → click → panel closes, new game begins seamlessly with new settings, timers respect new durations. Also: drag any slider — thumb shadow stays identical when idle, hovered, and dragged.
