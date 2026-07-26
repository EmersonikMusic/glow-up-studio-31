## Update era icons

Replace the contents of the two existing era icon files with the newly uploaded artwork (a timeline/milestone mark, replacing the old hourglass):

- `src/assets/icon-era-active.svg` ← `icon-era-active-2.svg` (white `#fff`)
- `src/assets/icon-era-inactive.svg` ← `icon-era-inactive-2.svg` (teal `#8bd2d9`)

No code changes needed — `SettingsPanel.tsx` already imports both paths, so the new art appears automatically in the Settings tab (active and inactive states). Filenames stay the same to avoid touching imports.

Verification: load the Settings panel and confirm the Eras tab shows the new icon in both selected and unselected states.
