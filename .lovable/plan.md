Adjust the "CUSTOMIZE YOUR EXPERIENCE" header in `src/components/SettingsPanel.tsx` so its gold-to-red gradient renders cleanly when the text wraps across two lines on desktop/tablet.

## Problem
The header is a single `<h2>` with `background-clip: text` and a vertical gradient. When the text wraps onto two lines, the gradient is stretched across the entire element height, so the color distribution is split awkwardly between the two lines.

## Proposed Fix
Apply `box-decoration-break: clone` (with `-webkit-box-decoration-break: clone`) to the heading. This makes each wrapped line render its own copy of the gradient, so both lines display the full red-to-yellow gradient consistently.

Optionally review the tablet font size (`sm:text-2xl`) to see if the heading can be kept on one line at common tablet widths without sacrificing readability.

## Files
- `src/components/SettingsPanel.tsx` — add the box-decoration-break property to the title styles and verify responsive breakpoints.

## Verification
- Build the project.
- Open the settings panel at desktop (~1280px) and tablet (~768px) widths.
- Confirm the gradient looks consistent across both lines of wrapped text and the design still follows the dark/glassmorphism theme.

## Technical Notes
- `box-decoration-break: clone` is supported in all modern browsers (Chrome, Firefox, Safari, Edge). The `-webkit-` prefix covers Safari.
- No backend changes are required.