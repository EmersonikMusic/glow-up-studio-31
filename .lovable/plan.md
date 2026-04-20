
## Plan: Confirm-restart dialog, smooth load delay, footer cleanup, mascot centering

### 1. Confirmation dialog before mid-game restart (`SettingsPanel.tsx`)
Wrap the Apply button so that when `gameInProgress && hasChanges`, clicking it opens an `AlertDialog` first instead of calling `handleApply` directly.
- Use existing `@/components/ui/alert-dialog`.
- Title: "Restart with new settings?" Description: "Your current game will end and a new game will start with the updated settings."
- Cancel → close dialog, panel stays open. Confirm → call `onApply(...)` and `onClose()` (current behavior).
- When not in-game (or no changes), Apply behaves exactly as today (no dialog).

### 2. Settings drawer slides out immediately + countdown waits for question to render (`TriviaGame.tsx`)
Currently `handleApply` awaits the fetch before calling `setPanelOpen(false)` and `setGameState("playing")`, so the drawer appears stuck during the network call and the timer can start the same frame the question paints.

Fix:
- Call `setPanelOpen(false)` **immediately** (before the await) so the drawer starts sliding out right away.
- Keep `setLoading(true)` during the fetch (existing toast/loading still applies).
- After `setActiveQuestions(data)` and `setGameState("playing")`, **defer** `startCountdown(...)` so it only begins once the question is on screen:
  - Use a small delay that covers the panel slide-out + first paint: `requestAnimationFrame` → `requestAnimationFrame` → `setTimeout(..., 350)` (≈ matches the existing panel transition + ensures the new question text is fully visible before the bar starts depleting).
- Apply the same "wait for paint" pattern to `handleStart` for consistency, so the very first game also doesn't start the bar before the card is on screen.

No changes to timer logic, scoring, or the fetch itself.

### 3. Remove Era from footer pill (`GameFooter.tsx`)
Delete the trailing era separator + era span (lines that render `· {question.era}`):
```tsx
<span className="relative z-10 opacity-50 text-white hidden md:inline">·</span>
<span className="relative z-10 hidden md:inline text-white truncate">{question.era}</span>
```
Keep Q#/total · category · difficulty · timer.

### 4. Visually center mascot on desktop (`TriviaGame.tsx`)
Currently the mascot column is `w-[30%]` with `items-center justify-center`, which centers within the 30% column — but visually it can read off-center because the round bg is bounded by a fixed clamp size and the question card is a tall card on the left.

Tighten centering by:
- Removing the float wrapper's reliance on column width and instead centering the round mascot within the **available right area** between the card and the screen edge using `flex justify-center items-center` (already present) **plus** ensuring no padding on the right column. Confirm `main` has `px-2 sm:px-6 md:px-8` — the right column inherits that, which pushes the mascot left of true center. Add `md:pr-0` to the right column wrapper (or remove its share of horizontal padding) so the mascot is centered between the card's right edge and the viewport's right edge.
- No size changes to the mascot itself.

### Files touched
- `src/components/SettingsPanel.tsx` — wrap Apply in AlertDialog when in-game + dirty.
- `src/components/TriviaGame.tsx` — close panel before await; delay countdown until paint; right-column padding tweak for mascot centering.
- `src/components/GameFooter.tsx` — remove era separator + span.

### Out of scope
- No changes to slider visuals, timers' duration, fetch logic, or other components.

### Verification
End-to-end: start a game → open Settings mid-game → change a slider → click "Apply New Game Settings" → confirm in dialog → drawer slides out instantly, brief loading, new question appears, then countdown starts cleanly. Footer shows only Q#, category, difficulty, timer. On desktop, mascot sits visually centered between the card edge and the right edge of the screen.
