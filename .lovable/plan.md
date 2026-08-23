# Triviolivia PMax Video — 15s, three aspect ratios

A 15-second kinetic-energy motion graphics ad built in code (Remotion), rendered as MP4 in 1:1, 9:16 and 16:9 from one shared source so all three cuts are visually identical.

## What you need to attach first

Before I build, attach:
- Full Triviolivia logo (SVG or high-res PNG)
- 1-2 mascots you want featured
- Phone-screen UI captures: Customize Your Experience screen, a question screen, and the home screen
- Your organic social end-card reference ("Ready to play? visit www.triviolivia.com")

I'll use the site's existing look for everything else: dark indigo background (`240 45% 16%`), gold (`42 100% 55%`) and teal (`185 70% 55%`) accents, Rubik for headings, Quicksand for body, plus the red-to-yellow logo gradient for hero type.

## Story (15s, 30fps)

```text
0.0-2.5s  HOOK      Logo snaps in over drifting ambient blobs; tagline
                    "Earth's Deepest Trivia Source" arcs in.
2.5-6.0s  FREE      "Free to play. No signup." Big type, mascot pops in,
                    home screen phone slides up behind.
6.0-9.5s  CUSTOM    "Make it yours." Customize screen in phone frame;
                    category / difficulty / era chips stagger in.
9.5-12.5s PLAY      "Say it out loud." Question screen phone, countdown
                    ring sweeps, answer reveal snap.
12.5-15s  END CARD  "Ready to play?" + Play Now button + triviolivia.com,
                    logo lockup, gold accent wipe out.
```

Motion system: one default entrance (spring scale + rise + blur-to-sharp), gold wipe transitions between scenes, phone mockups on subtle parallax, no static frames. Silent (PMax plays muted by default) — captions/type carry the message.

## Aspect ratios

The same scenes render at three sizes with layout responding to the frame:
- 16:9 — 1920x1080, phone mock beside the type
- 1:1 — 1080x1080, type stacked above phone
- 9:16 — 1080x1920, full-bleed vertical, phone large and centred

## Technical approach

- New `remotion/` folder in the project (version-controlled, re-renderable later).
- `src/Root.tsx` registers three compositions (`pmax-16x9`, `pmax-1x1`, `pmax-9x16`) sharing one `MainVideo` and five scene components; layout switches on `useVideoConfig()` width/height.
- Attached assets copied into `remotion/public/`, referenced via `staticFile()`.
- Fonts via `@remotion/google-fonts` (Rubik, Quicksand) to match the site exactly.
- All motion frame-based (`interpolate` / `spring`), rendered headlessly via a `scripts/render-remotion.mjs` script.
- Output: three MP4s in `/mnt/documents/` (H.264, ready to upload to Google Ads).

## Notes

- PMax accepts 16:9, 1:1 and 9:16 video; 15s sits inside the 10s minimum requirement.
- No app code is touched — this is a standalone video project inside the repo.
