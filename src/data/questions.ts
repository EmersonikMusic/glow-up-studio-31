// Type definitions only — questions are now fetched from the Triviolivia API.
// See src/lib/triviaApi.ts for the runtime fetcher.

export type Difficulty = "Casual" | "Easy" | "Average" | "Hard" | "Genius";

// Category names match the Triviolivia API exactly.
export type Category =
  | "Art" | "Economy" | "Food & Drink" | "Games" | "Geography" | "History"
  | "Human Body" | "Language" | "Law" | "Literature" | "Math" | "Miscellaneous"
  | "Movies" | "Music" | "Nature" | "Philosophy" | "Politics" | "Pop Culture"
  | "Science" | "Sports" | "Technology" | "Television" | "Performing Arts"
  | "Theology" | "Video Games";

export type Era =
  | "Pre-1500" | "1500-1800" | "1800-1900" | "1900-1950" | "1950s" | "1960s"
  | "1970s" | "1980s" | "1990s" | "2000s" | "2010s" | "2020s";

/**
 * Question shape used throughout the UI.
 *
 * Note: gameplay is "say-aloud" — the API returns a single free-text `answer`
 * (no multiple-choice options). `answers`/`correctId` remain in the type for
 * back-compat with the QuestionCard reveal logic but are synthesized in the
 * adapter (one Answer entry holding the correct text, with id "A").
 */
export interface Answer {
  id: string;
  text: string;
}

export interface Question {
  id: number;
  text: string;
  answers: Answer[];
  correctId: string;
  category: Category;
  difficulty: Difficulty;
  era: Era;
  author: string;
}
