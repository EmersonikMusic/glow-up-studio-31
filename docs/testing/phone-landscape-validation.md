# Phone Landscape Validation Test Plan

This document defines how to verify the layout, interactions, and styling of the trivia game on **true phone-landscape viewports** (height ≤ 500px, orientation: landscape).

## Why this is needed

The Lovable in-product preview snaps the viewport selector to a fixed list of sizes (max width 1920, includes `844×1194` and `820×1180` but **no true phone-landscape pairing** like `844×390`). This means:

- The `useIsMobile` hook (width-based) cannot be exercised in the matched orientation.
- The `@media (max-height: 500px) and (orientation: landscape)` rules in `src/index.css` (mascot anchoring, card padding overrides, bottom-sheet drawer on landscape phones) are **only triggered on real devices, Chrome DevTools Device Mode, or Playwright** runs that explicitly set short-height viewports.

Use the methods below before shipping any layout change that touches the header, question card, mascot, footer, or settings drawer.

## Target viewports

All landscape, height ≤ 500px:

| Device                         | Width × Height |
| ------------------------------ | -------------- |
| iPhone SE                      | 667 × 375      |
| iPhone 8 Plus                  | 736 × 414      |
| iPhone X / 11 Pro              | 812 × 375      |
| iPhone 12 / 13 / 14            | 844 × 390      |
| iPhone 11 / XR                 | 896 × 414      |
| iPhone 14 Pro Max              | 932 × 430      |
| Galaxy S8 (baseline)           | 740 × 360      |
| Common Android landscape       | 800 × 360      |

## Methods

### 1. Chrome DevTools (fastest manual check)

1. Open the Preview URL in Chrome.
2. `Cmd/Ctrl + Shift + I` → toggle Device Toolbar (`Cmd/Ctrl + Shift + M`).
3. Select **Responsive** and enter the width × height from the table above.
4. Use **Capture screenshot** (`Cmd/Ctrl + Shift + P` → "Capture screenshot") for each state.

### 2. Real device

1. Open the Preview URL on the phone.
2. Rotate to landscape.
3. Walk the per-viewport checklist below.

### 3. Playwright (preferred for repeatability)

Run the automated visual-regression suite, which sets each target viewport and captures screenshots + overlap assertions:

```bash
npx playwright test tests/visual-regression.spec.ts
```

Output:
- Screenshots → `tests/__screenshots__/`
- Pass/fail summary → `tests/__screenshots__/REPORT.md`

## Per-viewport checklist

For each viewport, capture **gameplay** and **settings-open** states and verify:

| # | Check |
| - | ----- |
| 1 | **Header** — logo, login/username pill, About, Settings gear, Fullscreen all visible; nothing wraps to a second row. |
| 2 | **Question card** — question text and all 4 answers fully on-screen; no horizontal scroll. |
| 3 | **Mascot** — visible in the right gutter, vertically centered; does not overlap any text inside the card. |
| 4 | **Footer pill** — countdown number + progress bar fully visible and tappable; not overlapped by mascot. |
| 5 | **Settings drawer** — tap gear → slides up from the **bottom** (NOT from the right). Apply button reachable via scroll if needed. |
| 6 | **No clipping** — no content extends past the top, right, bottom, or left edges. |

## Pass criteria

Every item checked on every listed viewport. Failures must be recorded with:
- Screenshot
- Viewport size
- Brief description of the issue

## Recording results

Use the table below per viewport:

```
Viewport: 844 × 390 (iPhone 12)
Date: YYYY-MM-DD
Tester: <name>

| Check                | Pass/Fail | Notes |
| -------------------- | --------- | ----- |
| Header               |           |       |
| Question card        |           |       |
| Mascot               |           |       |
| Footer pill          |           |       |
| Settings drawer      |           |       |
| No clipping          |           |       |
```
