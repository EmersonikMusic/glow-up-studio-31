## Goals

1. Pop-up windows (`AlertDialog` / `Dialog`) need uniform padding so CTAs don't kiss the edge on desktop/tablet.
2. On mobile, the "Review Your Game" dialog header wraps onto 2 lines and the back-arrow sits flush with (or above) the viewport edge. Match the About screen's safe-area positioning.

## Scope

- `src/components/SettingsPanel.tsx` — Restart-with-new-settings `AlertDialog`.
- `src/components/ResultScreen.tsx` — Review Your Game `Dialog`.
- (Optional) `src/components/ui/alert-dialog.tsx` — only if needed to apply themed padding without per-instance overrides. Prefer per-instance overrides to limit blast radius.

Out of scope: copy changes, button styles, anything outside these two pop-ups, and any of the previously-locked screens (Pause Overlay, Settings Panel section header labels, 404).

## Changes

### 1. Restart with New Settings — `SettingsPanel.tsx` (lines 524–561)

- Override `AlertDialogContent` with themed glass styling and a generous, uniform inset on all sides, e.g.:
  - `className="p-6 sm:p-8 gap-5 max-w-md rounded-2xl"` plus the existing app glass background tokens (matching About / Review dialogs — `rgba(0,0,0,0.45)` bg, `1.5px` white-18% border, blurred backdrop).
- Update `AlertDialogFooter` to `flex flex-col sm:flex-row sm:justify-center gap-3` so the two CTAs stay centered with breathing room on both sides (prevents "Restart Game" touching the right edge).
- Keep title and description text styles as already standardized.

### 2. Review Your Game — `ResultScreen.tsx` (DialogContent + DialogHeader)

- **Title wrap (mobile):** change `DialogTitle` from `text-4xl` to `text-3xl sm:text-4xl` so "Review Your Game" stays on one line at 390px. Heading style/gradient/casing unchanged.
- **Back arrow cut off (mobile):** the dialog currently relies on default `top-[50%] translate-y-[-50%]`, which on short viewports clips the top. Fix:
  - Add responsive sizing/positioning on `DialogContent`: `top-4 sm:top-[50%] translate-y-0 sm:-translate-y-1/2 max-h-[calc(100dvh-2rem)] overflow-hidden flex flex-col` (left/right inset already handled by `max-w-2xl` + screen padding; add `mx-4`).
  - Bump header top padding from `pt-8` to `pt-10` to match About (gives the absolute `top-4 right-4` back button the same safe gap as About).
  - Make the table body the flex child that scrolls (`flex-1 min-h-0`) instead of relying on a fixed pixel max-height, so the dialog always fits the viewport with the back arrow visible.
- Uniform padding: confirm `px-6 md:px-8` header and `px-3 sm:px-6 md:px-8 pb-6` body padding remain symmetric; bump mobile bottom padding to `pb-6` (already) and ensure top inset isn't zero on mobile.

## Verification

- Drive Playwright at 390×801 and 1280×800:
  - Open Settings mid-game, change a setting, click Apply → screenshot the Restart confirm dialog. Verify equal padding on all four sides and CTAs not touching edges.
  - Finish a game → open "Review Your Game" → screenshot at mobile and desktop. Verify title is one line on mobile, back arrow is fully visible with the same offset as About, and the table scrolls inside the dialog.
