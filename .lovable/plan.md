
## Plan: Refine Start Game CTA — height, gradient direction, hover

### Changes (StartScreen.tsx, CTA button only)

**1. Equal padding (taller button)**
- Current: `h-12 px-10` → height 48px, horizontal padding 40px each side. Vertical text padding ≈ 12px (top/bottom inside 48px with 20px text). Asymmetric.
- New: `h-14 px-10` → height 56px gives ~18px vertical padding, closer to horizontal feel. (Going to `h-16` would feel chunky for a pill; `h-14` is the sweet spot.)

**2. Reverse gradient (red at bottom)**
- Current: `linear-gradient(180deg, #e93e3a 0%, #ed683c 11%, #f3903f 33%, #fdc70c 72%, #fff33b 100%)` — red top, yellow bottom.
- New: flip the angle to `0deg` (or equivalently reverse stops). Using `0deg` is the cleanest:
  - `bg-[linear-gradient(0deg,#e93e3a_0%,#ed683c_11%,#f3903f_33%,#fdc70c_72%,#fff33b_100%)]`
  - Result: yellow top → red bottom.

**3. Match header pill hover**
- Inspecting `GameHeader.tsx` Login/About buttons: they have `bg: rgba(255,255,255,0.08)`, `border: 1px solid rgba(255,255,255,0.15)`, `transition-all duration-200 active:scale-95`. They rely on the global `.nav-btn` class for hover styling — no explicit Tailwind hover classes in the JSX.
- Need to read `index.css` to see what `.nav-btn:hover` actually does, then mirror it on the CTA. (Currently the CTA hovers to solid turquoise which is NOT what the header pills do.)

### Need to verify before finalizing
Read `src/index.css` for the `.nav-btn:hover` rule so the CTA hover matches exactly (likely a subtle bg lightening + border brightening, not a full color swap).

### Files touched
- `src/components/StartScreen.tsx` — CTA `className` only (height, gradient angle, hover classes/style)

### Out of scope
- No changes to border, font, text-shadow, loading state, animation, or any other element.
