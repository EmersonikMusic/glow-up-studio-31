## Goal

Make body copy consistent across the three flagged screens (Restart-with-new-settings dialog, Settings panel "Apply" helper text, and the pre-mount Loading fallback in `index.html`) by aligning them with the established standard. The in-app "Loading next round…" screen already matches H1 standard and needs no change — used as the reference.

## Standard (reaffirmed)

- **H1 (dialog/screen title):** `text-4xl font-heading font-extrabold uppercase tracking-tight` + gold gradient text-fill, `lineHeight: 1.05`.
- **Body copy:** `text-sm leading-relaxed font-body font-semibold text-white`.
- **Teal inline accents:** `font-bold`, color `hsl(185 70% 55%)`.

## Changes

### 1. `src/components/SettingsPanel.tsx` — Restart dialog (~lines 526–530)
- Promote `AlertDialogTitle` to H1 standard: `text-4xl font-heading font-extrabold uppercase tracking-tight` with gold gradient (`background: linear-gradient(160deg, hsl(42 100% 62%) 0%, hsl(35 90% 48%) 45%, hsl(28 90% 40%) 100%)`, `WebkitBackgroundClip: text`, `WebkitTextFillColor: transparent`, `lineHeight: 1.05`). Keep copy "Restart with new settings?".
- Set `AlertDialogDescription` to body standard: `text-sm leading-relaxed font-body font-semibold text-white` (overrides default muted-foreground grey).

### 2. `src/components/SettingsPanel.tsx` — "must select" helper under Apply (~lines 562–568)
- Change wrapper `<p>` to body standard: `text-sm leading-relaxed font-body font-semibold text-white text-center max-w-xs`. Teal accent spans unchanged.

### 3. `index.html` — pre-mount Loading fallback (lines 60–61)
- Replace the two `<p>` inline styles (system-ui, opacity 0.75, 14px) with the in-app body equivalent inline:
  - `font-family: ui-rounded, 'SF Pro Rounded', 'Segoe UI', system-ui, sans-serif;`
  - `font-weight: 600; font-size: 14px; line-height: 1.6; color: #FFFFFF; opacity: 0.9;`
- Keep the teal `triviolivia.com` span color (`hsl(185,70%,55%)`) and bump it to `font-weight: 700` to mirror in-app teal accent treatment.

### 4. "Loading next round…" — verification only
- Confirmed already on H1 standard in `TriviaGame.tsx` (~575–586). No code change.

## Out of scope
- No copy/wording changes.
- No layout, spacing, button, or backend changes.
- No edits to PauseOverlay, NotFound (404), or SettingsPanel section header labels.
