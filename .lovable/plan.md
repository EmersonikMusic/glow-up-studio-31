

## Plan: Auto-pause game when settings panel opens

### Behavior
When the settings drawer opens mid-game, automatically pause the game (timers freeze, mascot float pauses, footer pause icon flips to play). When the drawer closes without applying new settings, the game stays paused — the user must press play to resume. This keeps the pause/play state explicit and predictable.

### Change (single file: `src/components/TriviaGame.tsx`)
Add an effect that watches `panelOpen`. When it becomes `true` during an active game (`playing` or `answered`) and the game isn't already paused, set `paused = true`.

```ts
useEffect(() => {
  if (
    panelOpen &&
    (gameStateRef.current === "playing" || gameStateRef.current === "answered") &&
    !pausedRef.current
  ) {
    setPaused(true);
  }
}, [panelOpen]);
```

Why this works:
- `paused` already drives both timers (`pausedRef` short-circuits the interval ticks in `startCountdown` / `startAnswerCountdown`) and the mascot's `animationPlayState`.
- `GameFooter` already swaps the icon based on the `paused` prop, so no footer changes needed.
- Using refs in the condition avoids re-running when `gameState`/`paused` change — only the panel-open transition triggers the auto-pause.
- On Apply (mid-game restart), `handleApply` already sets `setPaused(false)`, so the new game starts un-paused as expected.
- On close-without-apply, the game stays paused; the user resumes manually via the footer play button. This is intentional — auto-resuming would feel jarring if the user briefly peeked at settings.

### Files touched
- `src/components/TriviaGame.tsx` — add one `useEffect` (~7 lines).

### Out of scope
- No changes to `GameFooter`, `SettingsPanel`, timers, or pause UI.
- Settings panel open on the Start screen is unaffected (no game in progress).

### Verification
Start a game → open Settings → timer freezes, mascot stops floating, footer icon shows play. Close panel without applying → still paused, press play to resume. Open Settings again → change a slider → Apply → confirm → new game starts running (not paused).

