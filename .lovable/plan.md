## Match Google and Apple button widths

Apple's SDK caps `data-width` at 375px, and we already render Apple at 375×48. Google is currently `w-auto` on the SVG asset so its width follows the asset's intrinsic aspect ratio (~380–400px depending on the SVG). Result: the two buttons don't line up.

Cleanest fix: pick 375px as the shared target width, center both in the stack.

### Changes to `src/components/AuthModal.tsx`

Google button:
- Wrap the outer `<button>` with `mx-auto` and set `style={{ width: 375, maxWidth: "100%" }}` so it renders identically to Apple's container.
- Change the inner `<img>` from `h-12 w-auto` to `h-12 w-full object-contain` so the Google pill SVG scales down to fill the 375px width while preserving its aspect ratio (the asset is already a pill shape at ~48px tall).
- If needed, use `object-cover` instead of `object-contain` — I'll pick `contain` first and adjust if the pill visibly shrinks.

Apple button:
- No change — already 375px wide, centered.

Stack container:
- `flex flex-col gap-3` already centers via each child's `mx-auto`. No change needed.

### Verification

- Playwright: open modal, screenshot the two buttons side-by-side, confirm identical width and vertical alignment in both Sign In and Sign Up modes.
- Typecheck.

### Out of scope

- Changes to the Google asset itself.
- Changes to the Apple SDK config.
