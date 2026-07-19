Add the Follow Us section to the About screen's scroll-spy anchor navigation so it behaves like the other section headers.

## What will change

In `src/components/AboutScreen.tsx`:

1. Extend the `SectionKey` union to include `"follow"`.
2. Add a `followRef` ref and wire it into the `sections` array used for scroll-spy and the anchor nav chips.
3. Wrap the existing Follow Us heading block in `followRef` and update its label to match the anchor chip text.
4. Keep the existing teal uppercase header styling (`text-sm font-subheading font-bold tracking-[0.18em] uppercase`, `hsl(185 70% 55%)`) so it visually matches the other sections.

The result: the Follow Us heading gets an active-state anchor chip in the nav strip, and clicking that chip smoothly scrolls to the Follow Us section just like the other sections.