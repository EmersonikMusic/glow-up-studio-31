Problem
When Triviolivia loads on a mobile viewport, the SettingsPanel renders once as a desktop right-side drawer (because `useIsMobile()` initially returns `false`) and then switches to a mobile bottom sheet. That mismatch causes the panel to visibly move from one position to another before the layout settles.

Fix
1. Compute the breakpoint immediately in `useIsMobile` so the first paint is already correct.
   - In `src/hooks/use-mobile.tsx`, replace `useState<boolean | undefined>(undefined)` with a lazy `useState(() => computeIsMobile())` so the initial value is read synchronously from `window.innerWidth` on the client.
2. Hide the SettingsPanel until its final position is known.
   - In `src/components/SettingsPanel.tsx`, add a `ready` flag that becomes `true` after the first render/effect cycle. While `!ready`, render the panel with `opacity: 0` and `pointer-events: none` so it is invisible but still present in the DOM (avoiding a mount/unmount flash). Once `ready` flips, fade in.
3. Verify the result.
   - Run `bun run build` / `vite build` to ensure no type errors.
   - Use a Playwright mobile viewport screenshot to confirm the settings panel is not visible in its initial closed state on first paint.

Scope
Limited to the settings panel only. The same pattern applies to ProfilePanel, but I will only touch SettingsPanel unless you want the fix applied to both.