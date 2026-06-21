## Changes

### 1. ResultScreen.tsx — CTA stack
- Reduce mobile vertical gap between "Play Again" and "Change Settings" so it matches Start screen spacing.
  - Current: `flex flex-col items-stretch gap-5 sm:gap-3 w-full max-w-[280px] mx-auto`
  - New: drop the gap, use `mt-3` on the Change Settings button to mirror StartScreen's `mt-3 w-full` pattern. Switch wrapper to `flex flex-col items-stretch w-full max-w-[280px] mx-auto`.
- Replace the custom "Change Settings" `<button>` with the shared `SecondaryCTA` component (same styling as "Customize Game" on Start screen).
  - Keep `trackClick("click_change_settings")` behavior via `trackId="change_settings"`.
  - Pass `className="mt-3 w-full"`.

### 2. SettingsPanel.tsx — "Restart with new settings?" confirm dialog
- Add vertical breathing room inside the popup. Set `AlertDialogHeader` `className="space-y-3"` and `AlertDialogFooter` `className="gap-3 sm:gap-3 mt-2"` so the title, description, and buttons aren't crammed together.
- Replace the custom Cancel button with `SecondaryCTA` (same look as Customize Game on Start screen) — keep `trackClick("settings_apply_cancel")`, `trackId="settings_apply_cancel"`.
- Keep the existing `PrimaryCTA` "Restart Game" button (it already matches Start Game styling).
- Result: confirm dialog matches Start screen's button pair visually and is properly spaced.

### 3. TriviaGame.tsx — "Loading next round…" header
- Match the header treatment used on About/HowToPlay/Result screens.
  - Update sizing/leading: change from `text-xl md:text-3xl ... lineHeight: 1.1` to `text-4xl md:text-5xl ... lineHeight: 1.05` (with `tracking-tight uppercase font-heading font-extrabold` retained), and remove the redundant inline `lineHeight: 1.1` override.
  - Gold gradient already matches About screen — leave it unchanged.

## Files
- `src/components/ResultScreen.tsx`
- `src/components/SettingsPanel.tsx`
- `src/components/TriviaGame.tsx`

No backend, no new dependencies, no other screens affected.