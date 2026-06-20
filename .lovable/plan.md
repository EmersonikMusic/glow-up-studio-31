## Goal
Make the background behind the game review modal the same as the About screen, instead of the current dark scrim.

## Problem
The review modal uses `DialogOverlay` from `src/components/ui/dialog.tsx`, which has `bg-black/80`. That dark scrim makes the whole review screen look much darker than the About screen, even though the modal card itself uses the same glass styling as About.

## Plan
1. **Make the dialog overlay customizable**
   - Update `src/components/ui/dialog.tsx` so `DialogContent` accepts an `overlayClassName` prop and forwards it to `DialogOverlay`.
   - This keeps the default dark overlay for any other dialogs while letting the review modal override it.

2. **Style the review modal overlay like AboutScreen**
   - In `src/components/ResultScreen.tsx`, pass the new `overlayClassName` to the review `DialogContent`.
   - Set the overlay background to `hsl(var(--game-bg))` (same as AboutScreen).
   - Add the same ambient gradient blobs as AboutScreen (purple and blue radial gradients) using Tailwind pseudo-element classes on the overlay.

3. **Verify**
   - Open the review modal in the preview and confirm the background matches the About screen's look.

## Files to change
- `src/components/ui/dialog.tsx`
- `src/components/ResultScreen.tsx`

No other dialogs in the app are affected, and the review modal card/table content stays unchanged.