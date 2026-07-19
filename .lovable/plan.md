Plan: Adjust SettingsPanel header size for mobile

1. Locate the mobile Settings sheet header h2 in `src/components/SettingsPanel.tsx` (currently rendered in `panelContent` around line 435).
2. Change its font size from the fixed `text-4xl` to a responsive scale so it fits on a single line on the smallest mobile viewports (e.g. `text-2xl sm:text-3xl md:text-4xl`) or a custom `clamp()` value.
3. Keep the existing rainbow gradient background-clip text styling and inline `lineHeight`/`textAlign` untouched so the gradient coloring remains consistent.
4. Verify in the mobile preview that "CUSTOMIZE YOUR EXPERIENCE" stays on one line and the gradient no longer breaks across lines.