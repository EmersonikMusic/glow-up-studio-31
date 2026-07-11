Goal: On the `/terms` page, add the homepage-style header bar, but only the Trivolivia logo on the left — no nav icons on the right.

What I’ll do:

1. Extend `GameHeader.tsx` with a minimal mode.
   - Add an optional `showNav?: boolean` prop (default `true`).
   - When `showNav` is `false`, keep the left logo and the same blurred background/border, but render the right side empty (no Auth, About, Settings, Sound, Keyboard-help, or Fullscreen icons).
   - The logo stays clickable via `onHome`.

2. Update `Terms.tsx` to use the header and match the homepage layout feel.
   - Import `GameHeader` and React Router’s `useNavigate`.
   - Change the page from `fixed inset-0` to a `min-h-screen flex flex-col` container with the dark background and ambient blobs.
   - Place `GameHeader` at the top with `showNav={false}` and `onHome={() => navigate("/")}`.
   - Wrap the legal card in a `flex-1` flex container that centers content but leaves room for the header, so the card no longer overlaps the bar.
   - Preserve the existing Helmet metadata and the "Back to Home" footer CTA.

Result: `/terms` will look like a normal app page with the Trivolivia header, and the logo will be the only interactive element in the header bar.