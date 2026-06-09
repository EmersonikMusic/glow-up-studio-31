/**
 * Lightweight wrapper around the GA4 gtag.js loaded in index.html.
 * Safe to call from any component — no-ops when gtag is unavailable.
 *
 * Only the events listed below are emitted. Everything else has been
 * intentionally stripped so the GA4 property only receives key events:
 *   - ui_click  (powers cta_primary_*, click_pause, click_resume, click_about, …)
 *   - game_start
 *   - game_complete
 */

import type { GameSettings } from "@/data/gameOptions";

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
  trackEvent("ui_click", { control_id: slug(controlId), ...params });
}

// ---------- Funnel events ----------

/** Fires when a game actually starts. */
export function trackGameStart(settings: GameSettings): void {
  trackEvent("game_start", {
    num_questions: settings.numQuestions,
    time_per_question: settings.timePerQuestion,
    time_per_answer: settings.timePerAnswer,
    categories_count: settings.selectedCategories.length,
    difficulties_count: settings.selectedDifficulties.length,
    eras_count: settings.selectedEras.length,
  });
}

/** Fires when a game reaches the finished state. */
export function trackGameComplete(payload: {
  num_questions: number;
  questions_played: number;
  duration_sec: number;
}): void {
  trackEvent("game_complete", payload);
}
