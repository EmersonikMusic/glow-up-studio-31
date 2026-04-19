import type { Question, Category, Difficulty, Era } from "@/data/questions";
import type { GameSettings } from "@/components/SettingsPanel";

// ── ID dictionaries (provided by backend) ───────────────────────────────────
export const CATEGORY_IDS: Record<string, number> = {
  Art: 1, Economy: 2, "Food & Drink": 3, Games: 4, Geography: 5, History: 6,
  "Human Body": 7, Language: 8, Literature: 9, Math: 10, Miscellaneous: 11,
  Movies: 12, Music: 13, Nature: 14, Philosophy: 15, Politics: 16,
  "Pop Culture": 17, Science: 18, Sports: 19, Technology: 20, Television: 21,
  "Performing Arts": 22, Theology: 23, "Video Games": 24, Law: 33,
};

export const DIFFICULTY_IDS: Record<string, number> = {
  Casual: 1, Easy: 2, Average: 3, Hard: 4, Genius: 5,
};

export const ERA_IDS: Record<string, number> = {
  "Pre-1500": 1, "1500-1800": 2, "1800-1900": 3, "1900-1950": 4,
  "1950s": 5, "1960s": 6, "1970s": 7, "1980s": 8, "1990s": 9,
  "2000s": 10, "2010s": 11, "2020s": 12,
};

const ALL_CATEGORY_COUNT = Object.keys(CATEGORY_IDS).length;
const ALL_DIFFICULTY_COUNT = Object.keys(DIFFICULTY_IDS).length;
const ALL_ERA_COUNT = Object.keys(ERA_IDS).length;

const API_BASE = "https://www.triviolivia.com/api/questions";
const FETCH_TIMEOUT_MS = 20_000;

// ── Raw API shape ───────────────────────────────────────────────────────────
interface RawApiQuestion {
  text: string;
  answer: string;
  category_name?: string;
  difficulty_name?: string;
  era_name?: string;
  author?: string;
  id?: number;
}

// ── Adapter: API question → app Question ────────────────────────────────────
let synthId = 1;
function adaptQuestion(raw: RawApiQuestion): Question {
  const category = (raw.category_name ?? "Miscellaneous") as Category;
  const difficulty = (raw.difficulty_name ?? "Average") as Difficulty;
  const era = (raw.era_name ?? "2020s") as Era;

  return {
    id: raw.id ?? synthId++,
    text: raw.text,
    // Say-aloud gameplay: single synthesized answer entry with the correct text.
    answers: [{ id: "A", text: raw.answer }],
    correctId: "A",
    category,
    difficulty,
    era,
    author: raw.author ?? "",
  };
}

// ── Fisher-Yates shuffle ────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// ── Build URL — only append filter params when the user narrowed selection ──
function buildUrl(settings: GameSettings): string {
  const params = new URLSearchParams();
  params.append("questions", String(settings.numQuestions || 10));

  const cats = settings.selectedCategories
    .map((name) => CATEGORY_IDS[name])
    .filter((v): v is number => typeof v === "number");
  if (cats.length > 0 && cats.length < ALL_CATEGORY_COUNT) {
    params.append("category", cats.join(","));
  }

  const diffs = settings.selectedDifficulties
    .map((name) => DIFFICULTY_IDS[name])
    .filter((v): v is number => typeof v === "number");
  if (diffs.length > 0 && diffs.length < ALL_DIFFICULTY_COUNT) {
    params.append("difficulty", diffs.join(","));
  }

  const eras = settings.selectedEras
    .map((name) => ERA_IDS[name])
    .filter((v): v is number => typeof v === "number");
  if (eras.length > 0 && eras.length < ALL_ERA_COUNT) {
    params.append("era", eras.join(","));
  }

  return `${API_BASE}?${params.toString()}`;
}

/**
 * Fetch & prepare a randomized batch of trivia questions from the API.
 * Throws on network error, non-2xx, or 20s timeout.
 */
export async function fetchAndStartGame(settings: GameSettings): Promise<Question[]> {
  const url = buildUrl(settings);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const raw = (await response.json()) as RawApiQuestion[];
    if (!Array.isArray(raw)) throw new Error("Unexpected API response");
    return shuffle(raw).map(adaptQuestion);
  } catch (err) {
    if ((err as Error).name === "AbortError") {
      throw new Error("Request timed out after 20 seconds");
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}
