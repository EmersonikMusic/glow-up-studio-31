The previous proportional scaling made the Google button too tall (~71px). Instead, keep the Google button at the same 40px height as the Apple button and make it span the full width of the CTA container.

Changes:

1. **File: `src/components/AuthModal.tsx`**
   - Replace the `<img>`-based Google SVG pill with a custom full-width button that matches the Apple button's 40px height and layout pattern.
   - Use an inline multicolor Google "G" logo SVG as the left icon.
   - Use the text "Sign in with Google" in the same white, system-font styling as the Apple button.
   - Keep the dark background, rounded-full shape, and interaction states (active scale, disabled opacity) to align with the existing social button styling.
   - Keep the click handler, aria-label, and loading behavior unchanged.

Result:
- The Google button will match the CTA width without growing taller than the Apple button.
- Both social buttons will remain stacked and visually consistent at 40px height.
- This is still compliant with Google's guidelines because it uses the official Google "G" logo and "Sign in with Google" text on a dark background, and custom buttons are explicitly allowed.

No other files or backend changes are needed.