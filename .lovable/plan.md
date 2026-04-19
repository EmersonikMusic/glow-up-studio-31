
## Plan: Align username pill with sibling buttons

### Changes (GameHeader.tsx)
Username pill currently uses `px-3 py-1.5` + `text-[12px] sm:text-[11px]` and gold text — visually shorter and smaller than the Logout/About `w-9 h-9 sm:w-auto sm:px-4` pills.

Update the username pill to match sibling button metrics:
- **Height**: replace `px-3 py-1.5` with `h-9 px-4` so it matches the `w-9 h-9 sm:w-auto sm:px-4` of Logout/About on every viewport.
- **Font size**: change `text-[12px] sm:text-[11px]` → `text-xs` (matches the sibling label `text-xs font-bold uppercase tracking-wider`). Also set `font-bold` to match (drop `font-black`).
- **Color**: swap `hsl(42 100% 60%)` (gold) → `hsl(185 70% 55%)` (settings turquoise accent).
- **Max chars**: truncate the username string to 20 characters in the JSX (`user.username.slice(0, 20)`), keep the existing CSS `truncate` + `max-w-[120px]` as a width safety net so the pill never breaks the row at 390px.

Icon (`User` 3.5×3.5) stays gold-free — recolor to the same turquoise via `className`/`style` so icon and text match.

### Files touched
- `src/components/GameHeader.tsx` — username pill height, font size, color, 20-char cap

### Out of scope
- No changes to Logout/About/Settings buttons, logo, tagline, or any other element
