
## Plan: Game-show CTA refresh + mobile header username fix

Two independent changes. Both preserve the existing palette (gold/teal/dark).

---

### 1. CTA button redesign — "game show" feel, drop the coin look

**Problem:** Current primary CTAs (Start Game, Apply Settings, Play Again, Sign In) use a yellow→orange→red vertical gradient on a fully circular `rounded-full` pill with metallic inset highlight + glossy diagonal shine sweep. That stack reads as casino chip / coin.

**New direction — "chunky game-show button":**
- Shape: **`rounded-2xl`** (pronounced corner radius, not a perfect circle / pill). Reads as a friendly button, not a token.
- Color: solid brand **gold** `hsl(var(--game-gold))` fill (no multi-stop yellow→red gradient). Text in dark `hsl(var(--game-bg))` for high contrast — same palette, cleaner.
- Depth: a flat **bottom-edge shadow** (3–4px solid darker-gold underline `hsl(var(--game-gold-dark))`) using `box-shadow: 0 4px 0 0 ...` — gives a tactile "pressable tile" look reminiscent of Duolingo / Kahoot / educational game UIs. On `:active`, translate down 2px and shrink the shadow to 2px so the button visibly "presses".
- Border: thin `1.5px` white-translucent border for a subtle outline against varied backgrounds.
- Remove: the diagonal shine sweep (`group-hover` overlay), the inset white highlight, the `rounded-full` pill, the multi-stop gradient.
- Hover (pointer only): brighten slightly + lift shadow to 6px (no scale jump). Mobile/touch keeps the press-down active state only.

**Implementation — single source of truth:**
Add a `.btn-gameshow` utility class in `src/index.css` (alongside the existing `.cta-glass`) so all CTAs share it:

```css
.btn-gameshow {
  background: hsl(var(--game-gold));
  color: hsl(var(--game-bg));
  border: 1.5px solid rgba(255,255,255,0.35);
  border-radius: 1rem;
  box-shadow: 0 4px 0 0 hsl(var(--game-gold-dark)), 0 6px 14px rgba(0,0,0,0.25);
  font-family: 'Russo One', 'Nunito', sans-serif;
  transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.2s ease;
}
@media (hover: hover) and (pointer: fine) {
  .btn-gameshow:hover { background: hsl(42 100% 62%); box-shadow: 0 6px 0 0 hsl(var(--game-gold-dark)), 0 8px 18px rgba(0,0,0,0.3); }
}
.btn-gameshow:active { transform: translateY(2px); box-shadow: 0 2px 0 0 hsl(var(--game-gold-dark)), 0 3px 8px rgba(0,0,0,0.25); }
.btn-gameshow:disabled { opacity: 0.5; cursor: not-allowed; }
```

**Apply across all CTAs (replace inline gradient + shine span):**
- `src/components/StartScreen.tsx` — Start Game button
- `src/components/SettingsPanel.tsx` — Apply Settings button
- `src/components/ResultScreen.tsx` — Play Again button (keep `RotateCcw` icon + rotate-on-hover)
- `src/components/LoginScreen.tsx` — replace `cta-glass` with `btn-gameshow` on submit button for consistency

Each replacement: drop the `style={{ background: "linear-gradient(...)", border, boxShadow, color }}`, drop the inner shine `<span>`, drop `rounded-full` + `overflow-hidden`, add `className="btn-gameshow ..."`. Padding/sizing stays per-button.

**Accessibility:** Text remains dark-on-gold (passes WCAG AA). Focus ring inherited from the existing global `focus-visible:ring-2`. Touch targets stay ≥44px (existing `py-4` preserved).

---

### 2. Mobile header — show full username (up to 20 chars)

**File:** `src/components/GameHeader.tsx`

**Current issues at 390px when logged in:**
- Username has `max-w-[80px]` + `truncate` → cuts off after ~7-8 chars
- Logo (`h-8`) + About icon (36px) + username (capped 80px) + logout (36px) + settings (36px) all on one row with `gap-2` ≈ 220px+ used.

**Fix — reflow to fit a 20-char username:**

a. **Increase username allowance** to fit ~20 chars (`max-w-[160px]`) and **bump font** to `text-[12px]` (was 10/11). Keep `truncate` as safety for >20-char edge cases.

b. **Reclaim space**:
   - Reduce About button when logged in: hide the desktop "ABOUT" text earlier (it's already icon-only on mobile — fine, no change needed).
   - **Hide the small logo on mobile only when logged in** (`hidden sm:flex` on the logo wrapper *conditional on `user`*). Rationale: brand is already established on the start screen; in-game/header has the username as primary identity. On desktop, logo stays visible. This frees ~40px.
   - Keep About icon (36px), username (160px), logout (36px), settings (36px) → fits comfortably with `gap-1.5` on mobile.

c. **Reduce gaps on mobile** from `gap-2` to `gap-1.5` between right-side actions to add a few more px of breathing room.

d. **Slight visual polish**: wrap username in a subtle pill `bg-white/8 border border-white/15 rounded-full px-2.5 py-1` so it reads as a status chip rather than floating text — keeps the header balanced when the logo is hidden.

**Acceptance check at 390px:**
- "AverageJoeUsername20" (20 chars) renders fully without truncation in `text-[12px]` ≈ 130px wide → fits in 160px allowance.
- No overlap with About / logout / settings buttons.
- When logged out: logo stays visible (no change), Login button + About + Settings remain comfortable (already works today).
- Desktop (`sm:` and up): no visible change — logo always shown, username uses full natural width.

---

### Out of scope / not changing
- Color tokens in `index.css` `:root` — palette unchanged.
- Header background/blur, logo asset.
- Footer / NavLink / nav-btn header pill styling (those aren't CTAs).
- Settings rows, switches, sliders.
