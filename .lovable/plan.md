
## Plan: Start screen + header polish (revised)

### 1. Replace start screen logo
Copy `user-uploads://img-TO-logo-full-desktop-2.svg` → `src/assets/img-TO-logo-full-desktop-v2.svg` and update the import in `StartScreen.tsx`. Old file stays in place.

### 2. Header: reorder + restyle auth controls
**New order, left → right:**
- Logged in: `Username → Logout → About → Settings`
- Logged out: `(empty logo slot) → About → Login → Settings`

Changes in `GameHeader.tsx`:
- Move username pill out of the right-side group into the **left slot** (replacing the empty placeholder). On mobile when logged in, this fills the spacer slot; right-aligned icons stay right-aligned.
- Reorder right-side actions: Logout comes immediately after username (visually grouped as identity controls), then About, then Settings.
- Restyle Login as a 36px round icon button (LogIn icon, gold tint, same bg/border as About/Logout/Settings). Drop the "Login" text label, keep `aria-label="Login"`.
- Logout stays round — just reposition next to username.
- Username pill keeps current styling (gold text, user icon) with right margin for breathing room.

Result: all right-side controls are uniform 36px circles; username + logout cluster on the left as the identity group.

### 3. Restyle "START GAME" CTA
Rebuild `.btn-gameshow` in `index.css` to match the reference (rounded pill, orange→yellow gradient, deep purple stroke, 3D depth):
- Background: `linear-gradient(180deg, #FDC70C 0%, #F3903F 55%, #ED683C 100%)`
- Border: `3px solid #57215B`
- Border-radius: `9999px` (full pill)
- Box-shadow: inset top highlight + chunky drop (`0 6px 0 #481D51, 0 10px 20px rgba(0,0,0,0.4)`)
- Text: white Fredoka One, tracking-wider, with purple text-stroke via `-webkit-text-stroke: 2px #57215B; paint-order: stroke fill`
- Hover: lift `translateY(-2px)`, brighten. Active: press `translateY(2px)`, reduce shadow
- Subtle `::after` shine in top-right corner

Update `StartScreen.tsx` button: bump size to `px-14 py-5 text-xl`, keep loading spinner state.

### 4. Curved tagline under logo
Add "EARTH'S DEEPEST TRIVIA SOURCE" directly under the logo in `StartScreen.tsx` using inline SVG `<textPath>` on a shallow concave-up arc that mirrors the logo's bottom curve.
- Fredoka One, gold (`hsl(var(--game-gold))`), uppercase, letter-spacing `0.2em`
- ~18px desktop / ~13px mobile, drop-shadow filter for depth
- Fades in at ~90ms (between logo at 0ms and CTA at 180ms)

### Files touched
- `src/components/StartScreen.tsx` — new logo import, curved tagline SVG, larger CTA
- `src/components/GameHeader.tsx` — move username to left, reorder right group as Logout → About → Settings, restyle Login as round icon
- `src/index.css` — rewrite `.btn-gameshow`
- `src/assets/img-TO-logo-full-desktop-v2.svg` — new file from upload

### Out of scope
- No changes to AboutScreen, Settings, or game flow
- Old logo file retained
