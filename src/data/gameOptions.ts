/**
 * Single source of truth for gameplay option lists, the GameSettings shape,
 * and the default settings. Both TriviaGame (engine) and SettingsPanel (UI)
 * consume these so a new option only needs to be added in one place.
 */

export const ALL_CATEGORIES = [
  "Art",
  "Economy",
  "Food & Drink",
  "Games",
  "Geography",
  "History",
  "Human Body",
  "Language",
  "Law",
  "Literature",
  "Math",
  "Miscellaneous",
  "Movies",
  "Music",
  "Nature",
  "Performing Arts",
  "Philosophy",
  "Politics",
  "Pop Culture",
  "Science",
  "Sports",
  "Technology",
  "Television",
  "Theology",
  "Video Games",
] as const;

export const ALL_DIFFICULTIES = ["Casual", "Easy", "Average", "Hard", "Genius"] as const;

export const ALL_ERAS = [
  "Pre-1500",
  "1500-1800",
  "1800-1900",
  "1900-1950",
  "1950s",
  "1960s",
  "1970s",
  "1980s",
  "1990s",
  "2000s",
  "2010s",
  "2020s",
] as const;

export interface GameSettings {
  numQuestions: number;
  timePerQuestion: number;
  timePerAnswer: number;
  selectedCategories: string[];
  selectedDifficulties: string[];
  selectedEras: string[];
}

export const DEFAULT_SETTINGS: GameSettings = {
  numQuestions: 10,
  timePerQuestion: 5,
  timePerAnswer: 5,
  selectedCategories: [...ALL_CATEGORIES],
  selectedDifficulties: [...ALL_DIFFICULTIES],
  selectedEras: [...ALL_ERAS],
};
