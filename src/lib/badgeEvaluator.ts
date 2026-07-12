// Pure badge evaluator. No side effects, no DB calls.
// Given the user's aggregated stats + this session's context,
// returns the set of badges that are currently satisfied.

import { BADGES, type Badge } from "@/data/badgeData";
import { ALL_CATEGORIES, ALL_DIFFICULTIES } from "@/data/gameOptions";

export interface BadgeStats {
  total_games_played: number;
  category_counts: Record<string, number>;
  era_counts: Record<string, number>;
  difficulty_counts: Record<string, number>;
  play_history: string[]; // ISO timestamps (already includes current completion)
  min_timer_games: number;
  quickplay_games: number;
  custom_games: number;
}

export interface GameSessionData {
  categories: string[];
  eras: string[];
  difficulties: string[];
  isMinimumTimer: boolean;
  isQuickplay: boolean;
  isCustom: boolean;
  completedAt: Date;
}

/** Badge "Medium" tier uses the engine name "Average". */
function difficultyKey(setting: string): string {
  return setting === "Medium" ? "Average" : setting;
}

/** Map a category-specialist "setting" to the engine categories it covers. */
function categoriesForSpecialist(setting: string): string[] {
  switch (setting) {
    case "STEM":
      return ["Math", "Science", "Technology"];
    case "Culture":
      return ["Art", "Literature", "Performing Arts"];
    case "Globe":
      return ["Geography", "History", "Politics"];
    case "Gourmet":
      return ["Food & Drink"];
    case "Pop Culture":
      return ["Pop Culture", "Movies", "Television", "Music", "Video Games"];
    case "Sports":
      return ["Sports"];
    default:
      return [];
  }
}

/** Map an era-tier "setting" to the engine era keys it covers. */
function erasForSetting(setting: string): string[] {
  switch (setting) {
    case "1960s/1970s":
      return ["1960s", "1970s"];
    case "1990s/2000s":
      return ["1990s", "2000s"];
    default:
      return [setting];
  }
}

const PROGRESSION_TIERS: Record<number, number> = { 1: 1, 2: 10, 3: 25, 4: 50, 5: 100 };
const COUNT_TIERS: Record<number, number> = { 1: 10, 2: 50, 3: 100 };

function sum(counts: Record<string, number>, keys: string[]): number {
  let total = 0;
  for (const k of keys) total += counts[k] ?? 0;
  return total;
}

function hasAllCategories(session: GameSessionData, needed: string[]): boolean {
  const set = new Set(session.categories);
  return needed.every((c) => set.has(c));
}

/** Returns the count of `play_history` entries within 24h ending at `completedAt`. */
function marathoner(history: string[], completedAt: Date): number {
  const cutoff = completedAt.getTime() - 24 * 60 * 60 * 1000;
  let count = 0;
  for (const iso of history) {
    const t = new Date(iso).getTime();
    if (!Number.isNaN(t) && t >= cutoff && t <= completedAt.getTime()) count += 1;
  }
  return count;
}

export function evaluateBadges(stats: BadgeStats, session: GameSessionData): Badge[] {
  const hour = session.completedAt.getHours();
  const dow = session.completedAt.getDay();
  const distinctEras = Object.values(stats.era_counts).filter((n) => n > 0).length;
  const distinctCategories = Object.entries(stats.category_counts).filter(
    ([, n]) => n > 0,
  ).length;
  const allDifficultiesPlayed = (ALL_DIFFICULTIES as readonly string[]).every(
    (d) => (stats.difficulty_counts[d] ?? 0) >= 1,
  );
  const marathonCount = marathoner(stats.play_history, session.completedAt);

  const satisfied: Badge[] = [];

  for (const badge of BADGES) {
    let ok = false;

    switch (badge.badgeType) {
      case "Progression & Consistency": {
        if (badge.tier >= 1 && badge.tier <= 5) {
          ok = stats.total_games_played >= PROGRESSION_TIERS[badge.tier];
        } else {
          // One-off progression badges (tier 0).
          switch (badge.badgeName) {
            case "Spontaneous":
              ok = stats.quickplay_games >= 10;
              break;
            case "The Architect":
              ok = stats.custom_games >= 1;
              break;
            case "The Spectrum":
              ok = allDifficultiesPlayed;
              break;
            case "Century Hopper":
              ok = distinctEras >= 5;
              break;
            case "The Polymath":
              ok = distinctCategories >= ALL_CATEGORIES.length;
              break;
            case "Weekender":
              ok = dow === 0 || dow === 6;
              break;
            case "Night Owl":
              ok = hour >= 0 && hour < 4;
              break;
            case "Early Riser":
              ok = hour >= 4 && hour < 8;
              break;
            case "Speed Demon":
              ok = session.isMinimumTimer;
              break;
            case "Marathoner":
              ok = marathonCount >= 10;
              break;
          }
        }
        break;
      }

      case "Mode & Difficulty Mastery": {
        const key = difficultyKey(badge.setting);
        const need = COUNT_TIERS[badge.tier];
        if (need) ok = (stats.difficulty_counts[key] ?? 0) >= need;
        break;
      }

      case "Time Travelers (Eras)": {
        const eras = erasForSetting(badge.setting);
        const need = COUNT_TIERS[badge.tier];
        if (need) ok = sum(stats.era_counts, eras) >= need;
        break;
      }

      case "Category Specialists": {
        const cats = categoriesForSpecialist(badge.setting);
        const need = COUNT_TIERS[badge.tier];
        if (need && cats.length) ok = sum(stats.category_counts, cats) >= need;
        break;
      }

      case "Custom Combo Games": {
        if (!session.isCustom) break;
        switch (badge.badgeName) {
          case "Couch Potato":
            ok = hasAllCategories(session, ["Movies", "Television", "Video Games"]);
            break;
          case "Renaissance Soul":
            ok = hasAllCategories(session, ["Art", "Science", "History"]);
            break;
          case "The World Stage":
            ok = hasAllCategories(session, ["Sports", "Geography"]);
            break;
          case "Culinary Tour":
            ok = hasAllCategories(session, ["Food & Drink", "Geography"]);
            break;
          case "Existential Crisis":
            ok = hasAllCategories(session, ["Philosophy", "Theology", "Human Body"]);
            break;
          case "The Hustle":
            ok = hasAllCategories(session, ["Economy", "Law", "Politics"]);
            break;
        }
        break;
      }
    }

    if (ok) satisfied.push(badge);
  }

  return satisfied;
}
