
## Plan: Unify Sign In modal CTA + close-button hovers

### 1. Sign In button → PrimaryCTA
In `src/components/LoginScreen.tsx`, replace the existing submit `<button class="btn-gameshow ...">` with `<PrimaryCTA type="submit" disabled={isLoading} className="w-full">`. Keep the `LogIn` icon and dynamic label ("Loading..." / "Sign In" / "Create Account") as children. Import `PrimaryCTA` at the top.

### 2. Modal back/close buttons — unified turquoise-outline hover
Standardize the small circular back/close button on three modals to match the header pills' `.nav-btn` hover (turquoise outline + subtle bg lift):

- **`src/components/LoginScreen.tsx`** — the top-left `<ArrowLeft>` back button currently uses inline `background`/`border` styles with a `hover:brightness-125`. Add the `nav-btn` class and remove the brightness hover so the global `.nav-btn:hover` rule takes over (matching About/HowToPlay close buttons).
- **`src/components/SettingsPanel.tsx`** — read the file to find its close/back button. If it's not already using `.nav-btn`, add it and strip any conflicting hover (glow/brightness) so it matches.
- **`src/components/AboutScreen.tsx` & `src/components/HowToPlayScreen.tsx`** — already use `.nav-btn` per the previous change; leave as-is (reference baseline).

I'll read `LoginScreen.tsx` (already visible), `SettingsPanel.tsx`, and `index.css` (`.nav-btn:hover` rule) before editing to confirm exact class swaps and avoid breaking layout.

### Files touched
- Edit: `src/components/LoginScreen.tsx` (CTA swap, back-button hover)
- Edit: `src/components/SettingsPanel.tsx` (close-button hover only — confirm after read)

### Out of scope
- No changes to PrimaryCTA itself, modal layouts, form logic, or any other component.
