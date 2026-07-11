## Goal
Add a standalone, publicly accessible `/terms` route containing the full Terms of Service & Privacy Policy content, so it can be referenced by Google OAuth consent screen verification.

## Approach
Reuse the existing `PrivacyScreen` content by extracting it into a shared component, then render it in two contexts:
1. The current in-app modal/takeover (unchanged UX from Start/Result screens).
2. A new standalone page at `/terms` with its own URL.

## Changes

### 1. Extract shared content component
Create `src/components/LegalContent.tsx` containing just the header + scrollable body markup (the "TERMS OF SERVICE & PRIVACY POLICY" title, effective date, Part 1, Part 2, contact info). No modal chrome, no close button, no CTA — just the copy, styled consistently.

### 2. Refactor `PrivacyScreen.tsx`
Replace the inline header + body JSX with `<LegalContent />`. Keep the modal shell, close button, slide animation, and "Back to Game" CTA intact. No visual change for existing users.

### 3. Create standalone page `src/pages/Terms.tsx`
- Full-page layout (not a modal): same dark game background, ambient blobs, glassmorphic card centered on the page.
- Renders `<LegalContent />` inside the card.
- Footer CTA: "Back to Home" link → navigates to `/`.
- Includes `<Helmet>` with:
  - `<title>Terms of Service & Privacy Policy — Triviolivia</title>`
  - meta description
  - canonical `https://www.triviolivia.com/terms`
- Responsive: same mobile/desktop treatment as the modal.

### 4. Register route
In `src/App.tsx`, add `<Route path="/terms" element={<Terms />} />` above the catch-all.

### 5. Update `LegalFooter.tsx`
Change the button to a real link. Two options considered — recommending **B**:
- **A.** Keep it as a modal trigger (current behavior) — Google reviewers can still visit `/terms` directly via the OAuth consent screen link, but in-app users see the modal.
- **B. (recommended)** Make the footer link an anchor `<a href="/terms" target="_blank" rel="noopener">` so it opens the standalone page in a new tab. Removes the modal entirely.

Recommend **A** — least disruptive: existing modal UX stays, and `/terms` exists as a public URL for Google. The user can register `https://www.triviolivia.com/terms` in the Google Cloud Console consent screen.

### 6. Google OAuth consent screen (user action, outside code)
After deploy, in Google Cloud Console → OAuth consent screen, set:
- Application privacy policy link: `https://www.triviolivia.com/terms`
- Application terms of service link: `https://www.triviolivia.com/terms`

## Technical notes
- SPA fallback on Lovable hosting handles `/terms` refresh/deep-link automatically — no `_redirects` needed.
- `LegalContent` will accept an optional `variant` prop (`"modal" | "page"`) only if spacing needs to differ; otherwise a single layout works for both.
- No backend/schema changes.

## Files touched
- **new** `src/components/LegalContent.tsx`
- **new** `src/pages/Terms.tsx`
- **edit** `src/components/PrivacyScreen.tsx` (swap body for `<LegalContent />`)
- **edit** `src/App.tsx` (add route)

## Open question
Should the footer link keep opening the in-app modal (option A), or switch to opening `/terms` in a new tab (option B)? Default: **A**.