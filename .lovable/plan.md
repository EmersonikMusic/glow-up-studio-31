Create a third export of the 5x5 mascot grid alongside the existing cells/blended versions.

## What to do

1. Extend `/tmp/mascots-grid/build.py` to render a new variant in the same run as the other two:
   - 5x5 layout, all 25 mascots.
   - No per-cell gradient backgrounds, no borders, no dividers — one continuous background across the whole canvas.
   - Background = the app's standard purple (the game background token from `src/index.css` `--game-bg`, resolved to its hex/rgb equivalent so the PNG matches what users see in-app).
   - Each mascot centered in its cell, with the category name rendered underneath in the same Fredoka display style already used by the other variants.
   - Keep the existing SVG id-namespacing logic so inlined gradients don't collide.

2. Save the output to `/mnt/documents/mascots-grid-purple.png` at the same resolution as the other two exports.

3. Leave `mascots-grid-cells.png` and `mascots-grid-blended.png` untouched.

## Deliverables

- `/mnt/documents/mascots-grid-purple.png` — 5x5 mascots on a single app-purple background, category labels beneath each mascot, no cell boundaries.
- Updated `/tmp/mascots-grid/build.py` producing all three variants in one run.

No app code is modified.
