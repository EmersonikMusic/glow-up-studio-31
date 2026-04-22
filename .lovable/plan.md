

## Mobile Layout Fix: Reduce Card Padding & Lower Mascot

### Problem
On mobile, the mascot SVG (anchored at `bottom: 64px`, sized up to 200px) overlaps the question/answer text because the QuestionCard centers its content vertically with generous top/bottom padding. Long questions + revealed answers push content down into the mascot's area.

### Changes

**1. `src/components/QuestionCard.tsx` — Top-align content on mobile, reduce vertical padding**
- Change `justify-center` to `justify-start` so question text anchors to the top of the card on mobile (keep centered on desktop via `md:justify-center`).
- Reduce mobile vertical padding: change `paddingTop`/`paddingBottom` from `clamp(1.5rem, 4vw, 2.5rem)` to `clamp(0.75rem, 2.5vw, 2.5rem)` so the question sits closer to the top edge.

**2. `src/components/TriviaGame.tsx` — Lower the mobile mascot toward the footer**
- Move mascot anchor from `bottom: 64px` down to `bottom: 8px` so it tucks just above the footer pill (footer is ~auto-height, the pill itself provides clearance).
- Slightly shrink the mascot to reduce vertical footprint: `clamp(120px, 32vw, 170px)` instead of `clamp(140px, 38vw, 200px)`.
- Keep `right-0`, `justify-end`, `z-20`, and the float animation untouched.

**3. Verification**
After implementation, test in the 472×702 viewport (current preview) with:
- Longest question sample from the question bank
- Longest answer sample (revealed state)
- Confirm the question text top edge sits ~12px from card top, and the mascot's top edge stays below the answer reveal text with at least 8px clearance.

### Technical Details

```tsx
// QuestionCard.tsx — mobile-first top alignment
className="... flex flex-col justify-start md:justify-center items-center ..."
style={{
  paddingTop: "clamp(0.75rem, 2.5vw, 2.5rem)",
  paddingBottom: "clamp(0.75rem, 2.5vw, 2.5rem)",
  // ... rest unchanged
}}
```

```tsx
// TriviaGame.tsx — mobile mascot lower & smaller
<div
  className="md:hidden absolute right-0 pointer-events-none z-20 flex items-end justify-end mobile-mascot-overlay"
  style={{
    width: "clamp(120px, 32vw, 170px)",
    height: "clamp(120px, 32vw, 170px)",
    bottom: "8px",
    // ... rest unchanged
  }}
>
```

### Files Edited
- `src/components/QuestionCard.tsx`
- `src/components/TriviaGame.tsx`

