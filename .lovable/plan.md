# Triviolivia PMax Video — 15s, three aspect ratios

A 15-second kinetic-energy motion graphics ad built in code (Remotion), rendered as MP4 in 1:1, 9:16 and 16:9 from one shared source so all three cuts are visually identical.

## Assets received

- `TO_LOGO_FINAL-2.svg` — full logo lockup (hero + end card)
- `default.svg` — Olivia mascot
- `TO_UI_StartScreen.png`, `TO_UI_SettingsScreen.png`, `TO_UI_GameScreen.png` — phone-framed UI screens (already in device frames, so they drop straight into the 3D phone element)
- `PMAX_4x5_A.png` — end-card reference (layout, type hierarchy, feature bullets, Play Now pill)
- How-to-play carousel screenshot — scene order and copy reference

Nothing else is blocking. Two things I can't do myself: I can't watch the YouTube reference, so I'll build the phone motion from the description below — if it's off, point me at a timestamp and describe the move. And confirm the end-card CTA line: reference says "READY TO PLAY?" / "TRIVIA. BUILT YOUR WAY." / PLAY NOW / triviolivia.com — I'll use exactly that unless you say otherwise.

Everything else comes from the site's look: dark indigo background (`240 45% 16%`), gold (`42 100% 55%`) and teal (`185 70% 55%`) accents, Rubik headings, Quicksand body, red-to-yellow logo gradient for hero type.



## Story (15s, 30fps)

```text
0.0-2.5s  HOOK      Logo snaps in over drifting ambient blobs; tagline
                    "Earth's Deepest Trivia Source" arcs in.
2.5-6.0s  FREE      "Free to play. No signup." Big type, mascot pops in,
                    home-screen phone ROTATES IN from off-frame.
6.0-9.5s  CUSTOM    "Make it yours." Phone spins on its Y axis to reveal
                    the Customize screen; category / difficulty / era
                    chips stagger in around it.
9.5-12.5s PLAY      "Call out your answer — before the timer runs out!"
                    Phone flips to the question screen, countdown ring
                    sweeps, answer reveal snap.
12.5-15s  END CARD  "Ready to play?" + Play Now button + triviolivia.com,
                    logo lockup, gold accent wipe out.
```

Phone motion: the device is a single persistent 3D element in `perspective` space. It arcs in with a spring-driven `rotateY` + `rotateZ` tumble (roughly -75deg to 0deg with a slight overshoot), then each scene change flips it on the Y axis — the screen content swaps at the 90deg point so the flip reads as a real card turn. Between flips it holds a slow idle tilt so nothing is ever static. If you share a motion reference I'll match its arc, spin count and easing.

Copy for the PLAY line is a placeholder to tune — alternatives: "Shout it out before time's up!" / "Beat the buzzer. Say it loud."

Motion system: one default entrance (spring scale + rise + blur-to-sharp), gold wipe transitions between scenes, phone parallax against the type, no static frames. Silent (PMax plays muted by default) — captions/type carry the message.

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
