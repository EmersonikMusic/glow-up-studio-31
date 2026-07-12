// Encodes a completed game's settings into a compact fixed-width string:
//   CCCCCCCCCCCCCCCCCCCCCCCCC-DDDDD-EEEEEEEEEEEE-NNN-QQ-AA
// 25 categories (alphabetical), 5 difficulties (ascending),
// 12 eras (chronological), question count (3), question time (2), answer time (2).
// Selected slots are 'o', unselected are 'x'.

import { ALL_CATEGORIES, ALL_DIFFICULTIES, ALL_ERAS } from "@/data/gameOptions";

// ALL_CATEGORIES is already alphabetical in gameOptions.ts, but sort defensively
// so future edits don't silently shift the code layout.
export const CATEGORY_ORDER: readonly string[] = [...ALL_CATEGORIES].sort();
export const DIFFICULTY_ORDER: readonly string[] = [...ALL_DIFFICULTIES]; // Casual→Genius
export const ERA_ORDER: readonly string[] = [...ALL_ERAS]; // Pre-1500→2020s

function mask(order: readonly string[], selected: readonly string[]): string {
  const set = new Set(selected);
  return order.map((k) => (set.has(k) ? "o" : "x")).join("");
}

function pad(n: number, width: number): string {
  const v = Math.max(0, Math.floor(n));
  return String(v).padStart(width, "0").slice(-width);
}

function chunk(s: string, size: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < s.length; i += size) out.push(s.slice(i, i + size));
  return out;
}

export function encodeGameSettings(params: {
  categories: readonly string[];
  difficulties: readonly string[];
  eras: readonly string[];
  numQuestions: number;
  timePerQuestion: number;
  timePerAnswer: number;
}): string {
  const cats = chunk(mask(CATEGORY_ORDER, params.categories), 5).join("-");
  const diffs = mask(DIFFICULTY_ORDER, params.difficulties);
  const eras = chunk(mask(ERA_ORDER, params.eras), 6).join("-");
  return [
    cats,
    diffs,
    eras,
    pad(params.numQuestions, 3),
    pad(params.timePerQuestion, 2),
    pad(params.timePerAnswer, 2),
  ].join("|");
}
