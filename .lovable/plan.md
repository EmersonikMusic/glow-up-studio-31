Remove the logo and eyebrow label from the login modal header.

1. In `src/components/AuthModal.tsx`:
   - Delete the logo `<div>` that shows the Triviolivia small logo.
   - Delete the teal "Welcome to" / "Join" eyebrow paragraph above the heading.
   - Remove the now-unused `toLogoSm` import.

2. Leave the main "Welcome Back" / "Create Account" heading and the description subtext unchanged.

3. Verify by opening the login modal at desktop and mobile widths and confirming only the heading and description remain at the top of the modal.