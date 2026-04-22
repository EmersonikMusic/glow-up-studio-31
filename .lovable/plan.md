

## Plan: Mobile-landscape fixes, padding tweak, end-to-end QA

Layout-only changes. No gameplay, animation, or styling alterations beyond what's listed.

### Part 1 — Reduce QuestionCard inner padding (mobile portrait)

In `src/components/QuestionCard.tsx`, the card uses `padding: clamp(1.5rem, 4vw, 2.5rem)` on all four sides. On mobile portrait (390px wide), `4vw ≈ 15.6px` but the clamp floor is `1.5rem (24px)`, so horizontal padding is 24px each side. Reduce horizontal padding by ~10px on mobile only:

- Switch from a single `padding` shorthand to split vertical / horizontal padding.
- Vertical: keep `clamp(1.5rem, 4vw, 2.5rem)`.
- Horizontal: use `clamp(0.875rem, 3vw, 2.5rem)` so mobile portrait drops to ~14px (down ~10px from 24px), while tablet/desktop stay at the previous max.

### Part 2 — Mobile landscape display fixes

Current issues likely on phone landscape (e.g. 844×390):
1. Card is in a `w-full md:w-[70%]` column. On mobile-landscape it takes full width — there's no room for the mascot beside it, so mascot overlay sits over the card's lower-right and can crowd the answer text horizontally.
2. Footer's inner `<div>` is `w-full md:w-[70%]` — fine on mobile (full width).
3. The `mobile-landscape:pb-[96px]` class works only because index.css declares the exact escaped class inside a media query. On a 390px-tall viewport, even 96px bottom padding leaves ~150px for question text after header (~50px) and footer (~70px) — workable but tight.

Changes in `src/components/TriviaGame.tsx`:
- Card column on mobile-landscape: reserve room on the right so the mascot sits beside (not over) the card. Add a right padding override in index.css: `@media (max-height:500px) and (orientation:landscape) { .mobile-landscape\:pr-\[140px\] { padding-right: 140px !important; } }` and add `mobile-landscape:pr-[140px]` to the card column wrapper. This pushes the card text inward so the shrunk mascot (~120–180px) sits in the cleared right gutter without overlapping text.
- Mobile mascot overlay: in mobile-landscape, anchor it vertically centered against the card (not bottom-aligned with the footer). Add a media-query override in index.css setting `.mobile-mascot-overlay { bottom: 50% !important; transform: translateY(50%); right: 8px !important; }` so it sits beside the card mid-height instead of behind the footer. Keep portrait behavior unchanged (the rule only applies inside the landscape media query).

Changes in `src/index.css`:
- Add `.mobile-landscape\:pr-\[140px\] { padding-right: 140px !important; }` inside the existing `@media (max-height:500px) and (orientation:landscape)` block.
- Update the existing `.mobile-mascot-overlay` rule inside that same media query to also override `bottom`, `right`, and add a vertical centering transform.
- Add a small safety: reduce QuestionCard vertical padding floor to fit short viewports — extend the same media query with `[data-testid="question-card"] { padding-top: 0.75rem !important; padding-bottom: 0.75rem !important; }`.

### Part 3 — End-to-end verification via screenshots

After implementation, capture screenshots at each viewport on the live preview and confirm: header buttons visible and not wrapping, question card text fully on-screen and not overlapped, footer pill fully visible and tappable, mascot present (where applicable) and not covering text, settings panel opens in correct style (bottom sheet on phone portrait + phone landscape; side drawer on tablet+).

Viewports to verify:
1. 360×800 — phone portrait small
2. 390×844 — phone portrait standard
3. 414×896 — phone portrait large
4. 844×390 — phone landscape standard
5. 768×1024 — tablet portrait
6. 1024×768 — tablet landscape
7. 1280×720 — desktop small
8. 1920×1080 — desktop large

For each, capture: gameplay (mid-question) and settings-open state. Report any cut-off / overlap with a screenshot.

### Files touched
- `src/components/QuestionCard.tsx` — split padding into vertical/horizontal clamps.
- `src/components/TriviaGame.tsx` — add `mobile-landscape:pr-[140px]` to card column wrapper.
- `src/index.css` — extend mobile-landscape media query with new pr override, updated mascot anchoring, and reduced card vertical padding.

### Out of scope (layout-only)
- Any gameplay logic, timer, scoring, answer-reveal flow, question advancement.
- Animations, transitions, hover effects, float/pulse motion, fade-on-settings-open.
- Colors, gradients, glassmorphism styling, fonts, font weights.
- Desktop, tablet portrait, and tablet landscape layouts (verified only, not changed).
- Phone portrait beyond the requested 10px horizontal padding reduction on the card.
- Settings panel content, drawer widths on desktop, About / HowToPlay / Result / Start / Login screens.
- Mascot scale on desktop, mascot float animation, fade-on-settings-open behavior.
- Card width split (70/30 desktop), card content, footer pill content, font-size clamps.

