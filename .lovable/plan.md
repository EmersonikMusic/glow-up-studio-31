## Use official Google Sign-In button asset

The uploaded zip includes Google's official brand assets. The auth modal is dark-themed, so the correct variant per Google's branding guidelines is **Dark theme, "Sign in with Google" text, Pill shape** (Android + Web).

### Steps

1. **Extract & upload asset to CDN** (via `lovable-assets`):
   - `Android + Web/SVG/Dark/Theme=Dark, Show text=Yes, Shape=Pill, Platform=Android+Web.svg`
   - Rename on upload to `google-signin-dark-pill.svg`.
   - Write pointer to `src/assets/google-signin-dark-pill.svg.asset.json`.
   - Discard all other files from the zip (not needed).

2. **Update `src/components/AuthModal.tsx`**:
   - Remove the inline `GoogleIcon` SVG component and the current custom Google button styling.
   - Replace with a button that renders the official SVG as an `<img>` filling the button:
     ```tsx
     <button type="button" onClick={handleGoogle} disabled={loading}
             aria-label="Sign in with Google"
             className="w-full h-12 flex items-center justify-center disabled:opacity-60 active:scale-95 transition-all">
       <img src={googleBtn.url} alt="" className="h-12 w-auto" draggable={false} />
     </button>
     ```
   - Keep the button `w-full` and stacked above the Apple button (unchanged).
   - Height matches Google's min-height guidance (48px = `h-12`), full width for parity with the Sign In button. No extra background/border — Google's asset includes its own container per branding guidelines.

3. **Verify**: typecheck + Playwright screenshot of the open auth modal to confirm the official button renders correctly on the dark dialog.

### Out of scope
- Apple button (stays as the current custom dark styling).
- Light/neutral variants (not needed for this dark modal).
- iOS assets (React web app).
