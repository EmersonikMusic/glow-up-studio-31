## Bring Google/Apple button typography and icon sizes closer — within brand rules

### What the guidelines allow
- **Google**: cannot change font size or "G" icon size independently. Can only scale the entire pre-approved pill uniformly (aspect ratio preserved).
- **Apple** (SDK button): text is auto-sized to ~43% of button height; logo height equals button height. Adjusting `data-height` scales both proportionally.

So the only compliant lever we have is: **change both buttons' overall height to the same value**. That's what will make the visible font and icon sizes converge.

### Current state
- Google SVG: natural 180×40, rendered at `h-12` (48px tall) → scaled 1.2×, effective font ≈ 16.8px, icon ≈ 22px.
- Apple SDK: `data-height="48"`, `data-width="216"` → font ≈ 20.6px, logo ≈ 48px tall.
- Result: Apple text and logo look meaningfully larger than Google's.

### Change
Drop both buttons to Google's native 40px height. That's the sharpest render for Google's asset (no scaling) and pulls Apple's SDK proportions down closest to Google's.

1. `src/components/AuthModal.tsx`
   - Update the shared constant:
     ```
     // Google's dark pill SVG is intrinsically 180x40. Rendering both social
     // buttons at that exact size (a) keeps Google's asset unscaled, and
     // (b) lets Apple's SDK auto-scale its text/logo to match as closely as
     // Apple's proportions allow. Both changes are compliant with each
     // brand's guidelines.
     const SOCIAL_BTN_WIDTH = 180;
     const SOCIAL_BTN_HEIGHT = 40;
     ```
     (Replaces `APPLE_BTN_WIDTH = 216`.)
   - Google `<button>`:
     - `className`: `mx-auto flex items-center justify-center rounded-full overflow-hidden transition-all active:scale-95 disabled:opacity-60` (drop `h-12`).
     - `style={{ width: SOCIAL_BTN_WIDTH, height: SOCIAL_BTN_HEIGHT, maxWidth: "100%" }}`.
     - Inner `<img>`: `className="h-full w-auto"` (still no distortion; renders 1:1 at 180×40).
   - Apple wrapper `<div>`:
     - Drop `h-12`; set `style={{ width: SOCIAL_BTN_WIDTH, height: SOCIAL_BTN_HEIGHT, maxWidth: "100%", background: "#000000" }}`.
   - Apple inner `<div id="appleid-signin">`:
     - `data-width={String(SOCIAL_BTN_WIDTH)}` → `"180"`.
     - `data-height={String(SOCIAL_BTN_HEIGHT)}` → `"40"`.
     - (Both values are inside Apple's accepted ranges: width 130–375, height 30–64.)

### Verification
Playwright screenshot the modal in Sign In and Sign Up modes at h=40. Confirm:
- Both buttons render at exactly 180×40.
- Google "G" and Apple logo appear visually closer in size than they do today.
- Apple's "Sign in with Apple" / "Sign up with Apple" text no longer visibly dwarfs Google's label.

### Not doing
- No changes to Google's SVG asset, spacing, or colors.
- No Apple custom (non-SDK) button — we keep the SDK-rendered button so Apple's proportions stay official.
- No independent font-size or icon-size overrides on either button (both would violate the respective guidelines).

### Trade-off to flag
Even at matched 40px height, Apple's text will still render slightly larger than Google's (Apple ≈17px vs Google 14px) because each brand controls its own internal proportions. This is as close as we can get without breaking either guideline. If you'd rather keep h-12 and accept the current mismatch, say so and I'll skip.
