## Make the pre-mount fallback match the Start Game screen

Two issues to fix in `index.html`:

1. The "white border" around the dark panel is the default 8px `<body>` margin (and html/body not set to full height) bleeding through as a white frame.
2. The fallback has no header bar, so it doesn't visually match the Start Game screen.

### Changes

**A. Reset page chrome (in `<head>` `<style>` or inline on body)**
- `html, body { margin: 0; padding: 0; min-height: 100%; background: #1a1740; }`
- This removes the white border on all browsers and matches the `--game-bg` token (`hsl(240 45% 16%)` ≈ `#1a1740`) used by `StartScreen`.

**B. Add a header bar matching `GameHeader.tsx`**
- Inside the fallback `<div id="root">`, prepend a `<header>` styled with the same rules used by the React header:
  - `background: rgba(0,0,0,0.25)`
  - `border-bottom: 1px solid rgba(255,255,255,0.1)`
  - `backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);`
  - Padding `clamp(12px, 2vw, 20px) clamp(16px, 4vw, 32px)`, including `padding-top: max(clamp(12px,2vw,20px), env(safe-area-inset-top))`
- Header contains the small Trivolivia logo on the left, height 32px (matches `h-8` in GameHeader). Right side is intentionally empty (no Settings/About/etc. buttons — those are React-only and would not work pre-mount).

**C. Make the logo available to static HTML**
- The React app imports `src/assets/TO_logo_sm_clr.svg` via the Vite pipeline, so it is not served at a stable URL for index.html to reference. Copy that file to `public/to-logo-sm.svg` so it's served at `/to-logo-sm.svg` and can be loaded by the fallback `<img>` tag.
- Use `<img src="/to-logo-sm.svg" alt="Trivolivia" style="height:32px;width:auto;display:block;" draggable="false" />`.

**D. Body content area**
- Replace the previous root container with a flex column: header on top, then a `flex: 1` content area that vertically and horizontally centers the existing styled heading + helper paragraph (already updated last turn). Keep their typography exactly as last turn.
- Use `min-height: 100vh; display:flex; flex-direction:column;` on the wrapper so the header sits at top and the loading message centers below it — same shape as `StartScreen`.

**E. No new dependencies, no font fetches, no JS, no other files.**

### Files touched
- `index.html` — replace the `<div id="root">` block with header + centered content; add the global `html, body` reset.
- `public/to-logo-sm.svg` — new file, copied from `src/assets/TO_logo_sm_clr.svg`.

### Out of scope
- No changes to React components, the in-app loading screen, the `<noscript>` block, meta tags, scripts, or analytics.
- No interactive buttons in the fallback header (they require React).

### Verification
Hard-refresh the preview. During the brief pre-mount flash (and on very old browsers that never mount), confirm:
- No white border around the dark area on any side.
- A dark glass header bar with the small Trivolivia logo at the top-left, matching the in-app header.
- Background is the same deep purple as Start Game.
- Heading "LOADING TRIVIOLIVIA…" in gold gradient, helper paragraph below, both centered.
