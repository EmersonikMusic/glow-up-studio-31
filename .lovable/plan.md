## Goal

Replace the current 3 hard-coded placeholder circles inside `ProfilePanel.tsx` → "Achievements & Awards" with a scalable, data-driven grid. Keep visual style (circular gold/locked treatment) consistent with the existing badge look.

---

## 1. New data file — `src/data/badgeData.ts`

- Export `Badge` type: `{ badgeType, setting, tier, badgeName, requirement, visualDesign }` plus a derived stable `id` (slug of `badgeType + setting + badgeName`).
- Export `BADGES: Badge[]` — the full JSON list the user provided, typed and frozen.
- Export a `BADGE_CATEGORIES` order constant used for grouping/fallbacks:
  `["Progression & Consistency", "Mode & Difficulty Mastery", "Time Travelers (Eras)", "Category Specialists", "Custom Combo Games"]`.

No unlock logic in the data file — data only.

---

## 2. New component — `src/components/BadgeItem.tsx`

Props: `{ badge: Badge; unlocked: boolean }`.

- Perfectly circular (`rounded-full`, fixed `w-16 h-16`), matching the current gold gradient treatment for unlocked and the muted lock icon for locked (reuse the existing `GOLD_GRADIENT`, `Trophy`, `Lock` visuals so nothing else changes visually).
- Under the circle: badge name label (10px uppercase, same as today).
- Tooltip/popover on hover (pointer) and on tap (touch) for **unlocked** badges only, showing `badgeName` (bold) and `requirement` (muted). Use existing shadcn `Tooltip` primitives for pointer + a controlled open state toggled on click for touch (so mobile taps reveal it, tap-outside closes). Locked badges get no tooltip (they're either hidden or a generic placeholder).
- No new icon art yet — `visualDesign` is stored in data for future use but not rendered.

---

## 3. New component — `src/components/AchievementsSection.tsx`

Owns all list logic so `ProfilePanel` stays lean.

Props: `{ unlockedIds: string[] }`.

Behavior:
- Compute `unlockedBadges` = `BADGES.filter(b => unlockedIds.includes(b.id))`, ordered by **most recently earned first**. Since we don't yet track per-badge earn time, order by the position of the id in `unlockedIds` (caller passes newest-first). Add a code comment noting this contract.
- Compute `lockedFillers`: only used when `unlockedBadges.length < 3`. Take the first `3 - unlockedBadges.length` badges from the "Progression & Consistency" track (by `tier` ascending, tier 0 last) that are **not** already unlocked. These render as the existing locked/greyed placeholder circles with the badge's real name label.
- **Displayed set**: `unlockedBadges` first, then `lockedFillers` (only when applicable). Locked badges beyond fillers are **hidden entirely**.
- **Collapsed view**: show up to 3 items. If `unlockedBadges.length > 3`, render a "View more" button below the grid that expands to show all unlocked badges. Button toggles to "Show less". Locked fillers never appear when there are 3+ unlocked.
- Grid: `grid grid-cols-3 gap-3` (unchanged from today).
- Empty section title stays "Achievements & Awards" (already in `ProfilePanel`).

---

## 4. Wiring in `ProfilePanel.tsx`

- Remove the inline `Badge` component and the three hard-coded `<Badge ... />` calls inside the Achievements section.
- Replace with `<AchievementsSection unlockedIds={unlockedIds} />`.
- Build `unlockedIds` in `ProfilePanel`:
  - **Temporary demo state (per user's step 3)**: hard-code `unlockedIds = ["progression-consistency-the-icebreaker", "progression-consistency-decathlon", "progression-consistency-the-regular"]`, newest-first order. Add a `// TODO: wire to real unlock data` comment.
  - Existing `firstUnlocked = gamesCompleted >= 1` logic is retired (the new component handles fillers).

No changes to Score Card, header card, Danger Zone, or delete flow.

---

## 5. Verification

- Open Profile panel → Achievements shows exactly 3 unlocked circles (The Icebreaker, Decathlon, The Regular), gold gradient, correct labels. No locked placeholders visible (since 3 are unlocked, fillers don't apply).
- Hover an unlocked badge on desktop → tooltip with name + requirement. Tap on mobile → tooltip toggles open, tap outside closes.
- Temporarily set `unlockedIds` to `[]` and 1 id to confirm: 0 unlocked → 3 locked Progression fillers; 1 unlocked → 1 unlocked + 2 locked Progression fillers.
- Temporarily set `unlockedIds` to 5 ids → grid shows 3, "View more" appears, expands to all 5, "Show less" collapses back.
- Typecheck passes; no console errors; no other panel sections changed.

---

## Out of scope

- Real unlock detection from gameplay (game counts, difficulty coverage, era coverage, etc.). Wiring to Cloud/profile stats is a follow-up.
- Custom badge artwork rendering from `visualDesign`. Trophy icon is used for all unlocked badges for now.
- Persisting earn timestamps. Order is driven by the caller-supplied `unlockedIds` order until real timestamps exist.
