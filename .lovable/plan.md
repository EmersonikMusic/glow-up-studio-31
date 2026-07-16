## Plan: three UI tweaks

### 1) Fix Settings sheet header cut off on mobile Chrome

Root cause: the mobile bottom sheet uses `maxHeight: "92vh"`. On Chrome for iOS/Android, `vh` is measured against the *large* viewport (URL bar hidden), so the sheet can exceed the currently visible area and the top of the header renders above the fold. Safari/Firefox measure differently, which is why they look correct.

Change in `src/components/SettingsPanel.tsx` (mobile branch of `SettingsPanel`):
- Replace `maxHeight: "92vh"` with a dynamic-viewport-aware value:
  `maxHeight: "min(92dvh, 92vh)"` with `92svh` as a fallback via a stacked declaration, i.e. set `maxHeight: "92svh"` and add a second style property override using CSS (or inline via `style={{ maxHeight: "92dvh" }}` combined with the CSS class fallback).
- Simpler approach we'll use: switch to `maxHeight: "92dvh"` and add a `@supports not (height: 100dvh)` fallback rule in `src/index.css` on `.settings-sheet-mobile` setting `max-height: 92svh` then `92vh` as the ultimate fallback.

Also apply the same fix to `ProfilePanel.tsx` mobile sheet since it shares the pattern.

### 2) Restyle the Loading… splash

In `index.html` (the inline pre-React loading screen), update the `<h1 aria-label="Loading...">` styles to match the Settings header:
- `font-family: 'Fredoka One', 'Rubik', ui-rounded, system-ui, sans-serif;`
- Replace the flat gold `color` with the same gradient used by Settings' "CUSTOMIZE YOUR EXPERIENCE" title:
  `background: linear-gradient(0deg, #e93e3a 0%, #ed683c 11%, #f3903f 33%, #fdc70c 72%, #fff33b 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent;`
- Apply the background to each `.bounce-char` span (background-clip on the parent doesn't paint per-glyph reliably when children have their own layers). Add a small CSS rule in the existing `<style>` block: `#lovable-loading .bounce-char { background: linear-gradient(...); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }`.
- Keep the existing bounce animation intact.

### 3) Tighten AuthModal internal spacing + turquoise link

In `src/components/AuthModal.tsx`:
- On the inner panel `<div className="relative rounded-3xl p-6 sm:p-8">`, increase horizontal padding: `px-8 sm:px-10`.
- Constrain form/button widths so they sit inside that padding. Wrap the form (`<form>`), the social buttons row, and the "sent"-confirmation submit button in a `max-w-[320px] mx-auto w-full` container (or add `max-w-[320px] mx-auto w-full` directly to each). Inputs currently span full width — capping via max-width creates the desired inset from the modal edge.
- Change the bottom "Sign in / Sign up / Back to sign in" toggle link color from `text-white/80` to `text-[hsl(185_70%_55%)]` (project turquoise). Keep the hover state as-is or match to a slightly brighter turquoise.

### Files to change

- `src/components/SettingsPanel.tsx` — mobile sheet `maxHeight`.
- `src/components/ProfilePanel.tsx` — mobile sheet `maxHeight` (same fix).
- `src/index.css` — `@supports` fallback for `.settings-sheet-mobile` height.
- `index.html` — Loading heading font + gradient + `.bounce-char` gradient rule.
- `src/components/AuthModal.tsx` — inner padding, form/social max-width wrapper, turquoise toggle link.

No logic, routing, or backend changes.
