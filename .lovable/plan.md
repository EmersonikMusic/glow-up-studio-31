
## Plan: Username placement + tagline visibility + logo visibility rules

### 1. Logo visibility (GameHeader.tsx)
Logo shows on **all viewports except mobile-when-logged-in**.

- Logged out: logo always visible (mobile, tablet, desktop)
- Logged in: logo hidden on mobile (`<sm`), visible on tablet+ (`≥sm`)

Implementation: drop the static `hidden sm:block` class. Compute visibility dynamically — `className={user ? "h-8 w-auto hidden sm:block" : "h-8 w-auto block"}`.

### 2. Username pill placement (GameHeader.tsx)
Move the username pill out of the left slot into the right-side action group, positioned **immediately left of the Logout button** on **all viewports** (mobile, tablet, desktop).

**Final order:**
- Logged in: `Logo (per rule above) … [right group: Username → Logout → About → Settings]`
- Logged out: `Logo … [right group: Login → About → Settings]`

Implementation:
- Remove username pill from left container (left becomes logo-only).
- Insert username pill as first child of the right-side actions div, before Logout. Keep current pill styling (gold text, user icon, rounded-full, translucent bg/border).
- Tighten `max-w-[120px]` on mobile so the pill + 3 buttons fit at 390px when logo is hidden.

### 3. Tagline letter clipping fix (StartScreen.tsx)
The "E" in EARTH and "E" in SOURCE are clipped because the arc path endpoints (`30` and `570` of 600 viewBox) sit too close to the edges and the drop-shadow filter region is too tight.

Fix:
- Widen arc inset: change path from `M 30 42 Q 300 12 570 42` → `M 60 44 Q 300 16 540 44`.
- Expand filter region: `x="-5%" y="-20%" width="110%" height="160%"`.
- Reduce `font-size` `26px` → `24px` and `letter-spacing` `0.2em` → `0.16em` so full string fits with margin.

### Files touched
- `src/components/GameHeader.tsx` — logo visibility rule, move username pill into right group
- `src/components/StartScreen.tsx` — adjust tagline arc, filter, font-size, letter-spacing

### Out of scope
- No color/spelling changes to tagline
- No CTA button, Settings, or other styling changes
