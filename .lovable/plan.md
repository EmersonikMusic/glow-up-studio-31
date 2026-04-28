Plan to make TRIVIOLIVIA cooler, more styled, and more fun while keeping it classy

I’ll enhance the existing dark glassmorphism/game-show style rather than changing the brand direction. The goal is “premium trivia arcade,” not goofy or chaotic.

What I’ll update

1. Upgrade the start screen atmosphere
- Add subtle layered background texture: soft radial glows, a faint vignette, and tasteful animated light streaks.
- Add a restrained “stage spotlight” feel behind the logo.
- Improve the logo entrance with a polished float/glow animation instead of anything bouncy or silly.
- Add subtle decorative gold/teal accents around the main CTA.

2. Make the main gameplay screen feel richer
- Add a classy animated ambient overlay on top of category gradients so each category feels more alive.
- Enhance the question card with:
  - richer glass border highlights
  - inner glow
  - subtle animated sheen
  - slightly more dimensional shadowing
- Keep the card readable and uncluttered, especially on mobile.

3. Improve animations during gameplay
- Add refined question transitions: soft rise, blur fade, and light scale-in variety.
- Add a tasteful answer reveal treatment: divider glow, controlled spring-in, and a brief “knowledge reveal” highlight.
- Keep urgency animations restrained so the countdown remains useful, not stressful.

4. Polish buttons and navigation
- Upgrade nav buttons with a more premium glass hover state on pointer devices only.
- Enhance the Start Game / Play Again CTA with a soft animated glow and light sweep.
- Keep mobile/touch behavior clean with no hover-only effects on phones.

5. Add classy decorative motion utilities
- Add reusable CSS animations for:
  - ambient drift
  - shimmer/sheen
  - soft glow pulse
  - premium card entrance
  - spotlight breathing
- Respect reduced-motion settings so users who prefer less motion won’t get animated effects.

6. Improve result screen polish
- Make the completion card feel more celebratory but still refined.
- Keep confetti subtle; enhance the glass card, mascot glow, and button spacing rather than adding zany effects.

Files likely to change

- `src/index.css`
  - Add the new animation keyframes and reusable styling utilities.
- `src/components/StartScreen.tsx`
  - Add layered ambient visuals and refined logo/CTA presentation.
- `src/components/QuestionCard.tsx`
  - Upgrade glass card visuals and answer reveal polish.
- `src/components/TriviaGame.tsx`
  - Add ambient gameplay overlay around category gradients and mascot glow refinements.
- `src/components/GameHeader.tsx`
  - Improve nav glass styling and hover polish.
- `src/components/GameFooter.tsx`
  - Add refined timer/footer styling without making it visually noisy.
- `src/components/ResultScreen.tsx`
  - Add premium finish-screen styling.
- `tailwind.config.ts`
  - Add reusable animation utilities if needed.

Design guardrails

- Keep the existing dark, glassy TRIVIOLIVIA brand.
- Keep gold and teal as the main accents.
- Keep animations subtle, smooth, and classy.
- Avoid silly/cartoon effects, excessive bouncing, or clutter.
- Preserve mobile layout and readability.
- Preserve reduced-motion accessibility.

After implementation, I’ll visually check the preview and make sure the updated styling feels cooler without hurting gameplay readability.