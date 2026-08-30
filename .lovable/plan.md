# Neutral theme for /play/custom and /play/kids

Both the Custom and Kids landing pages should look like the homepage instead of borrowing a category theme.

## What changes

- Background: `/play/custom` and `/play/kids` use the homepage background (`hsl(var(--game-bg))`) instead of a category gradient.
- Mascot: both pages show the default Triviolivia mascot (`src/assets/Mascot.svg`) instead of a category mascot.
- Everything else stays the same: headline, START GAME CTA, links, panel-open behaviour on `/play/custom`, all game logic and tracking.
- The other 42 `/play/*` pages keep their category gradients and mascots.

## Technical notes

- `src/data/playSlugs.ts`: `presetGradient()` returns `undefined` for the custom preset and the Kids difficulty preset (`isKidsPreset`), so `PlayLandingScreen` falls back to `hsl(var(--game-bg))`. `presetMascot()` returns the default mascot import (`@/assets/Mascot.svg`) for those two presets.
- No change needed in `PlayLandingScreen.tsx` — it already falls back to `hsl(var(--game-bg))` when the gradient is undefined.

## Verification

- Load `/play/custom` and `/play/kids`: dark homepage background, default mascot, panel open only on `/play/custom`.
- Spot-check `/play/movies` and `/play/1980s`: gradients and category mascots unchanged.
