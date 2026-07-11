## Update Privacy Policy Page + Footer Link

### Goal
Replace the placeholder privacy policy page with the provided Terms of Service & Privacy Policy copy, rename the footer link to "Terms of Service & Privacy Policy", and stack the footer text on mobile.

### Scope
- Only `src/components/PrivacyScreen.tsx` and `src/components/LegalFooter.tsx` are affected.
- No backend or routing changes.

### 1. Update PrivacyScreen content
Rewrite `src/components/PrivacyScreen.tsx` to use the provided copy:
- Header label: "Legal"
- Header headline: "Triviolivia Terms of Service & Privacy Policy"
- Effective date line under the headline.
- Intro paragraph about agreeing to the Terms and Privacy Policy.
- Section: "Part 1: Terms of Service" with the 6 numbered items (Eligibility, Intellectual Property, User Conduct, Termination, Limitation of Liability, Governing Law).
- Section: "Part 2: Privacy Policy" with the 7 numbered items (Information We Collect, How We Use, Sharing, Data Security & Retention, Your Rights, Changes, Contact Us).
- Keep the existing teal sub-heading / white body text styling, glass card, close button, and "Back to Game" CTA.
- Keep the contact email link styled consistently with the rest of the app.

### 2. Rename the footer link
Update `src/components/LegalFooter.tsx`:
- Change the link text from "Privacy Policy" to "Terms of Service & Privacy Policy".
- Update the aria-label to match.

### 3. Mobile stacking
Update `src/components/LegalFooter.tsx`:
- On mobile: copyright and link are stacked vertically (`flex-col`).
- On desktop (`sm:` and up): copyright and link are on the same horizontal line (`sm:flex-row`).
- Hide the separator dot on mobile, show it on desktop.
- Keep the copyright text and link in the same white font and underline styling; hover behavior unchanged.

### 4. Verify
- Type-check and build the project.
- Confirm the start screen and result screen show the new link text.
- Confirm the footer text stacks on mobile and sits on one line on desktop.
- Confirm opening the screen shows the new Terms of Service & Privacy Policy copy.