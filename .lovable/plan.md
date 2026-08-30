# Match "Customize Your Experience" header width to the Apply Settings CTA

## Goal
On mobile, increase the single-line "Customize Your Experience" header so its text width matches the width of the "Apply Settings" CTA pill button below it.

## Current state (measured on 390px mobile)
- Header text span width: ~251px at font-size 16.38px (`clamp(11px,4.2vw,17px)`).
- Apply Settings CTA pill width: ~308px (fixed `text-xl` 20px + `px-10` padding, constant across mobile widths).
- Header is narrower than the button.

## Change
File: `src/components/SettingsPanel.tsx` (mobile `<h2 class="sm:hidden">` ~line 448).

Update the mobile clamp from `clamp(11px,4.2vw,17px)` to `clamp(15px,5.2vw,20px)`:
- At 390–414px viewports the clamp caps at 20px → header text ≈306px, matching the ~308px CTA.
- On narrower phones (360px → ~18.7px / 286px) it scales down gracefully and never overflows the full-width panel.
- The `5.2vw` slope hits 20px right at 385px, so the common 390–430px range lands exactly on the cap.
- Desktop/tablet two-line layout is untouched (`hidden sm:block`).

## Verification
- Playwright on 390px and 414px mobile: measure header span width ≈ CTA width (~308px), confirm one line, no overflow.
- Confirm the desktop/tablet two-line heading still renders unchanged.
- `tsgo --noEmit`.
