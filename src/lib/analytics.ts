/**
 * Lightweight wrapper around the GA4 gtag.js loaded in index.html.
 * Safe to call from any component — no-ops when gtag is unavailable.
 */

import {
  ALL_CATEGORIES,
  ALL_DIFFICULTIES,
  ALL_ERAS,
  type GameSettings,
} from "@/data/gameOptions";

type GtagParams = Record<string, unknown>;

function getGtag(): ((...args: unknown[]) => void) | null {
  if (typeof window === "undefined") return null;
  const g = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  return typeof g === "function" ? g : null;
}

export function trackEvent(name: string, params?: GtagParams): void {
  const gtag = getGtag();
  if (!gtag) return;
  try {
    gtag("event", name, params ?? {});
  } catch {
    // swallow — analytics must never break the app
  }
}

/** Slugify free-form labels (e.g. aria-labels) into stable GA event ids. */
function slug(s: string | undefined | null): string {
  if (!s) return "unknown";
  return s
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 60) || "unknown";
}

export function trackClick(controlId: string, params?: GtagParams): void {
  console.log(slug(controlId));
  trackEvent("ui_click", { control_id: slug(controlId), ...params });
}

export function trackToggle(controlId: string, value: boolean, params?: GtagParams): void {
  console.log(slug(controlId));
  trackEvent("ui_toggle", { control_id: slug(controlId), value, ...params });
}

export function trackSelect(group: string, option: string, active: boolean, params?: GtagParams): void {
  console.log(`${slug(group)}__${slug(option)}`);
  trackEvent("ui_select", {
    control_id: `${slug(group)}__${slug(option)}`,
    group: slug(group),
    option,
    active,
    ...params,
  });
}

// ---------- Funnel events ----------

/** Build `{ <slug>_on: true|false }` map for a fixed option list. */
function toBoolMap(
  all: readonly string[],
  selected: readonly string[],
  prefix = "",
): Record<string, boolean> {
  const set = new Set(selected);
  const out: Record<string, boolean> = {};
  for (const opt of all) {
    out[`${prefix}${slug(opt)}_on`] = set.has(opt);
  }
  return out;
}

function buildSettingsCore(s: GameSettings): GtagParams {
  return {
    num_questions: s.numQuestions,
    time_per_question: s.timePerQuestion,
    time_per_answer: s.timePerAnswer,
    categories_count: s.selectedCategories.length,
    categories_all: s.selectedCategories.length === ALL_CATEGORIES.length,
    difficulties_count: s.selectedDifficulties.length,
    difficulties_all: s.selectedDifficulties.length === ALL_DIFFICULTIES.length,
    eras_count: s.selectedEras.length,
    eras_all: s.selectedEras.length === ALL_ERAS.length,
    // Difficulty + era booleans fit alongside the core params (~23 total, under GA4's 25-param cap).
    ...toBoolMap(ALL_DIFFICULTIES, s.selectedDifficulties),
    ...toBoolMap(ALL_ERAS, s.selectedEras, "era_"),
  };
}

function buildCategoriesPayload(s: GameSettings): GtagParams {
  return {
    categories_count: s.selectedCategories.length,
    ...toBoolMap(ALL_CATEGORIES, s.selectedCategories),
  };
}

/** Fires when a game actually starts. Split into two events to stay under GA4's 25-param cap. */
export function trackGameStart(settings: GameSettings): void {
  trackEvent("game_start", buildSettingsCore(settings));
  trackEvent("game_start_categories", buildCategoriesPayload(settings));
}

/** Fires when the user applies new settings (configuration intent, may or may not start a game). */
export function trackSettingsApplied(settings: GameSettings): void {
  trackEvent("settings_applied", buildSettingsCore(settings));
  trackEvent("settings_applied_categories", buildCategoriesPayload(settings));
}

/** Fires each time a question transitions to its reveal state — engagement volume metric. */
export function trackQuestionRevealed(): void {
  trackEvent("question_revealed");
}

/** Fires when a game reaches the finished state. */
export function trackGameComplete(payload: {
  num_questions: number;
  questions_played: number;
  duration_sec: number;
}): void {
  trackEvent("game_complete", payload);
}
