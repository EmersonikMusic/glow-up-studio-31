
## Plan: Stop clipping the leading/trailing "E" in the tagline

### Root cause
The SVG itself uses `viewBox="0 0 600 60"` and `preserveAspectRatio="xMidYMid meet"`. The text path runs from x=60 → x=540 with `font-size: 24px` and `letter-spacing: 0.16em`. The drop-shadow filter region is `x="-5%" y="-20%" width="110%" height="160%"` — but `filter` regions clip glyphs that render outside that region. Because the textPath is centered on a 480px arc and the rendered string is wider than 480px once kerning + shadow are added, the first "E" of EARTH and last "E" of SOURCE fall outside the filter's horizontal region and get masked away.

### Fix (StartScreen.tsx, lines ~76–105)
1. **Widen the filter region** so it cannot clip glyphs:
   - `x="-20%" y="-50%" width="140%" height="200%"` (generous on both axes; covers shadow + any glyph overflow).
2. **Give the textPath more arc length** so the string is not forced past the path endpoints:
   - Path: `d="M 30 46 Q 300 14 570 46"` (endpoints at x=30 and x=570 inside the 600 viewBox).
3. **Add horizontal breathing room in the SVG itself** in case glyphs still extend past the path ends:
   - Change `viewBox` from `0 0 600 60` → `-20 0 640 60` so x=-20…620 is renderable.
4. **Verify** with the browser tool at 390px (current viewport): screenshot the start screen and confirm both the leading "E" in EARTH and trailing "E" in SOURCE render fully. Re-check at 768px and 1280px.

### Files touched
- `src/components/StartScreen.tsx` — viewBox, arc path, filter region only

### Out of scope
- No font-size, letter-spacing, color, or copy changes
- No header / username pill changes
