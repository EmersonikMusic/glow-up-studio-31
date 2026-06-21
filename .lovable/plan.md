Final pre-deploy QA pass. Read-only — no code changes unless an issue is found, in which case I'll surface them and ask before fixing.

## Scope

Verify the recent UI work end-to-end:

1. **Restart AlertDialog (Settings → Restart Game)**
   - Backdrop is themed (game-bg @ ~70%, blurred), not pitch black
   - Popup max-w-xl with equal left/right inset; CTAs don't touch edges
   - Uniform p-6 / sm:p-8 padding; rounded-3xl
   - Mobile: CTAs stack; Desktop: side-by-side, centered

2. **Review Your Game Dialog**
   - Mobile 390px: full container in frame, 1rem gutter both sides, no horizontal scroll
   - Title "Review Your Game" fits on one line
   - Back arrow positioned top-right, not clipped at top
   - Thumbs up/down: adequate spacing (gap-2), tap targets not clipped
   - Click thumb → outline turns gold, NO gradient fill, bump animation still fires
   - Header gradient matches Primary CTA direction (bottom red → top yellow)

3. **Result Screen "Trivia Complete!" header**
   - Gradient direction/colors match Primary CTA gradient

4. **Regression check on adjacent surfaces**
   - About screen back-arrow still positioned correctly
   - Settings panel opens, sliders/toggles unaffected
   - Play Again → game restarts cleanly
   - No console errors during the flow

## Method

Drive Playwright headless against `localhost:8080` at:
- 390 × 801 (mobile, matches current preview)
- 1280 × 800 (desktop)

For each viewport, script the full path: Start → Settings → Restart dialog (screenshot) → close → play through 2 questions → End → Review Your Game (screenshot, click thumbs up + down, re-screenshot) → close → About (screenshot back arrow region).

Crop screenshots with image_tools--zoom_image to inspect: popup gutters, thumb fill state, header gradient direction, back-arrow position.

Capture browser console logs throughout; report any errors/warnings.

## Deliverable

A pass/fail report per check with screenshot evidence. If everything passes, give the green light to publish. If anything fails, list the issues and ask whether to fix before deploying.
