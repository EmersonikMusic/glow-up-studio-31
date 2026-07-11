Goal: Make `/terms` shareable/OAuth-ready and give it a footer that mirrors the homepage style, without a privacy modal.

What I’ll do:

1. SEO verification on `/terms`.
   - Confirm title, description, canonical, Open Graph, and Twitter tags are present.
   - Add a JSON-LD `Article` schema in the Helmet for richer search/OAuth context.

2. Add a footer to `/terms`.
   - Create `src/components/TermsFooter.tsx` styled like the homepage `LegalFooter`.
   - It will include: copyright line, a `Home` link back to `/`, and a non-modal “Terms of Service & Privacy Policy” span (since the user is already on that page and explicitly does not want the modal).

3. Update the `/terms` layout.
   - Wrap the centered legal card and the new footer in a flex container so the card fills the remaining space and the footer sits visibly at the bottom on both mobile and desktop.

Result: `/terms` keeps its SEO tags and gets a homepage-style footer with a back-to-start link and the legal link, without triggering the Privacy modal.