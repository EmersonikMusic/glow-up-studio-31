/**
 * Themed ad-landing pages: one slug per category, difficulty and era.
 * Each slug maps to a landing screen (`/play/<slug>`) that starts a game
 * filtered to that single value, leaving every other filter at default.
 *
 * Slugs are unique across all three groups, so one flat route covers them.
 */

import {
  ALL_CATEGORIES,
  ALL_DIFFICULTIES,
  ALL_ERAS,
  DEFAULT_SETTINGS,
  type GameSettings,
} from "@/data/gameOptions";
import type { Category } from "@/data/questions";
import { getMascotForCategory } from "@/data/categoryMascots";
import { categoryColors } from "@/data/categoryColors";

export type PlayKind = "category" | "difficulty" | "era" | "custom";

export interface PlayPreset {
  slug: string;
  kind: PlayKind;
  /** Canonical option value (e.g. "Movies", "Genius", "1980s"). */
  value: string;
  /** Big on-page headline. */
  headline: string;
  /** Supporting line under the headline. */
  subhead: string;
  /** Primary button label. */
  ctaLabel: string;
  /** <title> for the page. */
  metaTitle: string;
  /** Meta description for the page. */
  metaDescription: string;
  /** Category whose mascot + background gradient theme the page. */
  theme: Category;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/\s*&\s*/g, "-and-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const SUBHEAD =
  "Say your answer out loud before the timer runs out, then reveal it. Free, no signup, plays right in your browser.";

// Short marketing noun used in headlines/CTAs, per category.
const CATEGORY_LABEL: Record<string, string> = {
  Art: "Art",
  Economy: "Economics",
  "Food & Drink": "Food & Drink",
  Games: "Board Game",
  Geography: "Geography",
  History: "History",
  "Human Body": "Human Body",
  Language: "Language",
  Law: "Law",
  Literature: "Literature",
  Math: "Math",
  Miscellaneous: "Random",
  Movies: "Movie",
  Music: "Music",
  Nature: "Nature",
  "Performing Arts": "Theatre",
  Philosophy: "Philosophy",
  Politics: "Politics",
  "Pop Culture": "Pop Culture",
  Science: "Science",
  Sports: "Sports",
  Technology: "Technology",
  Television: "TV",
  Theology: "Religion",
  "Video Games": "Video Game",
};

// Difficulty pages, including the Kids-only pool.
const DIFFICULTY_COPY: Record<string, { headline: string; theme: Category }> = {
  Casual: { headline: "Casual Trivia", theme: "Pop Culture" },
  Easy: { headline: "Easy Trivia", theme: "Games" },
  Average: { headline: "Everyday Trivia", theme: "Miscellaneous" },
  Hard: { headline: "Hard Trivia", theme: "Science" },
  Genius: { headline: "Genius Trivia", theme: "Philosophy" },
  Kids: { headline: "Kids Trivia", theme: "Nature" },
};

const ERA_THEMES: Record<string, Category> = {
  "Pre-1500": "History",
  "1500-1800": "History",
  "1800-1900": "Literature",
  "1900-1950": "History",
  "1950s": "Music",
  "1960s": "Music",
  "1970s": "Music",
  "1980s": "Pop Culture",
  "1990s": "Television",
  "2000s": "Technology",
  "2010s": "Video Games",
  "2020s": "Pop Culture",
};

function eraLabel(era: string): string {
  if (era === "Pre-1500") return "Ancient & Medieval";
  if (era === "1500-1800") return "1500–1800";
  if (era === "1800-1900") return "19th Century";
  if (era === "1900-1950") return "Early 1900s";
  return era; // decades read fine as-is
}

const presets: PlayPreset[] = [
  ...ALL_CATEGORIES.map((category): PlayPreset => {
    const label = CATEGORY_LABEL[category] ?? category;
    return {
      slug: slugify(category),
      kind: "category",
      value: category,
      headline: `${label} Trivia`,
      subhead: SUBHEAD,
      ctaLabel: "Start Game",
      metaTitle: `Free ${label} Trivia — Play Online | Triviolivia`,
      metaDescription: `Play free ${label.toLowerCase()} trivia in your browser. Say-aloud questions, no signup, instant start.`,
      theme: category as Category,
    };
  }),
  ...[...ALL_DIFFICULTIES, "Kids"].map((difficulty): PlayPreset => {
    const copy = DIFFICULTY_COPY[difficulty];
    return {
      slug: slugify(difficulty),
      kind: "difficulty",
      value: difficulty,
      headline: `${copy.headline}`,
      subhead: SUBHEAD,
      ctaLabel: "Start Game",
      metaTitle: `Free ${copy.headline} — Play Online | Triviolivia`,
      metaDescription: `Play free ${copy.headline.toLowerCase()} questions in your browser. Say-aloud gameplay, no signup, instant start.`,
      theme: copy.theme,
    };
  }),
  ...ALL_ERAS.map((era): PlayPreset => {
    const label = eraLabel(era);
    return {
      slug: slugify(era),
      kind: "era",
      value: era,
      headline: `${label} Trivia`,
      subhead: SUBHEAD,
      ctaLabel: "Start Game",
      metaTitle: `Free ${label} Trivia Quiz — Play Online | Triviolivia`,
      metaDescription: `Play a free ${label} trivia quiz in your browser. Say-aloud questions from the era, no signup, instant start.`,
      theme: ERA_THEMES[era] ?? "History",
    };
  }),
];

export const PLAY_PRESETS: readonly PlayPreset[] = presets;

const bySlug = new Map(presets.map((p) => [p.slug, p]));

export function getPlayPreset(slug: string | undefined): PlayPreset | undefined {
  if (!slug) return undefined;
  return bySlug.get(slug.toLowerCase());
}

/** Kids Mode is a dedicated question pool, not a normal difficulty filter. */
export function isKidsPreset(preset: PlayPreset | undefined): boolean {
  return preset?.kind === "difficulty" && preset.value === "Kids";
}

/** Narrow exactly one settings axis to the preset value; leave the rest full. */
export function settingsForPreset(preset: PlayPreset | undefined): GameSettings {
  if (!preset) return DEFAULT_SETTINGS;
  if (preset.kind === "category") {
    return { ...DEFAULT_SETTINGS, selectedCategories: [preset.value] };
  }
  if (preset.kind === "era") {
    return { ...DEFAULT_SETTINGS, selectedEras: [preset.value] };
  }
  if (isKidsPreset(preset)) return { ...DEFAULT_SETTINGS };
  return { ...DEFAULT_SETTINGS, selectedDifficulties: [preset.value] };
}

export function presetMascot(preset: PlayPreset): string {
  return getMascotForCategory(preset.theme);
}

export function presetGradient(preset: PlayPreset): string | undefined {
  return categoryColors[preset.theme];
}
