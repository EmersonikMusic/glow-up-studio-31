Keep both versions of the 5x5 mascot grid available as downloadable images.

## What to do

1. Restore the original hard-edged version as `mascots-grid-cells.png` in `/mnt/documents/` — rounded cells with clear boundaries, 20px gaps, each mascot on its own gradient tile (the first version you approved).
2. Keep the current blended version but rename it to `mascots-grid-blended.png` so both files coexist and neither overwrites the other.
3. Update `/tmp/mascots-grid/build.py` to render both variants in one run (two renders, two output files) so future tweaks stay in sync.

## Deliverables

- `/mnt/documents/mascots-grid-cells.png` — hard boundaries, one gradient per cell
- `/mnt/documents/mascots-grid-blended.png` — soft blur, colors bleeding into each other

No app code is touched; this only affects the generator script and the two exported images.