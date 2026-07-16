# Align the Google button with Google's branding guidelines

I checked our current button against the authoritative spec at
`developers.google.com/identity/branding-guidelines` (last updated 2026‑07‑07).
We are close, but there are five concrete deviations from Google's dark‑theme
pill spec. This plan brings the button into strict compliance so it will pass
Google's app verification review.

## What Google's spec requires (dark theme, pill)

- **Fill:** `#131314` (not pure black)
- **Stroke:** `#8E918F`, 1px, inside
- **Font:** **Google Sans Medium**, size 14 / line‑height 20
- **Text color:** `#E3E3E3`
- **Text options:** "Sign in with Google", "Sign up with Google", or "Continue with Google"
- **Web/Android padding:** 12px left → Google "G" → **10px gap** → label → 12px right
- **Logo:** the standard 4‑color Google "G", unmodified, fixed size and padding — Google explicitly recommends starting from their downloaded asset rather than a hand‑drawn SVG
- **Logo alignment:** either **Left** (icon flush‑left, text left‑aligned after the 10px gap) or **Center** (icon + text centered as a single group). A hybrid — icon flush‑left with text center‑aligned in the whole button — is not one of the sanctioned layouts.

## Current state (measured across 375 / 768 / 1280 px)

- Fill `#000000`, no stroke — should be `#131314` + `#8E918F` stroke
- Font Roboto Medium 14px — should be Google Sans Medium 14/20
- Text `#FFFFFF` — should be `#E3E3E3`
- Layout: G anchored at 12px left, label centered in the button (hybrid — not a sanctioned layout)
- Logo: hand‑authored inline SVG, not Google's official asset

Height 40px, pill radius, "Sign in with Google" wording, and full‑width scaling are already compliant.

## Changes

All in `src/components/AuthModal.tsx` for the Google button only. The Apple
button follows Apple's HIG separately and stays untouched.

1. **Colors**
   - Background: `#131314`
   - Border: `1px solid #8E918F` (inside stroke — set `box-sizing: border-box` which the button already inherits)
   - Text color: `#E3E3E3`

2. **Typography**
   - Load **Google Sans** (weight 500) via Google Fonts in `index.html`, replacing the Roboto import added last turn.
   - Set the label's `font-family` to `'Google Sans', Roboto, Arial, sans-serif` with `font-weight: 500`, `font-size: 14px`, `line-height: 20px`.

3. **Layout — pick the "Left" sanctioned layout**
   Replace the current hybrid with Google's Left alignment:
   - Container: `display: flex`, `align-items: center`, `justify-content: flex-start`, `padding: 0 12px`, `gap: 10px`.
   - Remove the `position: absolute` on the G.
   - Result matches Google's diagram exactly: 12px → G → 10px → "Sign in with Google" → 12px right padding (auto‑absorbed by the flex row on a full‑width button).

   Rationale for Left over Center: Google's own SDK button on web defaults to Left; it is the layout their padding diagram documents.

4. **Google "G" asset**
   Replace the inline hand‑drawn SVG with the official Google "G" from Google's
   downloadable brand assets (the `g-logo.png` / SVG referenced in the guidelines).
   Store it as `src/assets/google-g.svg` and render it as an `<img>` sized 20×20
   (the standard size Google ships in the pre‑approved 40px button).

5. **Verification**
   Re‑run the Playwright measurement script at 375 / 768 / 1280 px and confirm:
   - Fill `#131314`, stroke `#8E918F`, text `#E3E3E3`
   - Font family resolves to Google Sans (with Roboto fallback logged only if the network font failed)
   - Left padding 12px, gap 10px, right padding ≥ 12px
   - Height 40px, G is 20×20, pill radius unchanged
   Capture screenshots at all three breakpoints for a visual pass.

## Technical notes

- Google Sans is on Google Fonts (`family=Google+Sans:wght@500`). The Roboto
  import added in the previous turn will be removed in the same edit — it is no
  longer used anywhere else in the app.
- The G asset lives locally so the button renders identically offline and on
  slow networks; using a bundled SVG is explicitly permitted as long as it is
  the unmodified standard‑color Google "G".
- No backend, auth‑flow, or Apple‑button changes.

## Files touched

- `index.html` — swap Roboto import for Google Sans (weight 500)
- `src/components/AuthModal.tsx` — colors, font stack, flex layout, `<img>` for G
- `src/assets/google-g.svg` — new file, official Google "G" asset

## Out of scope

- Apple button styling
- Auth logic / OAuth configuration
- Any changes to the "OR" divider, email form, or modal chrome
