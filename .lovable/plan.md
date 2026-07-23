## Problem

On mobile, certain question text (e.g. the Tennessee Williams / Blanche DuBois question in the attached screenshot) makes the game screen render wider than the viewport. Visible symptoms:

- Header's rightmost icon (mute) is clipped past the right edge.
- Footer's rightmost chevron (skip) is clipped past the right edge.
- Question card sits flush to both viewport edges instead of inside the standard `px-3` padding.

The outer grid uses `overflow-hidden`, so the page doesn't scroll horizontally — but the row still lays out at a wider intrinsic width, so all three rows (header, main, footer) render offset/clipped.

## Root cause

Three latent width-leaks combine on longer question text:

1. `src/components/TriviaGame.tsx` line 724: `<main class="... overflow-visible">` explicitly opts out of horizontal clipping.
2. Same file, line 726: the mobile game column is `flex-none w-full` with **no `min-w-0`**. Flex items default to `min-width: auto`, so if any descendant reports a min-content width larger than 100%, the column grows past the viewport instead of shrinking.
3. `src/components/QuestionCard.tsx` line 110: the card root and its `<p>` have no `min-w-0` / `max-w-full` / word-break guard. The auto-fit loop stops shrinking at `FONT_SCALE_FLOOR = 0.7`, so if the min-content width of the text at 0.7× still exceeds the column, the text pushes the card wider.

## Fix

Small, presentation-only edits. No logic or copy changes.

### 1. `src/components/TriviaGame.tsx`

- `<main>` (line 724): swap `overflow-visible` → `overflow-hidden`, and add `min-w-0` so nothing inside can force it wider than its grid cell.
- Game column div (line 726): add `min-w-0 max-w-full` alongside the existing `flex-none w-full ...` classes.

### 2. `src/components/QuestionCard.tsx`

- Card root `<div>` (line 110): add `min-w-0 max-w-full` to the className.
- Mobile question zone container (line 126) and answer zone container (line 162): add `min-w-0` (belt-and-braces so the flex children can shrink).
- Question `<p>` and answer `<p>` styles: add `overflowWrap: "anywhere"` and `wordBreak: "normal"` so any pathological long token (URL, hyphenated compound, punctuation-glued sequence) breaks safely instead of pushing the column. Keeps `textWrap: "balance"` for normal wrapping.

### 3. Verification (once switched to build mode)

Playwright script at 393×801, iterate through ~20 questions, at each one:
- Pause via Space (mirrors screenshot state).
- Assert `header.right === main.right === footer.right === 393` and `document.body.scrollWidth === 393`.
- Screenshot on any deviation.

Also spot-check the Tennessee Williams question specifically by seeding it if it reappears in rotation, and confirm at 320px (smallest supported) that nothing clips.

## Scope guardrails

- No changes to question text, font sizes, animations, or the auto-fit loop.
- No changes to the desktop layout (all edits are neutral there — `min-w-0` / `max-w-full` / `overflow-hidden` on `<main>` don't affect the current desktop rendering because desktop content already fits).
- No changes to header/footer components — the fix is purely upstream in the containers that were letting content push them wider.
