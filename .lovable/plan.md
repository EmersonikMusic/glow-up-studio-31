Four targeted UI tweaks. Frontend-only, no logic or copy changes.

## 1. Review Your Game modal — mobile width

The dialog uses `w-full max-w-2xl mx-4` but `w-full` + `translate-x-[-50%]` ignores `mx-4`, so on 390px the right edge clips.

Change the `DialogContent` className in `src/components/ResultScreen.tsx` so the width is constrained on mobile:
- swap `max-w-2xl mx-4` → `w-[calc(100%-2rem)] max-w-2xl`

This guarantees 1rem gutter on both sides at every viewport, while staying max 672px on desktop.

## 2. Thumbs up/down spacing

Inside the Rate cell, bump the gap on mobile from `gap-1` → `gap-2` (keep `sm:gap-2`) and shrink the cell width slightly (`w-[88px]` → `w-[96px]`) so the two 44px tap targets have breathing room without re-clipping.

## 3. Active thumb visual — outline only, no gradient fill

Today an active vote fills the icon with the `#thumb-gradient` (red→yellow). Change active state to match hover: stroke = `hsl(var(--game-gold))`, fill = `none`. Keep the bump scale animation.

Implementation in `ResultScreen.tsx`:
- Remove the `<svg>` defs block (no longer needed).
- In the button's `Icon`: drop `stroke={active ? "url(#thumb-gradient)" : "currentColor"}` and `fill={active ? "url(#thumb-gradient)" : "none"}`.
- Drive color via className: when `active`, add `text-[hsl(var(--game-gold))]`; otherwise keep `text-white/65` with existing hover class. Use `stroke="currentColor"` and `fill="none"`.

## 4. Gold header gradient — match Primary CTA

Current gold headers (Trivia Complete, Review Your Game) use:
```
linear-gradient(160deg, hsl(42 100% 62%) 0%, hsl(35 90% 48%) 45%, hsl(28 90% 40%) 100%)
```

Primary CTA uses (bottom → top):
```
linear-gradient(0deg, #e93e3a 0%, #ed683c 11%, #f3903f 33%, #fdc70c 72%, #fff33b 100%)
```

To match the CTA's direction and color stops on text, switch both headers to:
```
linear-gradient(0deg, #e93e3a 0%, #ed683c 11%, #f3903f 33%, #fdc70c 72%, #fff33b 100%)
```
(bottom-red → top-yellow, identical stops).

Apply in:
- `ResultScreen.tsx` `<h1>` "Trivia Complete!" inline style
- `ResultScreen.tsx` `DialogTitle` "Review Your Game" inline style

No other gold-gradient headers identified; if any surface later (e.g. About), they can adopt the same string.

## Verification

Playwright at 390×801 and 1280×800:
- screenshot Review modal — confirm equal left/right gutter and no horizontal scroll
- click a thumbs up — confirm icon outline turns gold, no fill
- visually compare header gradient direction vs Play Again CTA
