## Goal
Make the "Quick Play" button match the width of the "Customize Game" button on the Start screen.

## Why current approach fails
Both buttons currently use `min-w-[260px]`, but "Customize Game" renders wider than 260px due to its longer text + `tracking-[0.18em]` + `px-10` padding, so each button sizes to its own content above the min-width.

## Change
In `src/components/StartScreen.tsx`, wrap the two CTAs in a shared-width container so both stretch to the widest child:

- Wrap `<PrimaryCTA>` and `<SecondaryCTA>` in `<div className="mt-8 flex flex-col items-stretch w-fit mx-auto">`.
- Remove `min-w-[260px]` and the `mt-8` / `mt-3` margins from the buttons themselves.
- Add `w-full` to both buttons so they fill the container.
- Re-add `mt-3` to the SecondaryCTA for vertical spacing between the two.
- Keep all other classes, animations, `animationDelay: "180ms"`, `trackId`, `aria-label`, and font sizes unchanged.

Result: container sizes to the natural width of "Customize Game" (the wider button), and "Quick Play" stretches to match exactly. No font-size change.

## Verification
Visually confirm in preview at desktop and mobile widths that both buttons share the same width and remain horizontally centered.
