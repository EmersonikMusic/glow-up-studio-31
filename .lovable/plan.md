## Update AuthModal login popup

**File:** `src/components/AuthModal.tsx`

### 1. Standard-branded social buttons (stacked, full-width)
- Replace the custom Google/Apple buttons with the official brand button styles:
  - **Google**: white background, `#dadce0` 1px border, `#3c4043` text in Roboto/Medium, official 4-color "G" logo (keep current SVG which matches Google's brand asset), left-aligned icon with centered "Continue with Google" label. Follows Google's Sign-In branding guidelines.
  - **Apple**: solid black background, white text, official Apple logo glyph (keep current SVG — it matches Apple's guideline glyph), label "Continue with Apple". Follows Apple's Sign in with Apple button guidelines.
- Change layout from `grid grid-cols-2` to a vertical stack (`flex flex-col gap-3`), each button `w-full` so they match the Sign In/Sign Up submit button width.
- Keep the Apple button as disabled/"Coming soon" (unchanged behavior).
- Buttons remain rounded pills (`rounded-full`) to stay consistent with the submit button shape; sizing/height (`h-12`) unchanged.

### 2. Submit button icon
- Show the `LogIn` icon only in Sign In mode. Remove it when `isSignup` is true.

### 3. Sign Up: confirm password
- Add a `confirmPassword` state and, when `isSignup`, render a second password field ("Confirm password") below the password field with the same eye toggle styling.
- In `handleSubmit`, when `isSignup`:
  - require `confirmPassword` non-empty
  - if `password !== confirmPassword`, set error "Passwords do not match." and abort before calling `supabase.auth.signUp`.
- Reset `confirmPassword` when toggling between modes (same place `error` is reset).
- `autoComplete="new-password"` on both password fields in signup mode.

### Out of scope
- No changes to auth logic, OAuth flow, routes, or other components.
