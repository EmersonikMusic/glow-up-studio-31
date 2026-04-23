

## Gameplay Polish: Sound, Motion & Micro-Interactions (Revised)

Refined plan based on your exclusions. Below is the final scope I'll build.

---

### Tier 1 — Sound design
Muted-by-default audio layer with a speaker toggle in the header. Royalty-free pack (faster, no API cost — can swap to ElevenLabs later).
- `tick` — soft wood-block at 5s, 3s, 1s remaining
- `reveal` — gentle chime on answer card flip-in
- `transition` — soft whoosh on next-question slide
- `start` — uplifting 3-note flourish on Start Game
- `complete` — short fanfare on Trivia Complete
- Volume 35% default, off until user opts in. Toggle persists in `localStorage`.

### Tier 2 — Last-5-seconds urgency
When `countdown ≤ 5`:
- Timer digit pulses + shifts color teal → gold → red across final 3s
- Time bar gains subtle scanline shimmer
- Mascot float speed: **unchanged** (per your note)

### Tier 3 — Answer-reveal "drumroll" moment
- Question scales down to 0.85 over 250ms anticipation
- Divider sweeps in left-to-right (replaces fade)
- Answer rises with spring overshoot `cubic-bezier(0.34, 1.56, 0.64, 1)`
- Pairs with `reveal` chime

### Tier 4 — Mascot reactivity
- On answer reveal: celebratory bounce (200ms scale 1 → 1.08 → 1)
- On last-5s urgency: micro-wobble
- On pause: float halts mid-air with soft droop
- On category change: 3-dot SVG sparkle burst behind mascot circle

### Tier 5 — Question entrance variation
Randomized entrance from a pool of 3 (slide-up, soft-zoom, fade-from-blur) so the rhythm feels organic across 20 questions.

### Tier 6 — Category transition flair
- Background gradient cross-fades (already does) → add a 600ms ambient color flash on the question card border matching the new category's accent
- Footer pill underline on entry: **removed** (per your note)

### Tier 7 — Progress milestone moments
- 25%, 50%, 75% complete → single golden particle drifts up behind mascot for ~1s
- Final question footer "FINAL" relabel + gold glow: **removed** (per your note)

### Tier 8 — Pause overlay
- Soft `rgba(0,0,0,0.4)` overlay with `backdrop-blur` over question card
- Centered "Paused" label in Fredoka One
- Hint: "Press space or tap play to resume"
- Mascot freezes mid-float with subtle tilt

### Tier 9 — Keyboard shortcuts (desktop)
- `Space` → pause/resume (already exists)
- `→` or `N` → next question (when answered)
- `S` → toggle settings drawer
- `M` → mute/unmute sound
- Discoverable via small "?" pill that opens a cheat sheet

### Tier 10 — Result screen expansion
- Categories marquee: **removed** (per your note)
- Gold confetti burst on entry (CSS-only, ~12 particles, 1.2s)
- Add **secondary "Change Settings" CTA** alongside primary "Play Again"
  - Styled as outlined/ghost variant: transparent background, white border (`rgba(255,255,255,0.25)`), white text, matching font/size/radius of `PrimaryCTA` but with reduced visual weight
  - Opens the settings panel on click

### Tier 11 — Haptics on mobile
For supported devices (`navigator.vibrate`):
- 8ms tick on each of last 3 countdown seconds
- 30ms pulse on answer reveal
- 50ms double-pulse on Trivia Complete
- Off by default; toggle next to sound toggle

### Tier 12 — Loading state
**Unchanged** (per your note) — keep the existing spinner as-is.

---

### Files to create
- `src/lib/sound.ts` — preload + play helper, mute state in `localStorage`
- `src/lib/haptics.ts` — vibrate helper with capability check
- `src/hooks/useSound.ts` — React wrapper exposing `play(name)` + mute toggle
- `src/components/SoundToggle.tsx` — speaker icon button for header
- `src/components/HapticsToggle.tsx` — vibrate icon button (mobile-only)
- `src/components/PauseOverlay.tsx` — blur overlay shown when paused
- `src/components/ConfettiBurst.tsx` — CSS-only particle burst for result screen
- `src/components/KeyboardShortcutsHelp.tsx` — "?" pill + cheat sheet popover
- `src/components/SecondaryCTA.tsx` — ghost-variant CTA matching `PrimaryCTA` shape
- `public/sounds/{tick,reveal,transition,start,complete}.mp3` — 5 short royalty-free clips

### Files to edit
- `src/components/GameHeader.tsx` — mount `SoundToggle` + `HapticsToggle` + `KeyboardShortcutsHelp`
- `src/components/GameFooter.tsx` — last-5s color/pulse on countdown digit, scanline shimmer on bar, tick sound + haptic triggers
- `src/components/QuestionCard.tsx` — drumroll anticipation (question scale-down), divider sweep animation, spring-overshoot answer reveal, randomized entrance class, category-color border flash
- `src/components/TriviaGame.tsx` — wire reveal/transition sounds, mascot bounce/wobble/sparkle states, milestone particle trigger, pause overlay mount, keyboard handlers (`N`, `S`, `M`, `→`)
- `src/components/MascotSvg.tsx` — accept `state` prop (`idle | celebrate | urgent | paused`) driving micro-animations + sparkle burst
- `src/components/ResultScreen.tsx` — confetti burst on mount, add `SecondaryCTA` "Change Settings" beside "Play Again", play `complete` sound + haptic
- `src/components/StartScreen.tsx` — play `start` sound on Start Game click
- `src/index.css` — keyframes: `pulse-urgent`, `shimmer`, `divider-sweep`, `spring-rise`, `mascot-bounce`, `mascot-wobble`, `mascot-droop`, `sparkle-burst`, `confetti-fall`, `soft-zoom-in`, `fade-blur-in`
- `src/contexts/AuthContext.tsx` or new `src/contexts/PreferencesContext.tsx` — central sound + haptic preference state (chosen during build for cleanest integration)

### Technical notes
- All animations respect `prefers-reduced-motion` (sounds + haptics still fire; only motion is skipped/shortened)
- Sound files preloaded on first user gesture (browser autoplay policy)
- Confetti capped at 12 DOM nodes, 1.2s lifecycle, then unmounted
- `SecondaryCTA` exported as a reusable component for future use
- Keyboard shortcuts gated to `!isMobile` via existing `useIsMobile` hook
- Mascot state derives from `TriviaGame` game phase — no new global state

