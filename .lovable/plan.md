Scope: In the About screen's "Follow Us" section, reduce the visible social-platform icons to only Facebook, Instagram, and LinkedIn (matching the user's current priority). The section header, styling, and scroll-spy anchor remain unchanged. The inactive platform icons and imports will be kept in the codebase but hidden from the UI.

Changes:
1. In `src/components/AboutScreen.tsx`, keep the full `SOCIAL_LINKS` array and all icon definitions/imports (`Youtube`, `TikTokIcon`, `ThreadsIcon`, `BlueskyIcon`, `RedditIcon`).
2. Filter the rendered social links so only `facebook`, `instagram`, and `linkedin` are displayed. This can be done by either filtering the array at the point it is mapped, or by adding an `active` flag to the entries and only rendering those marked active.

Verification:
- Run a build check to ensure no errors.
- Verify the About screen still renders the Follow Us section with exactly three pill buttons: Facebook, Instagram, LinkedIn.
- Confirm the section remains wired into the scroll-spy navigation.

Out of scope: No URL changes, no styling changes, no new social icons added, no removal of unused icon code.