## Add Privacy Policy Link + Screen

### Goal
Add a privacy policy link to the app's legal footer wherever the copyright line is shown, plus a full-screen privacy policy overlay with placeholder content styled like the existing About Us / How To Play screens.

### Scope
- Visible only on screens that already display the copyright line: **StartScreen** and **ResultScreen**.
- Hidden during active gameplay (playing / answered / loading), consistent with the current copyright behavior.
- No backend changes; no legal copy changes beyond placeholder text.

### 1. Shared Legal Footer component
Create `src/components/LegalFooter.tsx`:
- Replaces the inline copyright lines in both StartScreen and ResultScreen.
- Keeps existing copyright text and styling (white, centered, `text-[10px] sm:text-xs`).
- Adds a "Privacy Policy" link to the right of the copyright with a separator.
- Link: white, underlined, same font as copyright; hover turns teal and uses the same `translateY(-2px)` lift animation already defined for `.howto-link`.
- Tracks click via `trackClick("click_privacy_policy")`.

### 2. Privacy Policy overlay
Create `src/components/PrivacyScreen.tsx` based on `AboutScreen` and `HowToPlayScreen`:
- Full-screen fixed overlay (`z-50`) with ambient background blobs.
- Glass card: `backdrop-blur-xl`, rounded corners on desktop, full-screen on mobile.
- Close button (top-right, `ChevronsLeft`, matches About/How To Play).
- Header: small teal label "Legal" + large gradient headline "Privacy Policy".
- Scrollable body containing placeholder sections, each with a teal sub-headline and white body paragraph.
- Footer CTA "Back to Game" that closes the screen.
- Entry/exit animation matching the About screen (slide on mobile, fade on desktop).

### 3. TriviaGame wiring
Update `src/components/TriviaGame.tsx`:
- Add `showPrivacy` state.
- Render `<PrivacyScreen onClose={() => setShowPrivacy(false)} />` when `showPrivacy` is true.
- Pass `onPrivacy={() => setShowPrivacy(true)}` to both `StartScreen` and `ResultScreen`.

### 4. Update StartScreen and ResultScreen
Update `src/components/StartScreen.tsx` and `src/components/ResultScreen.tsx`:
- Accept the new `onPrivacy` prop.
- Replace the existing inline copyright markup with `<LegalFooter onPrivacy={onPrivacy} />`.
- Keep the existing responsive positioning and animation delay.

### 5. Verify
- Type-check the project.
- Confirm the link appears on the start screen and result screen.
- Confirm it is absent during active gameplay (question footer shows only the game timer/progress bar).
- Confirm clicking the link opens the Privacy overlay and the close button returns to the previous screen.