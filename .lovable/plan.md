## Apple Sign In button styling (visual only, not wired up)

Per Apple's Sign in with Apple JS guidelines (https://developer.apple.com/documentation/signinwithapplejs/incorporating-sign-in-with-apple-into-other-platforms and HIG), the button has strict specs. We'll match them for the dark modal.

### Spec (from Apple)
- **Label**: "Sign in with Apple" (Sign In mode) / "Sign up with Apple" (Sign Up mode). Apple allows "Continue with Apple" too, but the standard pair is Sign in / Sign up.
- **Logo**: Official Apple  glyph, always paired with text at the same font size.
- **Colors**: Black button with white logo + white text (matches our dark modal). Alt is white with black logo, or white with black outline. We'll use black.
- **Corner radius**: Between 0 and half the button height. Our other buttons are pill-shaped (`rounded-full`), so match that.
- **Height**: Minimum 32px. We use `h-12` (48px) to match the Google button.
- **Font**: SF Pro (system font stack: `-apple-system, BlinkMacSystemFont, "SF Pro Text", ...`) — already set.
- **Font weight**: Medium (500).
- **Padding**: Logo left, text centered. Minimum internal padding equal to logo height.
- **Logo size**: ~43% of button height (per Apple sizing rules → ~20px for a 48px button).

### Changes to `src/components/AuthModal.tsx`

1. **Replace the current Apple button** (currently `disabled opacity-50`). Keep it non-functional but visually correct:
   - Remove `disabled`, `opacity-50`, `cursor-not-allowed`, and `title="Coming soon"`.
   - Add `onClick` that shows a toast: "Apple sign-in coming soon" (or no-op). Kept purely visual — no OAuth call.
   - Keep `w-full h-12 rounded-full` (matches Google button).
   - Background `#000`, text `#fff`, no border needed on dark bg (Apple's spec says border only if the button color matches page bg).
   - Update label to be mode-aware: `{isSignup ? "Sign up with Apple" : "Sign in with Apple"}`.
   - Font size 17px (Apple's recommended for body button text) or 15px to match Google's rendered text — we'll use `text-[15px]` for visual parity with the Google asset next to it.
   - Font weight `font-medium` (500).
   - Letter-spacing per Apple: subtle, use `-0.01em` or leave default.

2. **Refine `AppleIcon`**: current path is fine but we'll size it at `w-5 h-5` (20px) which is ~42% of 48px — within Apple's range. White fill via `text-white` + `fill="currentColor"` (already set).

3. **Symmetry with Google**: The Google asset already includes its own glyph + text baked into the SVG. Our Apple button will be a native `<button>` with `<AppleIcon>` + `<span>` — same outer dimensions (`w-full h-12 rounded-full`) so they stack as a matched pair.

### Out of scope
- Wiring `lovable.auth.signInWithOAuth("apple", ...)` — the button stays inert per the request.
- Configuring the Apple provider in the backend.
- Changes to the Google button, form, or any other modal content.

### Verification
- Typecheck.
- Playwright screenshot of the open modal in both Sign In and Sign Up modes to confirm the label swaps and the button visually matches Apple's spec next to the Google button.
