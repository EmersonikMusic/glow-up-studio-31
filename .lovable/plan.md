## Problem

The app crashes on load with React minified error #310 ("Rendered more hooks than the previous render"), which is why the AppErrorBoundary "Triviolivia couldn't finish loading" screen appears.

Root cause is in `src/components/AuthButton.tsx`. After the recent "new badge indicator" changes, two hooks were added **after** an early `return` for the logged-out state:

```tsx
if (!user) {
  return (<>…login button…</>);   // early return
}
…
const [seenBump, setSeenBump] = useState(0);   // ← hook called only when user is signed in
useEffect(() => { …SEEN_EVENT listener… }, []);// ← same
```

On first render `user` is `null`, so React sees N hooks. As soon as `supabase.auth.getSession()` resolves and `setUser` fires, the component re-renders with a signed-in user and calls **two extra hooks**, which triggers error #310 and unmounts the whole app into the error boundary.

## Fix

Move `useState(seenBump)` and its `useEffect` listener above the `if (!user)` early return so hook count is stable across renders. The `unlockedIds` / `hasUnseen` derivations stay in the signed-in branch — they are plain expressions, not hooks.

## Verification

- Reload preview; the start screen should render normally (no error boundary).
- Console: no React #310, no "App render failed".
- Sign in → user pill appears; the teal "new badge" dot behaves as before; opening the profile clears it (SEEN_EVENT still forces the re-render because the hook now runs in both branches).

## Notes

Other recent changes (BadgeToast, SettingsPanel density, ResponsiveSonner) were reviewed and are not implicated — they don't call hooks conditionally. Only `AuthButton.tsx` needs to change.