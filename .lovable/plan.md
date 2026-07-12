## Custom Sign in with Apple button + responsive social button layout

To hit an exact font-size (16px) and control the icon scale, we replace Apple's SDK-rendered button with a **custom** Sign in with Apple button — a path Apple's Human Interface Guidelines explicitly permit (custom buttons may adjust "title font — you can also adjust the font's weight and size"). We keep the SDK loaded, but drive `AppleID.auth.signIn()` from our own button once credentials are wired up.

### 1. Layout — side-by-side on tablet+desktop, stacked on mobile

`src/components/AuthModal.tsx`, the social buttons wrapper:

- Current: `<div className="flex flex-col gap-3">`
- Change to: `<div className="flex flex-col sm:flex-row sm:justify-center gap-3">`

Tailwind's `sm` breakpoint (≥640px) covers tablet and desktop. Two 180px buttons + a 12px gap = 372px, comfortably inside the modal's `max-w-md` (~448px). Below 640px they stack, keeping the current mobile look. `mx-auto` already on each child continues to work for the stacked case.

### 2. Custom Apple button

Structure inside the same wrapper, replacing the SDK-rendered `<div id="appleid-signin">`:

```
<button
  type="button"
  onClick={handleAppleClick}
  aria-label={isSignup ? "Sign up with Apple" : "Sign in with Apple"}
  aria-disabled={!APPLE_AUTH_READY}
  className="mx-auto flex items-center justify-center gap-2 rounded-full overflow-hidden transition-all active:scale-95"
  style={{ width: SOCIAL_BTN_WIDTH, height: SOCIAL_BTN_HEIGHT, background: "#000000", color: "#FFFFFF" }}
>
  <AppleLogo />
  <span
    style={{
      fontFamily:
        "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
      fontSize: 16,
      fontWeight: 500,
      letterSpacing: -0.24,
      lineHeight: 1,
    }}
  >
    {isSignup ? "Sign up with Apple" : "Sign in with Apple"}
  </span>
</button>
```

`handleAppleClick` stays as-is: swallow clicks until `APPLE_AUTH_READY`, then call `window.AppleID.auth.signIn()` (added when the Services ID is provisioned — separate follow-up, not in this plan).

We keep the SDK `<script>` in `index.html` and the init effect so we can still call `AppleID.auth.signIn()` later; we just drop `renderButton()` — the effect can be simplified to only run `AppleID.auth.init(...)` when the SDK is present.

### 3. Apple logo — size & compliance

Apple's rule: **logo height = button height**, no cropping, no extra vertical padding. Apple's official logo file bakes ~30% vertical padding around the mark, so on a 40px button the visible glyph is ~24px tall. That's a close visual match to the Google "G" inside the pre-approved pill (~24px within the same 40px height).

To match the guidelines, add Apple's official black button logo asset:

- New file: `src/assets/apple-logo-white.svg` — the standard Apple mark on transparent background, sized so that when its `height` equals button height the padding-to-mark ratio matches Apple's downloadable asset. Path data is the canonical Apple logo path used across Apple's own materials; we render it white for use on the black button.
- Component `<AppleLogo />` inlines that SVG with `height="100%"` and `width="auto"` (roughly ~40×40 square with baked-in padding), keeping Apple's rule that the *file* height matches the button height. No CSS scaling of the mark itself — the padding in the file governs the visible glyph size.

Because the user asked for the icon to be *larger* to match Google's, and Apple's own padding already puts the visible mark at ~60% of button height (very close to Google's ~50–60%), no separate size override is needed. If after visual verification the Apple mark still reads noticeably smaller, we can (still within guidelines) increase the entire button height for **both** buttons together — that would scale both icons uniformly. Flagged as a fallback below.

### 4. Files touched

- `src/components/AuthModal.tsx`
  - Wrapper: `flex-col sm:flex-row sm:justify-center gap-3`.
  - Remove Apple SDK-rendered `<div id="appleid-signin">` and its container overlay.
  - Add custom Apple `<button>` with inline `<AppleLogo />` and 16px label.
  - Simplify the `useEffect` to just call `AppleID.auth.init()` once (no `renderButton`).
- `src/assets/apple-logo-white.svg` — new asset (white Apple mark with Apple's standard padding baked in).

### 5. Verification

Playwright at three viewports:

- Mobile (375px wide): buttons stack, both centered, 180×40 each.
- Tablet (768px): buttons side-by-side, centered as a pair inside the modal.
- Desktop (1280px): same side-by-side layout inside the modal.

Screenshot the modal in both Sign In and Sign Up modes at desktop width. Confirm:

- Apple text renders at exactly 16px (measured via `getComputedStyle`).
- Apple visible mark ≈ Google visible "G" (measured via bounding boxes).

### Fallback if Apple mark still looks visibly smaller

Increase both buttons to 200×44 (still preserves Google's aspect ratio, still within Apple's height range). Text stays 16px; only the icons grow proportionally. Not doing this preemptively — decide after seeing the 40px render.

### Not in scope

- Wiring `AppleID.auth.signIn()` to the button (requires the Services ID; separate task).
- Any Google button changes — Google's font/icon stay locked to the pre-approved asset.
