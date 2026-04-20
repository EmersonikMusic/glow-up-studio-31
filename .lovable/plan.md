

## Plan: Fix Restart Game CTA to match Start Game exactly

### Root cause
`<AlertDialogAction asChild>` from `src/components/ui/alert-dialog.tsx` injects `buttonVariants()` classes (`h-10`, `bg-primary`, `text-primary-foreground`, `px-4`, etc.) into the child via Radix's `Slot`. These get merged with `<PrimaryCTA>`'s gradient/`min-h-14`/`px-10` classes. Because Tailwind has no specificity tiebreaker for two conflicting utilities in a merged class string, the default button styles can win — overriding the gradient background, height, and padding. Same root issue would affect any future PrimaryCTA used inside AlertDialogAction.

The Cancel button has the analogous problem with `AlertDialogCancel asChild` (injects `outline` variant classes), but visually it currently still resembles the intended pill — we'll harden both the same way.

### Fix
Drop the Radix wrapper for the action/cancel buttons in `src/components/SettingsPanel.tsx` and instead use `AlertDialog`'s controlled `open` state, so we can render plain `<PrimaryCTA>` and the existing styled Cancel `<button>` directly without `AlertDialogAction`/`AlertDialogCancel` injecting variant classes.

**Changes — `src/components/SettingsPanel.tsx` only** (lines ~474-506):

1. Add local state: `const [confirmOpen, setConfirmOpen] = useState(false);`
2. Replace the `AlertDialogTrigger asChild` wrapper with `<PrimaryCTA onClick={() => setConfirmOpen(true)}>`.
3. Make `<AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>`.
4. In the footer, replace:
   - `<AlertDialogAction asChild><PrimaryCTA …/></AlertDialogAction>` → `<PrimaryCTA onClick={() => { setConfirmOpen(false); handleApply(); }}>Restart Game</PrimaryCTA>`
   - `<AlertDialogCancel asChild><button …/></AlertDialogCancel>` → plain `<button onClick={() => setConfirmOpen(false)} …>Cancel</button>` (same existing styling — `nav-btn rounded-full px-10 min-h-14 py-2 …`).
5. Keep the non-`hasChanges` branch unchanged.

This guarantees the Restart Game button renders with identical classes to Start Game / Play Again / Apply Settings (gradient, `min-h-14`, `px-10`, Rubik 800 uppercase, gold shadow), and Cancel keeps its glass-pill look without `buttonVariants({variant:"outline"})` leaking in.

### Files touched
- `src/components/SettingsPanel.tsx` (one section, ~30 lines)

### Out of scope
No changes to `alert-dialog.tsx` primitives, `PrimaryCTA`, theme, or anything else.

### Verification
Open settings mid-game → change a value → click Apply Settings → confirmation dialog: "Restart Game" must be pixel-identical to Start Game (orange→yellow gradient, purple border, white Rubik 800 uppercase, same height as Cancel pill beside it). Cancel closes the dialog; Restart Game restarts the game.

