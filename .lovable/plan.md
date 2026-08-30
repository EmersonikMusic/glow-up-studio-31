# Plan: Rename "Play all categories" link on Kids & Custom landing pages

## Current state
`src/components/PlayLandingScreen.tsx` (line 123) renders a "Play all categories" link to `/` on every `/play/<slug>` ad-landing page. The component already receives the `preset` prop and the helpers `isKidsPreset(preset)` and `isCustomPreset(preset)` exist in `src/data/playSlugs.ts`.

## Change
On the Kids and Custom landing pages only, render the link text as **"Play Another Game Mode"** instead of **"Play all categories"**. All other landing pages keep the existing text.

## Implementation
1. In `PlayLandingScreen.tsx`, import `isKidsPreset` and `isCustomPreset` from `@/data/playSlugs` (already imports `presetGradient`, `presetMascot`, `PlayPreset` from there).
2. Compute `const isKidsOrCustom = isKidsPreset(preset) || isCustomPreset(preset);`.
3. Replace the hardcoded `Play all categories` text with a conditional: `{isKidsOrCustom ? "Play Another Game Mode" : "Play all categories"}`.

No routing, styling, or behavior changes — only the link label for those two presets.

## Verification
- Playwright visit `/play/kids` and `/play/custom` → confirm link reads "Play Another Game Mode".
- Visit `/play/movies` → confirm link still reads "Play all categories".
- `npx tsgo --noEmit` passes.
