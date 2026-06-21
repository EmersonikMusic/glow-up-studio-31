## Typography Unification — Final Scope

Reference standard:
- **Eyebrow**: `text-sm font-subheading font-bold tracking-[0.2em] uppercase`, teal `hsl(185 70% 55%)`.
- **H1**: `text-4xl font-heading font-extrabold uppercase leading-none tracking-tight`, gold gradient.
- **Body**: `text-sm leading-relaxed font-body font-semibold`, white.

### Fixes

**ResultScreen.tsx**
1. "Trivia Complete!" hero → H1 standard (text-4xl, uppercase, tracking-tight, gold gradient). Keep `animate-bounce-in`.
2. "Ready for another round?" → `text-sm font-body font-semibold text-white leading-relaxed` (replaces muted/text-base).
3. "Round Recap" eyebrow → `text-sm` (was `text-xs`).
4. "Review Your Game" DialogTitle → H1 standard (`text-4xl` + gold gradient).
5. DialogDescription → add `leading-relaxed`.

**SettingsPanel.tsx**
6. "Customize Your Experience" title → `text-4xl font-heading font-extrabold uppercase leading-none tracking-tight` + gold gradient. Drop inline `lineHeight: 1.1`.

**AppErrorBoundary.tsx**
7. h1 → H1 standard. Body p → `text-sm leading-relaxed font-body font-semibold text-white`. Add eyebrow "Hiccup".

**KeyboardShortcutsHelp.tsx**
8. Popover title → `text-xs font-subheading font-bold tracking-[0.18em] uppercase`, teal.

### Explicitly NOT changing (per user)
- PauseOverlay
- SettingsPanel section header labels / slider value labels
- NotFound (404) page

No backend changes. Files: `ResultScreen.tsx`, `SettingsPanel.tsx`, `AppErrorBoundary.tsx`, `KeyboardShortcutsHelp.tsx`.