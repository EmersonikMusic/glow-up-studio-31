

## Plan: Subtle start-screen animations + header nav micro-interactions

### 1. Start screen — chill, fun ambient motion

Add three layered, low-intensity touches that reinforce the trivia/game vibe without distraction. All respect `prefers-reduced-motion`.

**a. Drifting ambient blobs** (`StartScreen.tsx`)
The two background blobs are currently static. Add a slow, organic drift so the page feels alive.
- New `@keyframes blob-drift-a` and `blob-drift-b` in `index.css`: 18–22s loops, easing in-out, translating ~30–50px on each axis with a subtle scale (0.95→1.05). Two different paths so they don't move in lockstep.
- Apply via `animation` style on each blob div. Keep `pointer-events: none`.

**b. Logo gentle float + tagline shimmer** (`StartScreen.tsx`)
- Logo: after the entry fade-in completes, apply the existing `animate-float` (already defined at 3s). Use a short delay so float starts after the fade settles. Reduce amplitude by wrapping in a CSS variable override or new `float-soft` keyframe (~4s, ±4px) so it's calmer than the in-game mascot float.
- Tagline SVG `<text>`: add a subtle teal `text-shimmer` keyframe — animate the `fill` between `hsl(185 70% 55%)` and `hsl(185 80% 65%)` over ~4s, ease-in-out, infinite. Almost imperceptible glow pulse, reinforces the "deepest source" tagline.

**c. CTA breathing glow** (`index.css` → `.cta-glass`)
- Add a slow `cta-breathe` keyframe (~3.5s, infinite) that gently pulses the existing gold box-shadow between `0 4px 16px hsl(42 100% 55% / 0.25)` and `0 4px 22px hsl(42 100% 55% / 0.40)`. No scale, no movement — just light. Pauses on `:hover` (hover state already takes over the shadow).

**d. "How Do I Play?" subtle nudge** (`StartScreen.tsx`)
- On hover (pointer devices only), add a 2px upward translate + the existing underline color shift. Quick 180ms ease.

### 2. Header nav micro-interactions (`GameHeader.tsx` + `index.css`)

**a. Gear icon — spin on hover (and reverse on hover-off)**
The current behavior rotates 60° when settings open. Add hover spin while preserving the open-state rotation.
- Replace the existing `md:hover:rotate-45` Tailwind class with a CSS-controlled spin that goes a full 360° on hover-enter and 0° on hover-leave (which naturally reads as a reverse spin via the same `transition` curve).
- Use a dedicated `.gear-icon` class with `transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)`. On `:hover`, `transform: rotate(360deg)`. The `settingsOpen` 60° rotation stays as an inline style override that takes precedence when the panel is open.
- Implementation detail: when `settingsOpen` is true, the inline `transform: rotate(60deg)` wins over the CSS hover rule (CSS specificity), so we keep the inline style only when open. When closed, hover rule applies. Clean separation.

**b. Fullscreen icon — corner arrows separate on hover**
Both `Maximize2` and `Minimize2` from lucide are composed of four corner chevrons. Pure CSS can't move SVG sub-paths, but we can fake the "arrows separate" effect with a tiny scale-up of the whole icon (1px-equivalent outward shift on each corner).
- Add `.fs-icon` class with `transition: transform 0.25s ease`. On parent button `:hover .fs-icon`, apply `transform: scale(1.12)` — visually each corner moves ~1–2px outward, exactly the requested effect, symmetrical, reversible. Cheap and crisp.
- Alternative considered: inline a custom SVG with grouped corners and animate translate per group. More accurate but heavier; we'll use the scale approach unless you want the inline-SVG version.

**c. Other nav buttons (Login/Logout/About)**
Currently only background/border shift on hover via `.nav-btn`. Add a tiny 1.05 scale on the inner icon (Login/LogOut/Info) on parent hover, 200ms ease, for consistency with the gear/fullscreen treatment. Subtle.

### Reduced motion
Wrap every new keyframe usage in `@media (prefers-reduced-motion: reduce)` overrides that set `animation: none` and `transition: none` on the relevant classes, so users with that preference get the static experience.

### Files touched
- `src/index.css` — new keyframes (`blob-drift-a`, `blob-drift-b`, `float-soft`, `text-shimmer`, `cta-breathe`); `.gear-icon`, `.fs-icon` hover rules; reduced-motion overrides; CTA breathing on `.cta-glass`.
- `src/components/StartScreen.tsx` — apply drift animations to blobs, `float-soft` to logo, `text-shimmer` to tagline `<text>`, hover lift on "How Do I Play?".
- `src/components/GameHeader.tsx` — swap gear's `md:hover:rotate-45` for `.gear-icon` class; add `.fs-icon` class on the Maximize/Minimize icons; add icon-scale class on Login/Logout/About icons.

### Out of scope
No changes to game logic, settings panel, footer, mascots, or any in-game screen. No layout/spacing changes. No new dependencies.

### Verification
1. Start screen: blobs drift slowly and independently; logo gently floats; tagline color subtly shimmers; CTA glow breathes — none of it competes for attention.
2. Hover gear (settings closed): spins 360° forward, then unwinds back to 0° on hover-off.
3. Hover gear (settings open): stays at 60° (inline style wins); hover spin doesn't fight the open rotation.
4. Hover fullscreen icon: arrows visibly push outward (~1–2px equivalent), snap back on hover-off.
5. Hover Login/Logout/About: subtle icon scale-up alongside existing background shift.
6. `prefers-reduced-motion: reduce` (DevTools → Rendering): all new motion stops; layout unchanged.
7. Mobile (touch): no hover effects fire; ambient animations still play but at the same calm level.
8. `npm run test` and `npm run test:e2e` still pass.

