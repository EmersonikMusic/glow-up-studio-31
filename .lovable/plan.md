## Footer pill: Skip + Back navigation, keyboard shortcuts, results list, responsive pill text

Adds Back (left of pill) and Skip (right of pause) circular buttons, wires ←/→ keyboard shortcuts, tracks per-question status (played / skipped), renders a results list on the completion screen with skipped questions greyed out, and reduces footer-pill text size on mobile so the new buttons don't cause truncation.

### 1. Footer layout

```text
[ Back ] [ ——— metadata pill (timer) ——— ] [ Pause/Play ] [ Skip ]
  40px              flex-1                       40px        40px
```

- Back: `ChevronLeft` (lucide), circular glass button matching Pause/Play (`rgba(0,0,0,0.35)` bg, gold icon, 1.5px white/18% border, `active:scale-95`, `hover:brightness-110`). OUTSIDE the pill on its left.
- Skip: `ChevronsRight` (lucide — chevron family is closer to existing iconography than the filled `FastForward`). Same circular glass style. Right of Pause/Play.
- Hidden (not just disabled) on edges: Back hidden on Q1, Skip hidden on the last question. Pill flexes to absorb freed space.
- ARIA: `Previous question` / `Skip question`.

### 2. Pill text sizing (responsive)

To prevent extra truncation now that two more buttons sit alongside the pill:

- Mobile (default): `text-[11px]` for the metadata line (questionIndex/total · category · difficulty) and the timer numeral inside the pill.
- `sm:` breakpoint and up: revert to existing `text-xs` (12px).
- `truncate` stays on the category span as the final safety net.
- Timer numeral keeps its `font-subheading font-bold` styling; only the size scales.

This is the only typography change — nothing else in the app touches `text-xs` in the footer.

### 3. Navigation behavior

Both buttons act in BOTH the question phase and the answer-reveal phase (reveal cancelled, fresh restart).

- **Skip** → mark the leaving question as `skipped`, advance to `questionIndex + 1`, restart its question countdown from full, `paused → false`.
- **Back** → return to `questionIndex - 1`, restart its question countdown from full, `paused → false`. Clears any prior status for the question being revisited so it can be replayed.
- Rapid presses are safe — existing `clearTimer()` + `setAnimKey(k=>k+1)` flow is idempotent.

### 4. Timer bar re-key

Reuse the existing `animKey` mechanism already wired for Settings → Restart:

```text
clearTimer() + clearAnswerTimer()
  → setCountdown(settings.timePerQuestion), setAnswerCountdown(null)
  → setAnimKey(k => k + 1)            ← forces remount, CSS keyframe restarts at 0%
  → setPaused(false), setGameState("playing")
  → deferCountdown(settings.timePerQuestion)
```

No changes to `GameFooter`'s bar element — its `key` already includes `animKey` and `questionIndex`.

### 5. Keyboard shortcuts

In the existing desktop power-user `keydown` listener in `TriviaGame.tsx` (gated to `pointer:fine` AND `innerWidth >= 1024`, skips when typing in inputs):

- `ArrowLeft` → Back (no-op on Q1).
- `ArrowRight` → Skip (no-op on last question).
- Update `KeyboardShortcutsHelp.tsx` shortcut list:
  ```text
  Space  Pause / Resume
  ←      Previous question
  →      Skip question
  S      Toggle settings
  M      Mute / Unmute
  ```

### 6. Per-question status + results list

Currently `ResultScreen` is a single "Trivia Complete!" card with Play Again + Change Settings CTAs. Extending it without disturbing that hero block.

- Add `questionStatuses: ("played" | "skipped")[]` state in `TriviaGame.tsx`, indexed by original question position. Default: all `"played"`. Skip mutates the leaving index to `"skipped"`. Back clears any status for the revisited index (reverts to `"played"` once finished).
- Result screen only renders when the player reaches the natural end (timer expired on the last question). Skip is hidden on the last question, so it can never end the game early.
- Pass `questions={activeQuestions}` and `statuses={questionStatuses}` into `ResultScreen`.
- New section in `ResultScreen` below the divider, above the CTAs:
  - Heading: "Your round" (font-heading, small uppercase, tracking-wider).
  - Vertical list, `max-h-[40vh]` with `overflow-y-auto` so 20+ questions don't push CTAs off-screen.
  - Each row: `{index + 1}. {question.text}` truncated to 1 line, status badge on the right.
  - Played row: white/85% text, default opacity.
  - Skipped row: white/40% text, no strikethrough (keeps it readable), small "Skipped" pill on the right (gold-on-transparent, `border: 1px solid rgba(255,255,255,0.12)`).

### 7. Analytics

Extend `ALLOWED_CLICK_EVENTS` in `src/lib/analytics.ts`:

- `click_skip_question`
- `click_back_question`

Fire via `trackClick` on each press. No schema change.

### 8. Files to change

- `src/components/GameFooter.tsx` — add `onSkip`, `onBack`, `canSkip`, `canBack` props; render Back outside the pill on the left and Skip after Pause/Play; apply `text-[11px] sm:text-xs` to the metadata spans and timer numeral inside the pill.
- `src/components/TriviaGame.tsx` — add `questionStatuses` state, `handleSkip` / `handleBack` callbacks (sharing an internal `navigateTo(index)` helper that does the clearTimer/animKey/defer dance), arrow-key handlers in the existing desktop shortcut effect, pass statuses to `ResultScreen`.
- `src/components/ResultScreen.tsx` — accept `questions` + `statuses`, render the per-question list section.
- `src/components/KeyboardShortcutsHelp.tsx` — add ← and → entries.
- `src/lib/analytics.ts` — add two allowed click event names.

### 9. Out of scope / worth flagging

1. **Skip on last Q** stays hidden — Skip will not double as a "finish now" button.
2. **Sound** — navigation today plays `transition` on questionIndex change; Skip/Back inherit that automatically.
3. **Results list overflow** — capped at ~40vh with internal scroll, CTAs stay pinned below.
