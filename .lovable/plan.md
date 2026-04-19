
## Plan: Header + Start screen refinements

### 1. Header layout (GameHeader.tsx)
Restore logo as persistent left anchor on desktop; username sits beside it when logged in.

- **Desktop/Tablet (≥sm):** `Logo → Username (if logged in) → Login/Logout → About → Settings`
- **Mobile (<sm):** `Username (if logged in, else empty spacer) → Login/Logout → About → Settings` (logo hidden)

Implementation: left slot is an always-rendered flex container holding `Logo` (`hidden sm:block`) + `Username pill` (only when `user`, with `sm:ml-2`). Empty slot on mobile-logged-out keeps `justify-between` working.

### 2. Restore text labels on About + Login/Logout (≥sm)
About, Login, and Logout become **icon + label pills on sm and up**, icon-only circles on mobile. Settings stays a circle.

Each button: `w-9 h-9 sm:w-auto sm:px-4 rounded-full` with `<span className="hidden sm:inline ml-1.5 text-xs font-bold uppercase tracking-wider">`. Same gold icon/text and translucent bg/border — no other styling changes.

### 3. Tagline color fix (StartScreen.tsx)
- Spelling already correct (`"Earth's Deepest Trivia Source"` — uppercased via CSS).
- Change SVG `fill` from gold (`hsl(42 100% 55%)`) to settings turquoise: `hsl(185 70% 55%)`.

### 4. Start Game CTA — sleeker rounded rectangle (index.css)
Refine `.btn-gameshow` away from coin/casino vibe:
- `border-radius: 14px` (was `9999px`)
- Remove `::after` shine highlight
- Flatter gradient: `linear-gradient(180deg, #FDB833 0%, #F39220 100%)`
- Thinner border: `2px solid #57215B`
- Lighter depth: `0 4px 0 #481D51, 0 8px 18px rgba(0,0,0,0.3)`
- Inset highlight opacity → `0.35`
- Text stroke → `1.5px`
- Hover/active lift+press scaled to new depth

Button sizing in StartScreen unchanged (`px-14 py-5 text-xl`).

### Files touched
- `src/components/GameHeader.tsx` — restore desktop logo, username next to logo, icon+label pills for About/Login/Logout on ≥sm
- `src/components/StartScreen.tsx` — tagline fill → turquoise
- `src/index.css` — rewrite `.btn-gameshow` as sleeker rounded rectangle

### Out of scope
- No changes to Settings panel, AboutScreen, or game flow
- No other styling adjustments
