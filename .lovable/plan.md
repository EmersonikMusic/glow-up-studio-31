# Mascot Reel — Polished End Card + Subtle Motion

Keep the 10-second, 9:16 mascot reel and its face-locked cuts. Drop the music. Refine the end card and add restrained motion so the piece feels directed rather than assembled.

## End card

- Keep the Triviolivia logo lockup (with Olivia) and add the curved "EARTH'S DEEPEST TRIVIA SOURCE" tagline directly beneath it, matching the app's start screen: arced text, Rubik 800, teal, uppercase, wide letter-spacing, soft drop shadow.
- Keep `Play now at www.TRIVIOLIVIA.com` below the tagline, and re-balance the vertical stack so the group sits optically centred rather than drifting high with dead space at the bottom.
- Subtle motion, all spring/interpolate driven:
  - Logo lifts in and settles, then breathes with a very slow scale drift.
  - Tagline fades and traces in just behind the logo.
  - URL line eases up last with a gentle pulse so the frame is never static.
  - Background gradient slowly drifts/brightens across the hold.

## Reel improvements

- Micro-crossfade (2-3 frames) between mascot cards so the face-locked cuts read as a continuous morph instead of hard flicker, while keeping the rhythm.
- Very slight card life: a few pixels of vertical float on the mascot and a slow background gradient shift, so no card is frozen.
- Category label: quick fade/rise on each cut instead of appearing hard, keeping the bottom scrim for legibility.
- Short handoff at the end — the last mascot dissolves into the end card rather than cutting.

## Technical

- Changes are confined to `remotion/src/MascotShow.tsx` (end card, per-card motion, crossfade) and, if it makes the timing cleaner, a small end-card subcomponent alongside it.
- Duration stays 10s / 300 frames at 30fps, 1080x1920; per-card timing stays 9 frames with the 75-frame end card.
- Rendered silently (no audio track) to `/mnt/documents/triviolivia-mascots-9x16.mp4` via the existing `remotion/scripts/render-mascots.mjs`, then key frames spot-checked before delivery.
