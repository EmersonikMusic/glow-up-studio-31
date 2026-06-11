## Restyle the pre-mount loading fallback in `index.html`

The "Loading Triviolivia… / If this message stays on screen, your browser may be too old…" screen comes from the boot fallback inside `<div id="root">` in `index.html` (lines 49–54), not from the in-app React loading screen. That's why earlier edits to `TriviaGame.tsx` had no effect on it.

### Changes (scoped to `index.html` only)

1. **Remove the white border / default browser look.** The current block has no explicit border, but the heading uses the default system font weight and color. Switch the container to a borderless, transparent panel — no outline, no card, no ring — so it reads as part of the dark background.

2. **Apply site typography hierarchy** using a safe system fallback (no extra web-font request at boot):
   - Heading "Loading Triviolivia…":
     - `font-family: ui-rounded, "SF Pro Rounded", "Segoe UI", system-ui, sans-serif`
     - `font-weight: 800`, `text-transform: uppercase`, `letter-spacing: -0.01em`, `line-height: 1`
     - Size `clamp(28px, 6vw, 56px)`
     - Gold gradient fill: `background: linear-gradient(160deg, #FFC93D 0%, #E89412 45%, #C97114 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent;`
     - Plain `#FFC93D` color as fallback for engines that don't support background-clip (set `color` before the gradient overrides it).
   - Helper paragraph ("If this message stays on screen…"):
     - `font-family: system-ui, -apple-system, "Segoe UI", sans-serif`
     - `font-size: 14px`, `opacity: 0.75`, `max-width: 38ch`, centered, line-height 1.5.
   - Add small vertical spacing between heading and paragraph (`margin-top: 16px` on the `<p>`).

3. **Background** stays `#1a1740` (matches the existing dark theme; no change needed).

4. **Keep the helper copy verbatim** ("If this message stays on screen, your browser may be too old. Try opening **triviolivia.com** on a phone, tablet, or desktop browser.") per the question selection.

5. **Do not touch** the `<noscript>` block, meta tags, scripts, or any React code. No changes outside `index.html`.

### Out of scope

- No changes to the in-app `TriviaGame.tsx` loading screen (already updated previously).
- No new font `<link>` tags, no new assets, no JS.
- No layout, routing, or analytics changes.

### Verification

After the edit, hard-refresh the preview and confirm the brief pre-mount flash shows the gold uppercase heading on the dark background with no white ring; on a JS-disabled browser the `<noscript>` block (unchanged) still appears.
