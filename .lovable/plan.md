
## Plan: Style refinements + unified CTA button

### 1. Remove "How do I play?" section from About
In `src/components/AboutScreen.tsx`, delete the "How do I play?" `<h2>` + paragraph block (and its trailing divider). Leave all other sections intact.

### 2. "How Do I Play?" link tweaks (StartScreen.tsx)
Current:
```
className="mt-3 text-xs underline underline-offset-4 text-[hsl(185_70%_55%)] hover:text-[hsl(var(--game-gold))] ..."
```
Change to:
```
className="mt-[22px] text-xs font-bold underline underline-offset-[5px] text-[hsl(185_70%_55%)] hover:text-[hsl(var(--game-gold))] transition-colors animate-fade-in"
```
- `mt-3` (12px) → `mt-[22px]` (+10px).
- Add `font-bold`.
- `underline-offset-4` → `underline-offset-[5px]`.
- Keep gold hover.

### 3. Close-button hover — match header pill turquoise outline
The close (X) buttons on `AboutScreen.tsx` and `HowToPlayScreen.tsx` currently use a subtle glow on hover. Replace with the same turquoise-outline hover effect used by the Login/About pills in `GameHeader.tsx` (which inherit from the global `.nav-btn:hover` rule in `index.css` — turquoise border + subtle white background lift).

- Read both modal files to find the exact close-button classes/inline styles producing the current glow.
- Read `.nav-btn:hover` in `index.css` to confirm the target effect (turquoise border `hsl(185 70% 55%)` + `rgba(255,255,255,0.12)` bg per the visible CSS).
- Update the close buttons:
  - Add the `nav-btn` class so hover matches the header pills exactly.
  - Remove any inline `box-shadow`/glow styling that conflicts.
  - Preserve size, position, icon, and aria-label.

This gives consistent turquoise-outline hover treatment across header pills and modal close buttons.

### 4. Unified CTA — reusable component
Create **`src/components/PrimaryCTA.tsx`** wrapping a `<button>` with the exact Start Game styling so all callsites stay in sync:

```tsx
className="nav-btn h-14 px-10 rounded-full border-2 border-[#57215b]
  bg-[linear-gradient(0deg,#e93e3a_0%,#ed683c_11%,#f3903f_33%,#fdc70c_72%,#fff33b_100%)]
  text-white text-xl font-['Fredoka_One'] tracking-[0.18em] uppercase
  shadow-lg shadow-black/30 transition-all duration-200
  inline-flex items-center justify-center gap-2
  disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
style={{ textShadow: "0 2px 3px rgba(87,33,91,0.6)" }}
```
Props: `onClick`, `children`, `disabled`, `className` (for width overrides like `w-full`), `aria-label`.

Apply to:
- **AboutScreen.tsx** — replace footer "Back to Game" button with `<PrimaryCTA className="w-full">Back to Game</PrimaryCTA>`.
- **SettingsPanel.tsx** — replace the Apply Settings / Apply New Settings button (preserve dynamic label).
- **ResultScreen.tsx** — replace the `btn-gameshow` "Play Again" button. Keep the `RotateCcw` icon as a child.
- **StartScreen.tsx** — refactor inline Start Game button to use `<PrimaryCTA>` so it stays the source of truth.

### Files touched
- New: `src/components/PrimaryCTA.tsx`
- Edit: `src/components/AboutScreen.tsx` (remove section, swap CTA, close-btn hover)
- Edit: `src/components/HowToPlayScreen.tsx` (close-btn hover)
- Edit: `src/components/StartScreen.tsx` (link tweaks, swap CTA)
- Edit: `src/components/SettingsPanel.tsx` (swap CTA)
- Edit: `src/components/ResultScreen.tsx` (swap CTA)

### Out of scope
- No changes to `.btn-gameshow` class itself.
- No header, layout, or gameplay changes.
