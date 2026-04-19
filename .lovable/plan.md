
## Plan: Restyle Start Game CTA to match logo aesthetic

### Current state
The Start Game button uses `.btn-gameshow` (likely a thick, multi-color game-show style with heavy purple stroke on text). User wants it visually aligned with the logo's warm gradient (red → orange → yellow per `btn-startgame.svg` / logo) but with:
- A **sleeker outline** like the Login/About pills (`h-9 px-4`, `rounded-full`, thin border, glassy bg).
- The **same turquoise hover** the header pills use.
- **Legible text**: drop the purple `-webkit-text-stroke`, switch to a cleaner display font.

### Reference colors (from logo SVG)
Linear gradient top→bottom: `#e93e3a` (red) → `#ed683c` → `#f3903f` (orange) → `#fdc70c` (gold) → `#fff33b` (yellow). Outline color in logo: `#57215b` (deep purple) — but user wants a sleeker outline, so we'll use a thin 1–2px purple border instead of the logo's chunky 20px stroke.

### Changes (StartScreen.tsx, CTA button only)
Replace the `btn-gameshow` className with inline Tailwind + a small inline style for the gradient:

- **Shape**: `rounded-full px-10 h-12` (taller than header pills since it's the primary CTA, but same rounded-full silhouette).
- **Background**: `linear-gradient(180deg, #e93e3a 0%, #ed683c 11%, #f3903f 33%, #fdc70c 72%, #fff33b 100%)` (mirrors logo gradient).
- **Border**: `border-2 border-[#57215b]` — thin, sleek purple outline echoing logo stroke color.
- **Shadow**: subtle `shadow-lg shadow-black/30` for depth without the chunky drop-shadow.
- **Text**: 
  - Font: `font-['Fredoka_One']` (already used for headings per memory) — clean, rounded, highly legible.
  - Color: solid white `text-white` (no purple text-stroke).
  - Subtle dark text-shadow for readability over the bright gradient: `textShadow: "0 2px 3px rgba(87, 33, 91, 0.6)"`.
  - Keep `text-xl tracking-[0.18em] uppercase`.
- **Hover**: turquoise transition matching header pills — on hover, swap background to the turquoise accent `hsl(185 70% 55%)` and keep border purple. Use `hover:bg-[hsl(185_70%_55%)] hover:bg-none` (the `bg-none` is needed to clear the gradient since Tailwind hover can't override inline `background`).
  - Implementation note: drive both default + hover via Tailwind classes (no inline `background`), using a custom `bg-[linear-gradient(...)]` arbitrary value so `hover:bg-[hsl(...)]` cleanly replaces it.
- **Loading state**: keep the `Loader2` spinner + "Loading…" label; styling inherits.
- **Animation**: keep `animate-fade-in` and the existing `animationDelay: 180ms`.

### Final className sketch
```
rounded-full h-12 px-10 border-2 border-[#57215b]
bg-[linear-gradient(180deg,#e93e3a_0%,#ed683c_11%,#f3903f_33%,#fdc70c_72%,#fff33b_100%)]
hover:bg-[hsl(185,70%,55%)] hover:bg-none
text-white text-xl font-['Fredoka_One'] tracking-[0.18em] uppercase
shadow-lg shadow-black/30 transition-colors duration-200
inline-flex items-center justify-center gap-2 animate-fade-in
disabled:opacity-60 disabled:cursor-not-allowed
```
Plus inline `style={{ textShadow: "0 2px 3px rgba(87,33,91,0.6)", animationDelay: "180ms" }}`.

### Files touched
- `src/components/StartScreen.tsx` — CTA button className + style only

### Out of scope
- No changes to `.btn-gameshow` class definition (left in place; just unused here).
- No header, tagline, logo, or layout changes.
- No new font imports — Fredoka One is already loaded per the existing tagline/heading usage.
