## Change

When the user applies custom settings from the Customize Game panel, the primary CTA on the Start screen should read **"Start Game"** instead of **"Quick Play"**.

## Implementation

1. **`src/components/TriviaGame.tsx`** (parent that owns settings + `onApply`)
   - Add state `const [hasCustomized, setHasCustomized] = useState(false)`.
   - In the `onApply` handler passed to `StartScreen`, set `hasCustomized` to `true` (in addition to existing apply logic).
   - Pass `hasCustomized` down to `StartScreen` as a new prop (e.g. `customized`).

2. **`src/components/StartScreen.tsx`**
   - Accept the new `customized?: boolean` prop.
   - In the `PrimaryCTA`, replace the literal `"Quick Play"` label (and the `aria-label` fallback) with `customized ? "Start Game" : "Quick Play"`.
   - Loading state text/aria-label unchanged.

No other behavior, styling, animation, or width logic changes. Button width container stays as-is so both CTAs remain equal width regardless of label.
