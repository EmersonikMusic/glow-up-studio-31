## Approved QA fixes — implementation plan (final)

### 1. H2 — Spacebar must not toggle pause while a modal is open
**File:** `src/components/TriviaGame.tsx`
Add `showAbout`, `showHowToPlay`, and `panelOpen` to the Space keydown early-return and to the effect's dependency array. The Review modal opens only after `gameState === "finished"`, which the handler already bails on, so no extra wiring needed.

### 2. H3 — Disable "Apply Settings" when any filter group is empty
**Files:** `src/components/SettingsPanel.tsx`, `src/components/PrimaryCTA.tsx`
- `canApply = selectedCategories.length > 0 && selectedDifficulties.length > 0 && selectedEras.length > 0`
- Pass `disabled={!canApply}` to both Apply Settings CTAs.
- Add disabled styling on `PrimaryCTA` (reduced opacity, `cursor-not-allowed`, no hover lift) if not already there.
- When `!canApply`, render a helper line ~12 px below the button, centered, `text-xs font-body font-semibold`:
  > In order to begin a game you must first select at least 1 **category**, 1 **era**, and set your **difficulty**.
  
  The bold words use the turquoise token `hsl(185 70% 55%)`; the rest uses muted body color. The API-failure toast is unchanged.

### 3. H4 — Stop logging NotFound as `console.error`
**File:** `src/pages/NotFound.tsx`
Change `console.error(...)` to `console.warn(...)` with the same message.

### 4. M6 — Hide fullscreen button on mobile
**File:** `src/components/GameHeader.tsx`
Add `hidden sm:flex` to the fullscreen button so it only renders at `sm` (≥640 px) and above. Fullscreen state logic untouched.

### 5. M7 — Reduce mascot drop-shadow
**File:** `src/components/TriviaGame.tsx`
Replace `drop-shadow-xl` on both mascot wrappers with `drop-shadow-md`.

### 6. N2 — Restyle "Contact us" line to match the How to Play link
**File:** `src/components/ResultScreen.tsx`
"Contact us at" stays plain white. Only the email becomes the hyperlink, styled like `howto-link`: turquoise `hsl(185 70% 55%)`, `underline underline-offset-[5px]`, hover → gold (`hsl(var(--game-gold))`), `font-body font-semibold`.

### 7. N6 — Unify CTA copy to "How to Play"
**File:** `src/components/StartScreen.tsx`
Change `How Do I Play?` → `How to Play`. Analytics event id `click_how_to_play` left unchanged.

### 8. N1 — Silence React Router v7 future-flag warnings
**File:** `src/App.tsx`
Add `future={{ v7_startTransition: true, v7_relativeSplatPath: true }}` to `<BrowserRouter>`. No visible change; console gets cleaner and the app is pre-aligned with v7 behavior.

### 9. N7 — Add og:image placeholder card
**Files:** `index.html`, generated asset via `lovable-assets`
- Generate a 1200×630 branded placeholder card using `imagegen` (premium quality for text legibility): dark `#1a1740` background, centered Triviolivia logotype + tagline "Free say-aloud trivia", generous safe-zone padding (≥100 px from edges), opaque JPG, target ~300 KB.
- Upload via `lovable-assets create` so it gets a stable CDN URL.
- Replace the current `og:image` and `twitter:image` URLs in `index.html` with the new CDN URL.
- Add `<meta property="og:image:width" content="1200">` and `<meta property="og:image:height" content="630">` next to `og:image`.
- Note for you: social platforms (iMessage, LinkedIn, Slack, X, Facebook) cache previews. The new card won't appear in already-shared links until each platform re-scrapes. You can force a refresh in each platform's link-preview debugger (e.g. Facebook Sharing Debugger, LinkedIn Post Inspector). When you supply the final asset, I'll swap it in via the same flow.

### Out of scope
B1, B2, H1, H5, H6, M1, M2, M3, M4, M5, N3, N4, N5.

### Verification
After implementation, re-run Playwright across desktop (1280), tablet (768), and mobile (375) and verify:
- Space inside About/HowToPlay does not toggle pause; resumes working on the game screen.
- Apply Settings disables when any filter group is emptied; helper sentence appears with turquoise keywords; re-enables when all three groups have ≥1 selection.
- Fullscreen button absent at 375 px, present at 768 px+.
- Mascot shadow visibly softer.
- Contact line: white label, turquoise underlined address, hover → gold.
- Start screen reads "How to Play".
- 404 route logs `warn`, not `error`.
- React Router v7 warnings no longer appear in console.
- `index.html` head contains the new `og:image`, `og:image:width`, `og:image:height`, and `twitter:image` pointing at the new CDN URL.