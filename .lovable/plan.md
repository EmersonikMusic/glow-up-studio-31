Replace the wrapping pill-row nav with a compact "Jump to…" dropdown on mobile only. Desktop keeps the existing pill row.

## Change in `src/components/AboutScreen.tsx`

1. Detect mobile
   - Reuse the existing `isMobile` from `useIsMobile()` already in the component.

2. Mobile: dropdown section picker
   - Replace the pill-row markup with a single full-width button that shows the current active section label (e.g. "Question Crafting") plus a `ChevronDown` icon.
   - On tap, open a lightweight popover/menu listing all four sections. Use a native-feeling custom menu (absolutely positioned panel below the trigger), not a `<select>`, so we can keep the app's glass styling.
   - Selecting an item calls the same `scrollTo(ref, event)` handler and closes the menu.
   - Active item in the menu uses the teal highlight already defined; others use the muted style.
   - Close on outside click and on Escape.
   - Trigger and menu use the same glass surface as the header (no opaque background), keeping the "part of the header" look.

3. Desktop: unchanged
   - Keep the existing wrapping pill row exactly as it is.

4. Keep behavior consistent
   - `navRef` still wraps whichever variant renders, so `navHeight` measurement and anchor scroll offsets stay correct.
   - Scroll-spy continues to drive `activeSection`, which updates both the pill row (desktop) and the dropdown trigger label + selected menu item (mobile).

5. Accessibility
   - Trigger: `aria-haspopup="menu"`, `aria-expanded`, `aria-controls`.
   - Menu: `role="menu"`; items `role="menuitem"` with `aria-current="location"` on the active section.

## Out of scope

- No changes to section content, header, footer, copy, colours, or desktop nav.
