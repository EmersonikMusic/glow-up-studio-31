## 1. Settings Menu — mobile density

`src/components/SettingsPanel.tsx`
- `FadeIcon`: accept a `size` prop (default 24). Pass **20** on mobile (`useIsMobile`) for Categories, Difficulties, Eras, and Game Settings section icons.
- `SectionHeader`: reduce padding on mobile from `14px 20px` → `10px 16px`; keep desktop unchanged.
- `ToggleRow`: mobile padding `12px 20px` → `9px 16px`, `minHeight` 44 → 40.
- `FilterSection` wrapper: mobile `mx-5 mb-3` → `mx-4 mb-2`.
- Section gap between the four sections tightens by ~30% on mobile only. Desktop untouched.

## 2. Achievement toasts — richer visuals, better placement, dismissible, stackable

Because badges don't yet ship with per-badge SVGs (only `visualDesign` text and a shared Trophy), the "specific icon" on the toast will be a **badge-type-driven Lucide icon on the gold gradient chip** used elsewhere in the app, plus the badge name and tier styling. This reads as distinct per badge without shipping 60 new assets. (If you'd rather commission per-badge SVGs, that's a follow-up asset task.)

New component `src/components/BadgeToast.tsx`:
- 56×56 gold-gradient circle (matches `BadgeItem` front), icon chosen by `badgeType`:
  - Progression & Consistency → `Sparkles`
  - Mode & Difficulty Mastery → `Target`
  - Time Travelers → `Hourglass`
  - Category Specialists → `Compass`
  - Custom Combo Games → `Puzzle`
- Right column: `BADGE UNLOCKED` eyebrow (teal), badge name (bold), `requirement` in muted text.
- Close (×) button top-right, `aria-label="Dismiss"`.

`src/App.tsx` — configure Sonner:
- `<Sonner position="bottom-right" expand duration={6000} visibleToasts={5} closeButton />` on desktop.
- On mobile keep `bottom-center` (current default) with same duration/expand so the sheet-style stacking still reads.
- Use `useIsMobile` in a small wrapper around `<Sonner />`.

`src/components/TriviaGame.tsx` (line 149-153) — replace the string toast with:
```
toast.custom((id) => <BadgeToast id={id} badge={b} />, { duration: 6000 })
```
Multiple new badges → one toast per badge, staggered by 150 ms so stacking reads clearly. `expand` keeps all readable until user hovers away.

## 3. New-badge indicators + audio

Storage of "seen" badges (client-only, per device):
- New `src/lib/badgeSeen.ts` using `safeStorageGet/Set` (key `to.badges.seen`) storing a `string[]` of badge IDs the user has acknowledged.
- Helper: `getUnseen(unlockedIds)`, `markAllSeen(unlockedIds)`, `markSeen(id)`.

Nav pill dot — `src/components/AuthButton.tsx`:
- Fetch `unlocked_badges` alongside profile.
- If `getUnseen(unlocked_badges).length > 0`, render a 8 px dot (teal `hsl(185 70% 55%)`, subtle white ring) absolutely positioned top-right of the pill.
- Cleared when the user opens the profile panel: call `markAllSeen()` inside `onOpenProfile` handler in `TriviaGame.tsx` / wherever ProfilePanel is opened.

Profile per-badge "new" ring — `src/components/BadgeItem.tsx` + `AchievementsSection.tsx`:
- Add optional `isNew` prop to `BadgeItem`. When true, render a small teal dot at top-right of the 84 px circle and a soft teal ring glow.
- `AchievementsSection` receives `newIds: string[]` and passes `isNew` per badge.
- `ProfilePanel` computes `newIds = getUnseen(unlockedBadgeIds)` on mount, passes them in, then calls `markAllSeen(unlockedBadgeIds)` after render (so the dots persist for the current viewing session but clear next time).

Audio — `src/lib/sound.ts`:
- Add `"badge"` to `SoundName`. Envelope: C5→E5→G5→C6 short arpeggio at 0.5 volume (softer than `complete`), ~0.6 s total.
- In `TriviaGame.tsx`, when `newBadges.length > 0` and sound not muted, `play("badge")` once (before scheduling toasts).

## Technical notes

- No DB/schema changes; "seen" state is per-device (localStorage) — matches how mute is stored.
- No new assets required. Lucide icons already available.
- `sonner` supports `toast.custom`, `closeButton`, `expand`, `visibleToasts`, `position` — all in the version already installed.
- `useIsMobile` initial-value fix already in place, so switching Sonner position by breakpoint won't flash.

## Files touched

```text
src/components/SettingsPanel.tsx        density tweaks
src/components/BadgeToast.tsx           new
src/App.tsx                             Sonner config + mobile wrapper
src/components/TriviaGame.tsx           toast.custom + play("badge") + mark-seen on profile open
src/components/AuthButton.tsx           unseen-dot
src/components/BadgeItem.tsx            isNew prop + dot/ring
src/components/AchievementsSection.tsx  pass newIds through
src/components/ProfilePanel.tsx         compute newIds + markAllSeen
src/lib/badgeSeen.ts                    new
src/lib/sound.ts                        add "badge" sound
```
