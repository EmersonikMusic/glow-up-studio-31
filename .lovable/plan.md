Center the Google logo and "Sign in with Google" text inside the pill so it matches the existing Apple button's centered layout.

What will change:
- Update the Google button in `src/components/AuthModal.tsx` to use `justify-center` instead of `justify-start` and remove the fixed left padding that anchors the G logo.
- Keep Google branding colors (`#131314` fill, `#8E918F` border, `#E3E3E3` text) and typography as-is, so only the alignment changes.
- Keep the Apple button untouched.

Trade-off to note: Google's official "Sign in with Google" branding guidelines show the dark pill with left-aligned content. Centering it will make the two social buttons look identical in layout, but will deviate from that specific Google guideline.

Verification: measure the button at 375px, 768px, and 1280px viewports to confirm the G logo and text are visually centered inside the pill.