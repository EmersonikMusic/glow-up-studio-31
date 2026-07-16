## Diagnosis

The current fix (opacity 0 + `transition: none` until `ready` flips) still leaves the panel DOM in the tree during that first frame. On some devices/preview iframes there is a brief window where the browser paints the element before React's inline `transform: translateY(100%)` is applied, so the sheet flashes at its natural `bottom: 0` position, then "moves down and fades" once the transform + transition kick in.

The Playwright harness I added on the last turn confirms this: at t = 0 ms the sheet is already off-screen, so the harness passes even though the user's real device shows the flash. The heuristic (`opacity === 0` OR off-screen) is too permissive for the paint-gap case.

## Fix

Two small, targeted changes to `src/components/SettingsPanel.tsx`:

1. **Don't render the panel DOM until `ready` is true.**
   Add `if (!ready) return null;` right before the mobile/desktop return blocks. This eliminates the flash entirely — there is no element in the tree for the browser to paint in the wrong position. Once `ready` flips to true (via the existing `useLayoutEffect` + `requestAnimationFrame`), the panel mounts with its correct closed-state transform (`translateY(100%)` mobile / `translateX(calc(100% + 64px))` desktop) already applied on the very first paint. Because the transform is committed before the transition is enabled, there is nothing to animate from.

2. **Enable the transition one frame after mount, not on the same tick.**
   Split `ready` into two steps: `mounted` (component committed) → `animated` (transition enabled). Only `animated` gates the `transition` property; `mounted` gates whether we return JSX. This guarantees the first paint has `transition: none` and the correct transform, and the second paint enables the transition so future open/close still animates.

   ```
   const [mounted, setMounted] = useState(false);
   const [animated, setAnimated] = useState(false);
   useLayoutEffect(() => {
     setMounted(false); setAnimated(false);
     const raf1 = requestAnimationFrame(() => {
       setMounted(true);
       const raf2 = requestAnimationFrame(() => setAnimated(true));
     });
     return () => cancelAnimationFrame(raf1);
   }, [isMobile]);
   if (!mounted) return null;
   ```

   Then use `transition: animated ? "..." : "none"` and `opacity: 1` (no more opacity fade — the panel is either mounted-and-closed off-screen, or opening/closing via transform).

## Tighten the regression test

Update `/tmp/browser/settings-hidden/test.py` so it no longer accepts "opacity 0" as sufficient — require the element be genuinely off-screen (`top >= vh - 1` OR not in DOM) at every sampled frame. This catches the paint-gap flash if it ever reappears. Re-run and confirm all four phases pass, plus the "open works" phase still passes.

## Out of scope

- No visual changes to the panel when open.
- No change to backdrop behavior (already fully driven by `open`).
- No change to desktop drawer semantics beyond mounting/transition gating.
