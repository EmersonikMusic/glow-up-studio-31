Visual and copy tweaks to the About page sticky anchor bar and the question philosophy section.

1. Sticky bar background colour
   - Replace the current near-black `rgba(10, 10, 14, 0.92)` with the deep page background purple `hsl(var(--game-bg))` (HSL 240 45% 16%).
   - Keep `backdrop-blur-xl` and the bottom border, so the bar reads as a solid continuation of the page rather than a dark overlay.

2. Active-section highlight colour
   - Switch the active anchor button styling from gold to teal `hsl(185 70% 55%)`:
     - background: `hsl(185 70% 55% / 0.18)`
     - border: `hsl(185 70% 55%)`
     - text: `hsl(185 70% 55%)`
     - box-shadow glow: `hsl(185 70% 55% / 0.15)`
   - Inactive button styling remains unchanged.

3. Add divider before sign-off
   - Insert a 1 px hairline divider between the "Question Writing Philosophy" section and the "Go play..." sign-off block, matching the existing divider style (`rgba(255, 255, 255, 0.1)`).

4. Rename section to "Question Crafting"
   - Update the sticky nav button label from "Question Writing Philosophy" to "Question Crafting".
   - Update the section heading from "Question Writing Philosophy" to "Question Crafting".

5. Add intro line to the renamed section
   - Insert a single paragraph directly under the "Question Crafting" heading that summarises the question writing philosophy, so the original phrase is still present on the page. Suggested line: "Our questions are designed to be clear, fair, and fun for every kind of trivia player."