I’ll update the SEO title everywhere it can affect search/social display to exactly:

`TRIVIOLIVIA.com - Earth's Deepest Trivia Source`

Planned changes:

1. Update `index.html`
   - Change the main `<title>` to the exact requested text.
   - Change `og:title` to the exact requested text.
   - Change `twitter:title` to the exact requested text.
   - Update `og:site_name` if needed so it matches the requested branding.

2. Update `src/pages/Index.tsx`
   - Change the React Helmet `<title>` to the exact requested text.
   - Change Helmet `og:site_name` if needed so it doesn’t override the casing/domain styling.
   - Update structured data names where appropriate so search engines see `TRIVIOLIVIA.com` consistently.

Technical note:
- Google may still take time to re-crawl and refresh the displayed search result title after the change is published.