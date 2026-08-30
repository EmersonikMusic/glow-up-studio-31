# Plan: Convert landing-page "Play all categories" link into a SecondaryCTA button

## Current state
`src/components/PlayLandingScreen.tsx` (lines 119-124) renders the "Play all categories" link as a plain styled `<Link to="/">`. The site already has a `SecondaryCTA` component (`src/components/SecondaryCTA.tsx`) used on the home screen for "Customize Game" — an outline-pill button with tracking built in.

## Change
Replace the plain link with a `SecondaryCTA` button on every `/play/<slug>` ad-landing page:
- Kids (`/play/kids`) and Custom (`/play/custom`): button reads **"Switch Game Mode"**.
- All other landing pages (categories, difficulties, eras): button reads **"Play All Categories"** (text unchanged, just upgraded to the secondary CTA styling).

The button navigates to `/` (same destination as before). "How to Play" remains a plain link above/below it.

## Implementation
1. In `PlayLandingScreen.tsx`:
   - Import `SecondaryCTA` and `isKidsPreset` / `isCustomPreset` from `@/data/playSlugs`, plus `useNavigate` from `react-router-dom` (the file already imports `Link`).
   - Add `const navigate = useNavigate();` and `const isKidsOrCustom = isKidsPreset(preset) || isCustomPreset(preset);`.
   - Replace the `<Link to="/" className="howto-link ...">Play all categories</Link>` block with:
     ```tsx
     <SecondaryCTA
       onClick={() => navigate("/")}
       trackId={isKidsOrCustom ? "switch_game_mode" : "play_all_categories"}
       className="mt-3 w-full animate-fade-in"
       style={{ animationDelay: "220ms" }}
       aria-label={isKidsOrCustom ? "Switch Game Mode" : "Play All Categories"}
     >
       {isKidsOrCustom ? "Switch Game Mode" : "Play All Categories"}
     </SecondaryCTA>
     ```
   - Keep the existing "How to Play" plain link as-is (it stays a teal underline link).
2. No routing, preset data, or tracking-infra changes. `SecondaryCTA.handleClick` already emits `cta_secondary__<id>` engagement events, so the new buttons are tracked consistently with the home-page secondary CTAs.

## Verification
- Playwright visit `/play/kids` and `/play/custom` → confirm a secondary outline-pill button reading "Switch Game Mode", click lands on `/`.
- Visit `/play/movies` → confirm button reads "Play All Categories", click lands on `/`.
- Confirm "How to Play" link still renders as a teal underline link.
- `npx tsgo --noEmit` passes.
