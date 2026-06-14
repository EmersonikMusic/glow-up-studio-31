## What to change

### 1. Replace the two mascot SVG files
Overwrite with the newly uploaded versions:
- `src/assets/mascots/television.svg` ← `user-uploads://television-3.svg`
- `src/assets/mascots/human-body.svg` ← `user-uploads://human-body-3.svg`

### 2. Fix the transparency bug in `src/components/MascotSvg.tsx`

**Root cause** (answering your question):

It is the same asset — but the bug is caused by how it's rendered, not the file itself. In `TriviaGame.tsx` the mascot is inlined **twice in the DOM at the same time**: once in the mobile column (`md:hidden`) and once in the desktop column (`hidden md:flex`). Tailwind's `hidden` uses `display: none`, but the markup is still in the DOM.

Each mascot SVG defines gradients with generic IDs (`linear-gradient`, `linear-gradient-2`, `linear-gradient-3`, …) and references them via `fill="url(#linear-gradient)"`. When the same ID exists twice in a document, `url(#id)` resolves to the **first** match in document order. On desktop, the visible desktop mascot's gradient references resolve to the mobile copy's `<linearGradient>` elements — which live inside a `display:none` subtree. Browsers (especially WebKit/Safari and some Chromium versions) don't always paint paint-server references that live inside `display:none` ancestors, so those filled regions render transparent. On mobile, the mobile mascot is the first occurrence and references resolve to itself, so it looks correct.

This is purely an SVG-ID-collision issue — only the Television and Human Body assets surface it visibly because their faces rely heavily on gradient fills; other mascots are mostly flat fills so the collision is invisible.

**Fix:** in `MascotSvg.tsx`, give every inline mascot instance a unique ID namespace. In the existing `useMemo`, after the current `<svg …>` rewrite, also:

1. Generate a unique suffix per render instance, e.g. `const uid = useId().replace(/:/g, "");`.
2. Collect all `id="…"` values in the markup and rewrite each occurrence (both `id="X"` and matching `url(#X)` / `href="#X"` / `xlink:href="#X"`) to `X__${uid}`.

This is a small, contained string transform on the raw SVG markup, runs once per category change via `useMemo`, and leaves the asset files untouched.

### Out of scope
- No changes to the URL-based mascot path (`<img src=…>` in Start/About/Result) — separate `<img>` documents can't collide.
- No layout, animation, or styling changes.

### Files touched
- `src/assets/mascots/television.svg` (overwrite)
- `src/assets/mascots/human-body.svg` (overwrite)
- `src/components/MascotSvg.tsx` (add ID-namespacing in the existing `useMemo`)
