## Match Apple's width to Google's natural button width

Google's SVG asset has a fixed aspect ratio and must not be distorted. So we adjust the Apple button (whose SDK exposes `data-width`) to match whatever pixel width the Google pill naturally renders at `h-12` (48px tall).

### Steps in build mode

1. Measure Google's rendered pill width via Playwright: open the modal, read `document.querySelector('button[aria-label="Sign in with Google"] img').getBoundingClientRect().width`. Call this `W`.
2. Clamp: `W_apple = Math.min(Math.max(Math.round(W), 130), 375)` — Apple's SDK only accepts widths in that range.
3. In `src/components/AuthModal.tsx`:
   - Add `const APPLE_BTN_WIDTH = <measured value>;` near the top (with a comment: "matches the Google Sign-In asset's intrinsic width at 48px tall").
   - Revert Google button:
     - Outer `<button>`: drop the fixed `style={{ width: 375, maxWidth: "100%" }}`, use `className="mx-auto h-12 ..."` and let the image dictate width via `h-12 w-auto` (image intrinsic size).
   - Apple wrapper `<div>`: set `style={{ width: APPLE_BTN_WIDTH, maxWidth: "100%", background: "#000000" }}`.
   - Apple inner `<div id="appleid-signin">`: set `data-width={APPLE_BTN_WIDTH}` (string form for the SDK).
4. Re-run Playwright: assert both buttons' bounding-rect widths are equal to the pixel; screenshot Sign In + Sign Up modes for the user.

### Fallback if `W > 375`

Apple's SDK cap is 375. If Google's natural width exceeds 375 at h-12, I'll instead set Apple to 375 and constrain Google to `max-w-[375px]` with `object-contain` (still preserves aspect ratio, just scales the whole pill down proportionally — no distortion). That case is unlikely with Google's standard pill asset but I'll handle it if measurement shows it.

### Out of scope

- Editing the Google asset.
- Changing Apple's SDK options beyond `data-width`.
