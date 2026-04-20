
## Plan: Widen tablet portrait Settings drawer

### Issue
Desktop SettingsPanel uses `w-[30%]` which on a 768px tablet portrait = ~230px wide — narrower than the `min-h-14 px-10` "Apply Settings" CTA, causing it to clip or look cramped.

### Fix
`src/components/SettingsPanel.tsx` (desktop branch, ~line 538): change the panel width from `w-[30%]` to a responsive value that scales with breakpoint:

```
w-[420px] md:w-[55%] lg:w-[40%] xl:w-[32%] max-w-[480px]
```

- **Tablet portrait (768–1023px)**: ~422px — comfortably fits "Apply Settings" with padding.
- **lg (1024–1279px)**: ~410px.
- **xl (1280px+)**: ~410–480px capped — close to the original 30% feel on large desktops.
- `max-w-[480px]` prevents it from getting absurdly wide on ultrawide monitors.

The mobile bottom-sheet branch (under `useIsMobile`, <768px) is untouched.

### Files touched
- `src/components/SettingsPanel.tsx` — single className change on the sliding panel wrapper.

### Out of scope
No content, padding, or styling changes inside the drawer.

### Verification
At 768×1024 (tablet portrait): drawer is ~420px wide, "Apply Settings" CTA fits on one line with breathing room on both sides. At 1440px desktop: drawer width visually similar to before.
