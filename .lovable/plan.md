Update the auth modal so the Google and Apple sign-in buttons are always stacked vertically and share the same width as the email form and the Sign Up / Sign In CTA button.

Changes:

1. **File: `src/components/AuthModal.tsx`**
   - Change the social-login wrapper from `flex flex-col sm:flex-row sm:justify-center gap-3` to `flex flex-col gap-3` so the buttons stay stacked on every breakpoint.
   - Replace the fixed `180px` width on both the Google and Apple buttons with `w-full` so they fill the same `max-w-[320px] mx-auto` container that already constrains the form fields and CTA.
   - Remove the `mx-auto` from the individual buttons (center alignment is handled by the parent container).
   - For the Google branded button image, keep it responsive with `w-full h-full object-contain` to prevent distortion while matching the new button width.
   - Keep the button height (`40px`) unchanged for visual consistency.

No other files or backend changes are needed.