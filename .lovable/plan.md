## QA target

The animated countdown bar in `GameFooter` (the dark filling/depleting bar behind the question metadata). Specifically: **does it re-key and restart cleanly when the user is mid-play, opens Settings, changes settings, and confirms "Restart Game" in the new AlertDialog?**

Confirmed expected behaviors (not bugs):
- Opening Settings mid-game pauses the bar + numeric timer in sync.
- Closing the Settings panel without applying leaves the game paused — user must hit Resume. **Intended.**

## Code path under test

1. Mid-game: `gameState === "playing"`, bar animation running, `animKey = N`.
2. User opens Settings → `useEffect` at `TriviaGame.tsx:194` flips `paused = true` → `animationPlayState: "paused"` on the bar (`GameFooter.tsx:79`, `:626`).
3. User edits settings → confirm modal (`SettingsPanel.tsx:513`) → clicks "Restart Game" → `handleApply(newSettings)`.
4. `TriviaGame.tsx:397-409` → `setPanelOpen(false)` → `clearTimer()` / `clearAnswerTimer()` → `runFetchAndStart(newSettings)`.
5. `runFetchAndStart` (`:375-388`): `setCountdown(newSettings.timePerQuestion)` → `setActiveQuestions(data)` → `setQuestionIndex(0)` → `setAnimKey(k => k + 1)` → `setPaused(false)` → `setGameState("playing")` → `deferCountdown(newSettings.timePerQuestion)`.

The `animKey++` is what forces React to remount the bar element so its CSS keyframe animation restarts from frame 0 with the new `animation-duration` derived from `timePerQuestion`.

## QA scenarios to verify with Playwright (headless, against `localhost:8080`)

For each scenario: start a game, wait until the bar is mid-animation, open Settings, change `timePerQuestion`, confirm Restart, then sample the bar's computed width over time.

1. **Change `timePerQuestion` 10 s → 30 s mid-question.** Expect: bar resets to full, numeric countdown reads `30`, bar takes ~30 s to deplete, no visible jump/stutter from the prior animation state. animKey on the bar element should have incremented.
2. **Change `timePerQuestion` 30 s → 5 s mid-question.** Expect: bar resets to full, deplete duration ~5 s (not the old 30 s), bar and number stay aligned the whole way down.
3. **Same `timePerQuestion`, only change categories.** Expect: bar still re-keys (fresh full-bar start), doesn't continue from the paused fraction of the prior question.
4. **Trigger Restart during the answer-reveal phase** (between Q and next Q): expect both reveal timer and bar end cleanly, new game starts at Q1 with the bar full.
5. **Sanity: open Settings + click Cancel on the AlertDialog** (no settings change). Expect bar stays frozen at the same fraction it was at when paused; clicking Resume continues from that fraction.

## How I'll run it (in build mode)

- Write a single Playwright script under `/tmp/browser/countdown-qa/` that runs all five scenarios, screenshotting (a) the frozen bar at pause, (b) the bar immediately after Restart, (c) the bar ~halfway through the new duration, (d) the bar at expiry.
- For each scenario, log: `paused` class/state on the footer, the bar element's `data-anim-key` / React key proxy (read via the DOM's recreated node), measured deplete time, and the final numeric countdown.
- Report pass/fail per scenario with screenshot references. No code changes unless a scenario fails.

## Files

Read-only QA. No source files modified.
