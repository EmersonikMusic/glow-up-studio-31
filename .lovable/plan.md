

## Polish Refinements

Five small fixes across gameplay, footer, end screen, and keyboard handling.

### 1. Remove mascot wobble during last-5s urgency
**`src/components/TriviaGame.tsx`** — In the urgency effect (line ~278), stop setting `mascotState` to `"urgent"`. Mascot stays `"idle"` during countdown. The `celebrate` (reveal) and `paused` states remain unchanged. Optionally drop `urgent` from `MascotState` type, but keeping it costs nothing — leave it for future use.

### 2. Remove all haptic feedback
- **`src/components/TriviaGame.tsx`** — remove `import { vibrate }` and the two `vibrate(8)` / `vibrate(30)` calls.
- **`src/components/ResultScreen.tsx`** — remove `import { vibrate }` and the `vibrate([50,60,50])` call.
- **`src/components/GameHeader.tsx`** — remove `<HapticsToggle />` mount and its import.
- Delete `src/components/HapticsToggle.tsx` and `src/lib/haptics.ts` (no remaining consumers).

### 3. Remove shimmer overlay from footer pill
**`src/components/GameFooter.tsx`** — delete the `{isUrgent && <div className="shimmer-overlay" … />}` block (lines ~79-85). Timer color shift + digit pulse remain (less distracting visual cue is preserved). Leave the `.shimmer-overlay` CSS in place — harmless if unused.

### 4. End screen "Change Settings" CTA restyling
**`src/components/ResultScreen.tsx`**:
- Remove `Settings as SettingsIcon` import and the `<SettingsIcon />` inside the button.
- Replace `SecondaryCTA` with an inline `<button>` that mirrors the **Cancel button** in `SettingsPanel.tsx` (lines 486-496):
  - `className="nav-btn rounded-full px-10 min-h-14 py-2 font-body font-bold uppercase tracking-wider text-xl transition-all duration-200 active:scale-95"`
  - Style: `background: rgba(255,255,255,0.08)`, `border: 1px solid rgba(255,255,255,0.15)`, `color: hsl(var(--game-gold))`
- Wrap both CTAs so they share the **same width** as Play Again. Since `PrimaryCTA` is content-sized, set both buttons to `min-w-[240px]` (or wrap in a fixed-width container with `w-full` children) so they render at identical width regardless of label length. Actual approach: give both the Play Again button and the new Change Settings button the same `min-w-[240px]` class so widths match.
- `SecondaryCTA.tsx` becomes unused — leave it on disk (reusable), don't delete.

### 5. Keyboard shortcuts: fix Mute, Next, and gate to true desktop
**`src/components/TriviaGame.tsx`** desktop shortcuts effect (lines ~222-250):

a. **Gate to desktop only** — add a guard at the top of the handler:
```
const isTouchOrSmall =
  window.matchMedia("(pointer: coarse)").matches ||
  window.innerWidth < 1024;
if (isTouchOrSmall) return;
```
This blocks phones AND tablets (iPad is `pointer: coarse`; Surface-style hybrids with a real keyboard pass the width check).

b. **Fix Next firing only once per question** — current code already guards on `gameStateRef.current === "answered"` and calls `advanceOrFinishRef.current?.()`, which should only fire once per "answered" phase. The reported "only works once *per question*" likely means it works on Q1's reveal, then never again. Root cause: the `advanceOrFinishRef` is updated each render via the second effect — confirmed working. The actual bug: after pressing N, `gameState` flips back to `"playing"` and the next reveal should re-enable it. **Verify by adding** a debug check; if still broken, the issue is `advanceOrFinish`'s stale `isLast` closure. Switch `advanceOrFinish` to read `questionIndex` and `activeQuestions.length` from refs (add `questionIndexRef` and `activeQuestionsRef` updated via `useEffect`) so the callback identity stays stable and always sees current values.

c. **Fix Mute toggling only once** — current code uses dynamic `import("@/lib/sound").then(m => m.toggleMuted())`. Two issues:
- `toggleMuted` updates the module-level `muted` variable but **never notifies React**, so `SoundToggle`'s `useSound()` `muted` state goes stale. After first toggle, the icon is wrong but more importantly the next `M` press still toggles the underlying state — so it *does* toggle, just invisibly.
- Replace the dynamic import with a top-level `import { toggleMuted } from "@/lib/sound"`.
- To fix the React sync, broadcast a custom event from `setMuted` in `sound.ts`: dispatch `window.dispatchEvent(new CustomEvent("to:sound-muted-changed"))` after mutating, then `useSound.ts` listens for it and re-reads `isMuted()`. This keeps the toggle button icon in sync regardless of trigger source (header click or `M` key).

### Files to edit
- `src/components/TriviaGame.tsx` — remove urgent mascot, vibrate calls, gate shortcuts to desktop, stabilize `advanceOrFinish` via refs, switch to top-level `toggleMuted` import.
- `src/components/GameFooter.tsx` — remove shimmer overlay block.
- `src/components/ResultScreen.tsx` — remove vibrate + settings icon, restyle Change Settings as Cancel-style button, equalize CTA widths.
- `src/components/GameHeader.tsx` — remove `HapticsToggle` mount + import.
- `src/lib/sound.ts` — dispatch custom event on `setMuted` so React stays in sync.
- `src/hooks/useSound.ts` — listen for the custom event, re-read mute state.

### Files to delete
- `src/components/HapticsToggle.tsx`
- `src/lib/haptics.ts`

