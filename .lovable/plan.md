# Plan: Split the Legal headline into two lines with a continuous gradient

## Goal
Break the `TERMS OF SERVICE & PRIVACY POLICY` headline in `src/components/LegalContent.tsx` into two lines — `TERMS OF SERVICE` on line 1 and `& PRIVACY POLICY` on line 2 — and ensure the red→yellow gradient flows as one continuous gradient across both lines (not reset per line).

## Current state
Single line, one gradient:
```jsx
<h1 ...style={{ background: "linear-gradient(0deg, #e93e3a 0%, ... #fff33b 100%)", backgroundClip: "text", ... }}>
  TERMS OF SERVICE & PRIVACY POLICY
</h1>
```

## Change
Replace the single text node with an explicit `<br />` between `SERVICE` and `&`:
```jsx
TERMS OF SERVICE & PRIVACY POLICY
  →  TERMS OF SERVICE <br /> & PRIVACY POLICY
```
So the rendered output is:
```
TERMS OF SERVICE
& PRIVACY POLICY
```

## Gradient behavior — no CSS change needed
The existing gradient uses `background-clip: text` on the `<h1>` itself. With `background-clip: text`, the gradient is painted once over the element's full background box (the whole two-line height) and then clipped to the text glyphs. It is **not** reset per line. So once the `<br />` creates two lines, the single red→yellow gradient automatically spans continuously across both lines — top line leans toward the yellow end, bottom line toward the red end, as one unbroken gradient.

No edits to the `style` object, `className`, or gradient stops are required. Only the text node changes.

## Scope / out of scope
- In: add the `<br />` to force the line break.
- Out: no gradient CSS changes, no font-size/spacing changes, no changes to Terms of Service, no Terms.tsx edits.
