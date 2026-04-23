

## Refinements

### 1. Remove "Next" keyboard functionality
**`src/components/TriviaGame.tsx`** — Delete the `ArrowRight` / `KeyN` block from the desktop keyboard shortcuts effect (lines 240-245). The `handleNext` callback and the answer-expiry auto-advance remain (clicking Next button and timed reveal still work).

**`src/components/KeyboardShortcutsHelp.tsx`** — Remove the `["→ or N", "Next question"]` entry from the shortcuts list.

### 2. Hide shortcuts pill on tablet
**`src/components/KeyboardShortcutsHelp.tsx`** — Replace `useIsMobile()` (which only triggers below 768px) with a true desktop check matching the keyboard handler gate:
```ts
const isTouchOrSmall =
  window.matchMedia("(pointer: coarse)").matches ||
  window.innerWidth < 1024;
if (isTouchOrSmall) return null;
```
Wrap in a small `useState` + `useEffect` so it re-evaluates on resize/orientation change. This hides the icon on phones AND tablets (iPads register as `pointer: coarse`); only true desktops with mouse + ≥1024px width see it.

### 3. Revise pause overlay
**`src/components/PauseOverlay.tsx`**:
- Remove `backdropFilter` / `WebkitBackdropFilter` properties (no glass blur).
- Keep dimming: `background: rgba(0, 0, 0, 0.45)` stays.
- Replace the centered flex layout with a `flex flex-col justify-between` so:
  - "Paused" text sits 28px from the **top** of the card area (`paddingTop: 28px`).
  - Hint line sits 28px from the **bottom** of the card area (`paddingBottom: 28px`).
- Update hint text to: `PRESS SPACE OR START BUTTON TO RESUME` (uppercase already applied via existing class).
- Remove the responsive `hidden sm:inline` wrapper around "space or" — show the full string on all sizes.

### 4. Remove mascot tilt on pause
**`src/components/MascotSvg.tsx`** — Change the `paused` entry in `stateClass` from `"animate-mascot-droop"` to `""` (empty). The mascot remains static (no animation) when paused, but no tilt/droop is applied.

The `paused` state value itself stays in the type for future use; only the visual animation is dropped. Optionally also delete the `animate-mascot-droop` keyframe from `src/index.css` (harmless if left in).

### 5. Calmer countdown sound
**`src/lib/sound.ts`** — Soften the `tick` case in the `play` switch:
- Reduce frequency from `880 Hz` to `520 Hz` (warmer, less piercing).
- Reduce duration from `0.08s` to `0.12s` (gentler decay tail).
- Reduce peak from `0.5` to `0.32` (quieter overall).
- Keep `triangle` waveform (smoother harmonics than sine for this pitch).

Result: a soft, low woodblock-style "tock" instead of the current sharp ping.

### Files to edit
- `src/components/TriviaGame.tsx` — drop Next keyboard handler.
- `src/components/KeyboardShortcutsHelp.tsx` — drop Next entry; gate to true desktop (≥1024px + fine pointer).
- `src/components/PauseOverlay.tsx` — remove blur, reposition text, update hint copy.
- `src/components/MascotSvg.tsx` — remove paused animation class.
- `src/lib/sound.ts` — soften tick tone.

