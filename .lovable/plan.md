

## Plan: CTA consistency + liquid-glass About/HowToPlay

### 1. Unify PrimaryCTA sizing — fits on one line, grows if it must

`src/components/PrimaryCTA.tsx`:
- Replace fixed `h-14` with `min-h-14` + `py-2` so the button keeps its shape when content fits one line, but grows in height (preserving vertical padding) if it ever wraps to two lines.
- Keep `px-10` horizontal padding but add `whitespace-nowrap` as the default (single-line by default — covers "Start Game", "Play Again", "Apply Settings", "Back to Game", "Restart Game"). Anywhere a future caller needs wrap, they can pass `whitespace-normal` via `className`.
- Result: every PrimaryCTA across the app shares the exact same height/padding/typography.

### 2. Remove the size override on the dialog "Restart Game" CTA

`src/components/SettingsPanel.tsx` (line 500):
- Drop `className="h-11 px-8 text-base"` from the `<PrimaryCTA>` inside `AlertDialogAction`. It will then match the standard PrimaryCTA height/padding (same as Play Again, Apply Settings, Back to Game).
- Cancel button (line 488–497): bump from `h-11` → `min-h-14` `py-2` and align font-size with the secondary nav-btn pill so its height matches the new Restart Game button — they sit side by side.
- No text-wrap needed: "Restart Game" and "Cancel" both fit one line.

### 3. Apply mobile-drawer "liquid glass" look to About + HowToPlay (and confirm desktop drawer already matches)

The mobile **SettingsPanel** drawer style is:
```
background: rgba(0, 0, 0, 0.25)
backdropFilter: blur(24px)
border: 1.5px solid rgba(255, 255, 255, 0.18)
```
The desktop SettingsPanel drawer already uses the same values — **no change needed there.**

`src/components/AboutScreen.tsx` and `src/components/HowToPlayScreen.tsx`:
- Change the card `background` from `rgba(0, 0, 0, 0.45)` → `rgba(0, 0, 0, 0.25)` (both mobile and desktop branches).
- Add explicit inline `backdropFilter: "blur(24px)"` (the existing `backdrop-blur-xl` Tailwind class is roughly 24px; replacing with the inline value keeps it identical to the drawer for visual parity and removes any class/inline ambiguity).
- Keep mobile border = none (full-screen takeover, same as drawer's lack of side borders) but ensure desktop border stays `1.5px solid rgba(255, 255, 255, 0.18)` (already correct).
- Box-shadow stays as-is (depth cue is intentional).

### Files touched
- `src/components/PrimaryCTA.tsx`
- `src/components/SettingsPanel.tsx` (dialog buttons only)
- `src/components/AboutScreen.tsx`
- `src/components/HowToPlayScreen.tsx`

### Out of scope
No changes to colors, copy, layout, animations, drawer behavior, or any other component.

### Verification
- Resize from 1440px → 390px: every PrimaryCTA ("Start Game", "Apply Settings", "Play Again", "Back to Game", "Restart Game", Login submit) renders at the same height, single line, identical padding.
- Open mid-game settings → make a change → click Apply Settings → dialog shows Restart Game (gradient) and Cancel (glass pill) at matching heights.
- Open About and How Do I Play on desktop and mobile: card background looks like the settings drawer (lighter translucent black with strong blur), not the previous near-opaque dark.

