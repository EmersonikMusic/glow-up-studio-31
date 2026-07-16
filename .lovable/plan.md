No, this does not break Google's branding guidelines. Google's official docs allow custom buttons and explicitly state that the button width can be set anywhere from 40px to 400px. Scaling the official Google pill asset proportionally (keeping the same width-to-height ratio) is compliant as long as the Google logo, text, and dark theme are preserved.

The reason the Google button stayed 180px wide is that `object-contain` forces the SVG to keep its intrinsic 180x40 size. To fix it, the button should be allowed to fill the container width and the SVG height should scale automatically with its aspect ratio.

Changes:

1. **File: `src/components/AuthModal.tsx`**
   - Keep the Google button wrapper as `w-full` so it spans the same `max-w-[320px]` container as the CTA and form fields.
   - Remove the fixed `40px` height from the Google button so the SVG can determine the height.
   - Change the Google button image from `object-contain` to `w-full h-auto` so it scales up to the full container width while preserving the official 180:40 (4.5:1) aspect ratio.
   - Keep the Apple button unchanged — it already fills the container width at 40px.

Result:
- The Google button will match the CTA width on every breakpoint.
- Its height will scale proportionally per Google's official ratio (e.g., ~71px tall at a 320px container width).
- The branded pill shape, logo, and text remain intact and compliant.

No other files or backend changes are needed.