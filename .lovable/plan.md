## Goal

Stop the SettingsPanel / ProfilePanel from animating in from off-screen. Instead, render them in their final position but fully transparent, and only fade in once the user opens them. This eliminates the flash entirely because the sheet never travels across the viewport.

## Approach

1. **Replace slide with fade** for both `SettingsPanel` and `ProfilePanel`:
   - Remove `translateY(100%)` (mobile) and `translateX(...)` (desktop) closed states.
   - Panel sits in its final open position at all times.
   - Closed state = `opacity: 0; visibility: hidden; pointer-events: none`.
   - Open state = `opacity: 1; visibility: visible` with a short fade transition (e.g. 200ms ease-out).
   - `visibility: hidden` guarantees it is unhittable and invisible until `open` flips true, avoiding any first-paint reveal.

2. **Update critical CSS** in `index.html` (`<style data-critical="settings-panel">`) and `src/index.css` so the closed state is `opacity:0; visibility:hidden` from the very first byte parsed. This is what the "render in position, invisible until interacted with" requirement needs.

3. **Add a mobile guard hook usage**: keep using the existing `useIsMobile()` (already in `src/hooks/use-mobile.tsx`) — that is the single "is mobile" function. Both panels already call it; no new hook needed. The fade behavior is identical across mobile/desktop, so no branching is required, but we'll keep `useIsMobile()` as the gate for choosing bottom-sheet vs side-drawer *layout*.

4. **Fade-in delay**: add a small `transition-delay` (e.g. 60ms) on the opacity transition when opening, so the panel is guaranteed invisible until user interaction has clearly started. When closing, no delay — it disappears immediately.

5. **Update Playwright regression test** (`tests/settings-panel-hidden.spec.ts`):
   - Replace the "transform matrix is off-screen" assertion with "opacity is 0 AND visibility is hidden" at first paint.
   - Keep the MutationObserver first-paint sampler; only the pass/fail condition changes.
   - Positive-case test (clicking gear reveals the sheet) stays as-is.

6. **Update docs** (`docs/testing/settings-panel-hidden.md`) to reflect the new visibility/opacity strategy instead of transform-off-screen.

## Files to change

- `src/components/SettingsPanel.tsx` — remove translate closed states, use opacity+visibility gate.
- `src/components/ProfilePanel.tsx` — same treatment.
- `src/index.css` — replace `.settings-sheet-mobile` / `.settings-sheet-desktop` closed rules with opacity/visibility.
- `index.html` — same replacement in the inlined `<style data-critical="settings-panel">` block.
- `tests/settings-panel-hidden.spec.ts` — assertion change.
- `docs/testing/settings-panel-hidden.md` — doc update.

## Technical notes

- `visibility: hidden` (rather than `display: none`) is important so the transition still runs; combined with `opacity: 0` it's non-interactive and non-rendering visually.
- `transition: opacity 200ms ease-out 60ms` on open; `transition: opacity 150ms ease-out 0ms` on close (handled via `data-open` attribute selector).
- The two-frame `mounted`/`animated` gate in the components can be removed — it's no longer needed because there's no travel animation to suppress. This simplifies both files.
- No changes to `use-mobile.tsx` needed; it's already the canonical mobile check.
