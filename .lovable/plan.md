
## Plan: Mobile UX/UI revisions (with vertical breathing room)

### 1. Username left-aligned on mobile
`src/components/GameHeader.tsx`
- Render the username pill in two slots with responsive visibility:
  - `sm:hidden` copy in the **left slot** (same x-position as logo when logged out).
  - `hidden sm:flex` copy stays in the right cluster on tablet/desktop.
- Same pill styling in both. Logo stays hidden on mobile when logged in (current behavior).

### 2. Equal horizontal padding for game card, mascot, and footer pill
`src/components/TriviaGame.tsx`
- `<main>` mobile horizontal padding: `px-2` → `px-3` to match footer's `px-3`.
- Mobile mascot: remove `right-0`/`bottom-0`, add `right-3 bottom-2` so it lives inside the same 12px gutter.

### 3. Game area fills more vertical space — but with breathing room
**Key revision per your feedback:** the card must NOT sit flat against the header or footer. Keep visible padding on top and bottom of the card.

`src/components/QuestionCard.tsx`
- Replace `min-h-[60vh] md:min-h-0 md:h-full` with `h-full md:h-full`. Card now stretches to fill its grid row (relies on grid `1fr`, not `vh`, so it works identically across iOS Safari, Chrome, Firefox, Samsung Internet — adapts to dynamic browser chrome via the parent's `100svh`).

`src/components/TriviaGame.tsx` `<main>`
- Add `min-h-0` so the `1fr` row can shrink properly inside the grid (required for `h-full` on the card to behave).
- Mobile vertical padding: keep generous breathing room — `py-3 sm:py-6` (12px top/bottom on mobile). This is the gap between header→card and card→footer. Card will be **taller than current** (currently capped by `60vh` minus padding) but never flush against header or footer.
- Net effect on a 390×774 viewport: header ~64px + footer ~80px + 2×12px main padding = ~168px chrome, leaving ~606px for the card (vs. ~464px today at 60vh). Significantly taller, with clear visible gaps above and below.

### 4. UX best-practice refinements (mobile, no functional changes)
- **Safe-area insets**: header gets `paddingTop: max(existing, env(safe-area-inset-top))`; footer gets `paddingBottom: max(existing, env(safe-area-inset-bottom))`. Prevents notch/home-indicator overlap in fullscreen + iOS standalone PWA.
- **Tap targets**: header nav buttons `w-9 h-9` → `w-10 h-10` on mobile only (`w-10 h-10 sm:w-9 sm:h-9`). Footer pause button gets matching mobile bump. Meets Apple HIG 44pt / Material 48dp.
- **Mascot doesn't crowd content**: mobile mascot size `clamp(110px, 32vw, 160px)` → `clamp(90px, 26vw, 130px)`, plus `opacity-90`. Charming accent without competing with answer text on 375px screens.
- **Header cluster on narrow screens**: with up to 5 right-side items (username + logout + about + settings + fullscreen), reduce mobile gap `gap-1.5` → `gap-1`, and make username pill `truncate max-w-[80px] sm:max-w-none` to prevent overflow at 320px.

### Files touched
- `src/components/GameHeader.tsx` — username left slot on mobile, larger mobile tap targets, tighter gap, safe-area top.
- `src/components/TriviaGame.tsx` — `main` padding (`px-3`, `py-3`, `min-h-0`), mobile mascot inset + size.
- `src/components/QuestionCard.tsx` — `min-h-[60vh]` → `h-full`.
- `src/components/GameFooter.tsx` — safe-area bottom padding, larger pause tap target on mobile.

### Out of scope
No changes to game logic, timers, animations, colors, fonts, desktop layout (≥768px), or any settings/start/about/login screens.

### Verification (390×774 mobile preview, then iOS Safari + Android Chrome)
1. Logged-in mobile: username pill at left edge (same x as logo when logged out).
2. Card left/right edges align with footer pill edges (~12px gutter).
3. **Visible gap (~12px) between header and top of card, and between bottom of card and footer** — card never flush.
4. Card noticeably taller than current build; footer fully visible whether Safari URL bar is shown or hidden.
5. Mascot inside the 12px gutter, not flush to viewport edge.
6. All header buttons ≥40px on mobile; no horizontal overflow at 320px.
7. Notched iPhone: no content under notch or home indicator.
