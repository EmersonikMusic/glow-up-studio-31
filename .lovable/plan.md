## Goal
Generate a single 5x5 grid image showing all 25 category mascots, each on its category's gradient background.

## Approach
This is a one-off visual artifact (not an app feature), so I'll render it as a PNG saved to `/mnt/documents/mascots-grid.png` and show it inline in chat.

### Steps
1. Read `src/data/categoryColors.ts` (already in context) for the 25 gradients and match them to the 25 mascot SVGs in `src/assets/mascots/`.
2. Write a small Node script that:
   - Builds a 5x5 HTML page with each cell containing the mascot inline SVG on top of its `linear-gradient(...)` background.
   - Rounds cell corners slightly, adds the category label in the app's style (Fredoka One, white).
   - Uses Playwright (already available) to screenshot the page at a high resolution (e.g. 2000x2000).
3. Save the result to `/mnt/documents/mascots-grid.png` and display it inline.

### Layout details
- 5 columns x 5 rows, square cells.
- Each cell: category gradient background, mascot SVG centered (~70% of cell), small category label at the bottom.
- Order: alphabetical by category name for predictable layout.

### Notes
- Purely visual artifact — no app code changes.
- If you'd prefer a different order (e.g. grouped by color family), or no labels, let me know before I build.
