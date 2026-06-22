Problem: On mobile, the footer pill's category/difficulty text runs into the absolute-positioned countdown timer (e.g., "AVERAGE10s"). The pill content has no reserved space on the right, so long metadata overlaps the timer.

Solution: Reserve a fixed space for the timer on the right side of the metadata pill so the text can never overlap it.

Changes to `src/components/GameFooter.tsx`:
- Wrap the metadata text content in a flex container with a right margin/padding large enough for the timer (e.g., `pr-8` or similar) on mobile.
- Keep the timer absolute-positioned at `right-3` for vertical alignment, but ensure the content row has `overflow-hidden` and `text-ellipsis` fallback for very long categories/difficulty labels on small screens.
- Leave desktop layout unchanged, since the issue only appears on mobile.

Verification:
- Test on a 390px mobile viewport and confirm the timer no longer overlaps the metadata text.
- Test with a long category/difficulty combination to ensure text either truncates cleanly or the timer remains fully visible.