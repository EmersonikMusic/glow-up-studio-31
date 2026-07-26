## Goal
On desktop/tablet the "CUSTOMIZE YOUR EXPERIENCE" heading wraps to two lines, but the red→yellow gradient is painted once across the whole block, so line 1 is yellow and line 2 is orange. Each line should carry the full gradient.

## Why the last fix failed
`box-decoration-break: clone` only affects fragmented **inline** boxes. The heading is a block-level `<h2>`, so the property has no effect and the background is still painted once over the full block.

## Fix
In `src/components/SettingsPanel.tsx`, split the heading into explicit line spans instead of relying on natural wrapping:

- Keep the `<h2>` as a plain container (no gradient background on it).
- Render two `block` child spans: `CUSTOMIZE YOUR` and `EXPERIENCE`, each with its own gradient background + `background-clip: text`.
- Move the gradient styles into a small shared style object so both spans stay identical.
- On mobile, where the heading currently fits on one line, force a single line by making the spans `inline` at the `sm`-and-below breakpoint (or keep two lines if it no longer fits at `text-xl`) — I'll verify the mobile 390px render and keep the current single-line appearance.

## Verification
Playwright screenshots at 1280px (desktop), 834px (tablet), and 390px (mobile) to confirm each line runs red→yellow and mobile stays on one line.
