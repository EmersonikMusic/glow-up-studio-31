## Issues in the screenshot

1. **Backdrop is too dark.** The default `AlertDialogOverlay` ships with `bg-black/80`, which crushes the Settings drawer and the entire page behind it. The Review-Your-Game `Dialog` uses an app-themed overlay (`bg-[hsl(var(--game-bg))]` with blurred blobs) — the Restart dialog should match that softer treatment.
2. **CTAs still touch the popup edge.** Cancel + Restart Game together are wider than `max-w-md` (~448px) minus `p-8` inset. With `sm:justify-center`, they stretch to fill, so "Restart Game" hits the inner border on the right. The popup needs to be wider so the buttons sit centered with real breathing room.

## Fix (no other changes)

Scope: `src/components/SettingsPanel.tsx` — the Restart AlertDialog only.

### a. Lighter, themed backdrop
Render a custom overlay via `AlertDialogPortal` + `AlertDialogOverlay` (instead of the auto overlay from `AlertDialogContent`) using the same pattern as the Review dialog: `bg-[hsl(var(--game-bg))]` opacity ~0.7 with a subtle backdrop blur. Net effect: the Settings drawer behind reads clearly instead of being blacked out.

Alternative considered: keep auto overlay but pass a softer class. Rejected — `AlertDialogContent` mounts its own `AlertDialogOverlay` internally with no `className` hook, so we'd be stacking two overlays. The portal-based approach is cleaner.

### b. Wider popup, uniform padding preserved
- Bump `max-w-md` → `max-w-xl` (576px) so the two CTAs fit side by side with margin on both sides.
- Keep `p-6 sm:p-8` uniform inset (same on top/right/bottom/left).
- Footer stays `flex flex-col sm:flex-row sm:justify-center gap-3` so CTAs are centered and never edge-aligned.

### c. (Unchanged) Title, description, glass styling, mobile single-column footer.

## Verification

- Drive Playwright at 1280×800 and 390×801: open Settings mid-game → change a setting → click Apply.
- Screenshot the confirm dialog and crop the right edge of "Restart Game" to confirm equal gap to the popup border on both sides.
- Confirm the Settings drawer behind the popup is still visible (not crushed by the overlay).
