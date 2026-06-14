## Why mobile still shows transparency

My previous fix namespaced `id` attributes and `url(#...)` / `href="#..."` references, which solved the duplicate-ID problem. But the mascot SVGs (Adobe Illustrator exports) also contain a `<style>` block like:

```css
.cls-6 { fill: url(#linear-gradient-4); }
.cls-15 { fill: url(#linear-gradient); }
```

Both the mobile and desktop inline copies of the mascot inject their own `<style>` block into the document. CSS class selectors apply **globally** — both rules match every `.cls-6` element in the page, and the **later** `<style>` block in document order wins the cascade.

- The desktop mascot is rendered **after** the mobile mascot in the DOM.
- On desktop view: desktop is visible, mobile is `display:none`. Desktop's `<style>` wins and points to desktop's own (visible) gradients → renders fine.
- On mobile view: mobile is visible, desktop is `display:none`. Desktop's `<style>` STILL wins (still later in DOM), so visible mobile elements get fills like `url(#linear-gradient-4__desktopUID)` — but that gradient lives inside the hidden desktop subtree → paint server unavailable → **transparent face/skin**.

This is why Television and Human Body specifically broke on mobile only — their faces/body skin rely on class-based gradient fills.

## Fix

In `src/components/MascotSvg.tsx`, extend `namespaceSvgIds` to also rewrite `.cls-N` class names, both:
- inside `<style>` selectors (`.cls-6` → `.cls-6__<uid>`), and
- inside `class="..."` attributes on every element (`class="cls-6"` → `class="cls-6__<uid>"`).

Each inline mascot instance gets a unique uid from `useId()`, so its `<style>` rules only match its own elements. Mobile and desktop become fully isolated — neither can override the other.

No other files change. No layout, animation, or asset changes.

### Files touched
- `src/components/MascotSvg.tsx` (extend the existing `namespaceSvgIds` helper)
