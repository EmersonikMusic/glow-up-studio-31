# Move "Earth's Deepest Trivia Source" tagline closer to the logo

## Context
In `remotion/src/MascotShow.tsx`, the `EndCard` stacks three elements vertically:
1. Logo image (`logo.svg`)
2. Curved tagline SVG — `marginTop: 30` (line 229)
3. "Play now at" URL block — `marginTop: 64` (line 261)

The tagline currently has a 30px gap below the logo, which the user reports looks too far from the logo compared to before.

## Change
Reduce the tagline's `marginTop` from `30` to `12` so it sits closer to the logo. Leave the URL block's `marginTop: 64` unchanged.

This is a single-value edit on line 229 of `remotion/src/MascotShow.tsx`.

## Verification
Re-render the 10s 9×16 mascot reel (`triviolivia-mascots-9x16.mp4`) and confirm the end card shows the tagline hugging the logo.
