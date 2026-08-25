# Move homepage "Earth's Deepest" tagline closer to the logo

## Problem
The previous turn applied the "move tagline closer to logo" edit to the wrong file — the Remotion reel end card (`remotion/src/MascotShow.tsx`) — instead of the homepage. The homepage tagline (in `src/components/StartScreen.tsx`) is the intended target, and it currently sits too far below the logo (`mt-2` = 8px gap, plus whitespace inside the SVG viewBox). The user wants it at least ~20px closer.

## Changes

### 1. Revert the erroneous reel edit
File: `remotion/src/MascotShow.tsx` (line 229)
- Change `marginTop: -10` back to `marginTop: 12` (the value before the mistaken edit).
- This file is **not** re-rendered — the last successful render still reflects the original `12` spacing, so reverting the source restores consistency without a re-render.

### 2. Bring the homepage tagline closer to the logo
File: `src/components/StartScreen.tsx` (lines 95–96)
- The curved tagline container currently uses `mt-2` (8px). Replace it with a small negative top margin (e.g. `-mt-3`, -12px) so the net shift upward is ~20px, pulling the arc text visibly nearer the logo's bottom curve without overlapping it.
- If the gap is still too large after a quick visual check, tighten further (toward `-mt-4`).

## Verification
- Visually confirm in the preview that the tagline sits closer to the logo on desktop and mobile, with no overlap.
- Confirm the reel source is back to `marginTop: 12` (no visual change to the reel).
