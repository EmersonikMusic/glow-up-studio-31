Visual tweaks to the About page sticky anchor bar.

1. Match sticky bar background to footer
   - In `src/components/AboutScreen.tsx`, change the sticky anchor nav's `background` from `hsl(var(--game-bg))` to `rgba(0, 0, 0, 0.25)` (the same semi-transparent value used by the card container and the Back to Game footer area).
   - Keep the `backdrop-blur-xl`, bottom border, and all other existing styles unchanged.

2. Mobile-only layout optimization
   - On small screens, make the sticky anchor button row horizontally scrollable so every button stays at a readable, tappable size without wrapping into a cramped multi-line block.
   - Implementation approach: use a media-query / Tailwind breakpoint (e.g., `max-sm:flex-nowrap max-sm:overflow-x-auto max-sm:scrollbar-hide`) on mobile, while keeping the existing wrapped layout on desktop/tablet.
   - Preserve existing button padding, font sizes, and tap targets.

No copy, section structure, or functionality changes elsewhere.