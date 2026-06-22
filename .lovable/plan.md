## Goal

Make every gold text gradient in the app match the Primary CTA gradient direction and color stops, so headers read consistently across the product.

## Target gradient (from PrimaryCTA)

```
linear-gradient(0deg, #e93e3a 0%, #ed683c 11%, #f3903f 33%, #fdc70c 72%, #fff33b 100%)
```

Bottom red → top yellow, identical stops.

## Files to update (replace the existing `linear-gradient(160deg, hsl(42 100% 62%) 0%, hsl(35 90% 48%) 45%, hsl(28 90% 40%) 100%)` with the CTA gradient above)

1. `src/components/SettingsPanel.tsx` — line 401 (panel header), line 541 ("Restart with new settings?" AlertDialog title)
2. `src/components/AboutScreen.tsx` — line 89 ("Endless Trivia World!")
3. `src/components/HowToPlayScreen.tsx` — line 87 (How To Play header)
4. `src/components/TriviaGame.tsx` — line 578 (header)
5. `src/components/AppErrorBoundary.tsx` — line 36 (error title)
6. `src/pages/NotFound.tsx` — line 99 (404 title)

## Out of scope

- No layout, copy, spacing, or animation changes.
- Non-gradient gold accents (solid `hsl(var(--game-gold))` text, icons, borders) stay as-is.
- ResultScreen headers already use the CTA gradient — no change.

## QA after edits

Re-run the Playwright sweep on the six surfaces above (mobile + desktop) and screenshot each header to confirm the gradient direction/colors match the PLAY AGAIN button. Report results, then prompt to publish.
