Plan: Increase the "CUSTOMIZE YOUR EXPERIENCE" title font size on mobile

1. Read the current title styling in `src/components/SettingsPanel.tsx` (already done).
2. Bump the mobile font size from `text-lg` to `text-xl` while keeping `sm:text-2xl` and `md:text-4xl` breakpoints intact.
3. Verify visually with a mobile screenshot that the title does not wrap to a second line on a 390px viewport. If it wraps, scale back to a custom size between `text-lg` and `text-xl` (e.g., `text-[1.15rem]`).
4. Keep the increased vertical padding from the previous change.