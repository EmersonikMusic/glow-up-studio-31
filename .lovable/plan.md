## Problem

When **Play Again** is pressed after a finished game, the first question of the new game flashes straight into the "answered" reveal state — the timer bar isn't reset and the question/answer pacing is broken.

### Root cause

In `TriviaGame.tsx`, when the last question's question-phase timer hit `0` it triggered the `gameState === "answered"` transition, leaving `countdown` stuck at `0` for the rest of the game. `handlePlayAgain` then:

1. Sets `gameState` → `"playing"` immediately.
2. Defers `startCountdown(...)` by ~350ms (two rAFs + 350ms timeout) so the bar animation can sync to the card slide-in.

During that gap, `countdown` is still `0` and this effect fires immediately:

```ts
useEffect(() => {
  if (countdown === 0 && gameState === "playing") setGameState("answered");
}, [countdown, gameState]);
```

→ The very first question jumps to the answer reveal before the timer ever starts. Initial **Start** doesn't hit this because `countdown` is initialized to `settings.timePerQuestion` (non-zero) on first mount.

The user also wants a **3-2-1 countdown** before the new game begins.

## Plan

### 1. Fix the Play Again reset (`src/components/TriviaGame.tsx`)

In `runFetchAndStart`, before flipping to `"playing"`:
- `setCountdown(newSettings.timePerQuestion)` — primes the timer so the auto-answer effect can't fire.
- Ensure `clearAnswerTimer()` runs (it sets `answerCountdown` back to `null`, restoring question-phase styling in the footer bar).
- Reset milestone tracking: `milestonesFiredRef.current.clear()` and `lastCategoryRef.current = null` so sparkles/particles behave like a fresh game.

This alone fixes the "answer flashes immediately" bug and makes the timer bar restart cleanly (the bar's `key` already includes `questionIndex` + phase, so resetting index to 0 + phase to "question" re-mounts the animation).

### 2. Add a 3-2-1 pre-game countdown

Add a new game state `"countdown"` to the `GameState` union. Flow:

```text
finished ──Play Again──▶ loading(fetch) ──▶ countdown(3→2→1) ──▶ playing
start    ──Start──────▶ loading(fetch) ──▶ countdown(3→2→1) ──▶ playing
```

- After `fetchAndStartGame` resolves successfully, set `gameState = "countdown"` instead of `"playing"`.
- Render a new `<PreGameCountdown />` overlay (full-screen, glassmorphism, same background gradient as first question's category) that counts `3 → 2 → 1 → Go!` with a 1s-per-step animation. Use existing animation primitives (`animate-soft-zoom-in` / `animate-spring-rise`) for each number and the existing `tick` / `reveal` sounds for the steps and "Go!".
- When the countdown finishes, set `gameState = "playing"` and call the existing `deferCountdown(settings.timePerQuestion)` so the question card and timer bar start in perfect sync.
- Header, footer, and settings panel stay hidden during the countdown (or the footer renders but with the question-phase bar paused) so the player isn't distracted.

Apply the countdown to **both** Play Again and the initial Start so the experience is consistent (matches the user's "before the new game starts" wording).

### 3. Files touched

- `src/components/TriviaGame.tsx` — state changes above + render the overlay.
- `src/components/PreGameCountdown.tsx` *(new)* — small presentational component that owns the 3-2-1 visual + `onComplete` callback.

No changes to `triviaApi.ts`, settings, hooks, or backend. Pure UI/state fix.

### 4. Verification

- Start a game, finish it, press Play Again → first question displays for the full `timePerQuestion`, then reveals the answer for `timePerAnswer`, then advances. Timer bar animates from full → empty on question phase and empty → full on answer phase.
- Pre-game 3-2-1 plays before both initial Start and Play Again.
- Mid-game **Apply** in settings panel also goes through the countdown (since it shares `runFetchAndStart`).