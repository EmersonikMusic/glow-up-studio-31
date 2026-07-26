Plan: Adjust the mobile SettingsPanel header spacing and sheet height

1. Read the current state of `src/components/SettingsPanel.tsx` (already done).
2. Increase the vertical padding on mobile for the "CUSTOMIZE YOUR EXPERIENCE" title block to match the breathing room shown in the reference image. Keep desktop padding roughly the same.
   - Current mobile: `pt-2 pb-2`
   - Proposed mobile: `pt-5 pb-4` (or similar) with the title text size kept at `text-lg` on the smallest screens so it still fits.
3. Prevent the top of the mobile bottom sheet from overlapping/covering the nav header behind it:
   - The bottom sheet is currently `maxHeight: 92dvh` and covers the fixed header.
   - Reduce the max height on mobile (e.g., to `85dvh` or `calc(100dvh - header-height)`) so a clear gap remains below the nav header.
   - Alternative: add a top margin/padding to the sheet container so it starts lower.
4. Keep all content scrollable inside the sheet so the extra header padding does not push the Apply button off-screen.
5. Verify the change visually (preview or Playwright mobile screenshot) to confirm the title has more vertical space and the header is still visible behind the sheet.