## Unify SEO metadata across the site

Apply Title Case "Triviolivia", drop ".com" from titles, and use the stronger unified title + description everywhere.

### Final values
- **Title (everywhere)**: `Triviolivia — Free Trivia Game | 25 Categories, 12 Eras`
- **Meta description (everywhere)**: `Play Triviolivia free in your browser — thousands of say-aloud trivia questions across 25 categories, 5 difficulties, and 12 eras. No signup.`
- **og:site_name (everywhere)**: `Triviolivia`
- **JSON-LD `name`**: `Triviolivia`

### File changes

**`index.html`**
- `<title>` → new unified title
- `<meta name="description">` → new description
- `<meta name="author">` → `Triviolivia`
- `<meta property="og:site_name">` → `Triviolivia`
- `<meta property="og:title">` / `twitter:title` → new title
- `<meta property="og:description">` / `twitter:description` → new description

**`src/pages/Index.tsx`** (react-helmet)
- `<title>` → new unified title (matches index.html)
- description stays in sync (already matches)
- `og:site_name` already `Triviolivia` ✓
- JSON-LD: change `WebSite.name` and `Organization.name` and `Game.name` from `TRIVIOLIVIA` → `Triviolivia`; update `WebSite.description` to match new direction

**`src/pages/NotFound.tsx`**
- Update any branded title suffix from `TRIVIOLIVIA` / `.com` variants to `Triviolivia` (will verify exact text on read in build mode)

### Not changing
- Visual logo/wordmark (`TRIVIOLIVIA` stays stylized in the UI)
- H1s on Start and Result screens
- llms.txt, robots.txt, sitemap.xml content
