
## Plan: Footer pill text tweaks

### Changes — `src/components/GameFooter.tsx` only

1. **Remove "Q" prefix** (line ~70): change `Q{questionIndex + 1}/{totalQuestions}` → `{questionIndex + 1}/{totalQuestions}`.

2. **Lowercase the "s" in timer** (lines ~62 + ~85): the pill currently has `uppercase` Tailwind class on the container and timer span, which forces the "s" to render as "S". Wrap the literal `s` in a span with `normal-case` so it stays lowercase while the number stays as-is:
   ```
   {isAnswerPhase ? (answerCountdown ?? 0) : countdown}<span className="normal-case">s</span>
   ```

### Files touched
- `src/components/GameFooter.tsx`

### Out of scope
No layout, color, padding, or timer logic changes.

### Verification
Start a game: footer pill shows `1/10 · CATEGORY · DIFFICULTY` and timer reads e.g. `12s` (lowercase s). Answer phase timer also shows lowercase s.
