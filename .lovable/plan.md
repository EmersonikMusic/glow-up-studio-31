

## Plan: 3 settings/header polish fixes

### 1. Tighten gap below "Apply Settings" button (desktop drawer)
The Apply button container has `pt-3 pb-6 md:pb-5` (line 552). User reports the bottom gap is still bigger than the top gap above Categories. Make it visually balanced:
- `px-5 pt-3 pb-6 md:pb-5` → `px-5 pt-3 pb-3 md:pb-3`

This matches the `mb-3` spacing used between accordion sections, so the Apply button sits with the same rhythm as the section cards above it.

### 2. Keep header actions right-aligned when logged in (mobile)
**Root cause** (`GameHeader.tsx` lines 38–47): when `user` is truthy and viewport < `sm`, the logo container gets `hidden`, removing it from the DOM. With only one child left inside `flex justify-between`, the actions group collapses to the left.

**Fix**: keep an invisible placeholder in the logo's slot on mobile so `justify-between` still pushes actions to the right. Replace the conditional `hidden sm:flex` on the logo container with always-rendered, and inside it conditionally render the `<img>` only on `sm:` and above. The empty `<div>` keeps the flex slot occupied.

```tsx
<div className="items-center flex-shrink-0 select-none flex">
  <img
    src={toLogoSm}
    alt="Trivolivia"
    className={`h-8 w-auto ${user ? "hidden sm:block" : "block"}`}
    draggable={false}
  />
</div>
```

Result: logged-in mobile users see an empty left slot + right-aligned username/logout/settings — identical alignment to the logged-out state. No layout shift on login/logout.

### 3. Match Settings drawer Back button to AboutScreen's back arrow
AboutScreen uses (line 64–74): a 36px circular pill button with `ArrowLeft` icon (gold), translucent white bg, white border. Currently SettingsPanel uses a text-style "‹ Back" pill.

Replace the desktop-only Back block in SettingsPanel (lines 287–297) with the same circular icon button as AboutScreen — but positioned top-left of the drawer rather than absolute top-right:

```tsx
{!isMobile && (
  <div className="px-5 pt-4 md:px-6 md:pt-5">
    <button
      onClick={onClose}
      aria-label="Back"
      className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 hover:brightness-125 active:scale-95"
      style={{
        background: "rgba(255, 255, 255, 0.08)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
      }}
    >
      <ArrowLeft className="w-4 h-4" style={{ color: "hsl(var(--game-gold))" }} />
    </button>
  </div>
)}
```

Swap the `ChevronLeft` import for `ArrowLeft` (keep `ChevronDown` as-is).

### Files touched
- `src/components/SettingsPanel.tsx` — swap Back button styling + icon, tighten Apply button bottom padding.
- `src/components/GameHeader.tsx` — keep logo slot in DOM on mobile when logged in; only hide the img.

### Out of scope
- No changes to AboutScreen.
- No changes to mobile bottom-sheet behavior.
- No content/copy changes.

