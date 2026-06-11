/**
 * Lightweight wrapper around the GA4 gtag.js loaded in index.html.
 * Safe to call from any component — no-ops when gtag is unavailable.
 *
 * Only events in ALLOWED_CLICK_EVENTS (plus the funnel events `game_start`
 * and `game_complete`) are forwarded to GA4. Each fires as its own named
 * event so they appear directly in GA4's Events list and can be marked
 * as Key Events without custom dimensions.
 */

import type { GameSettings } from "@/data/gameOptions";

type GtagParams = Record<string, unknown>;

const ALLOWED_CLICK_EVENTS = new Set<string>([
  "cta_primary_start_game",
  "cta_primary_settings_apply",
  "click_pause",
  "click_resume",
  "click_about",
  "about_close",
  "click_how_to_play",
  "how_to_play_close",
  "click_settings",
  "settings_close",
  "result_play_again",
]);

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

/**
 * Emit a click as its own named GA4 event. Names not in the allowlist
 * are silently dropped so the GA4 property stays limited to key events.
 */
export function trackClick(eventName: string, params?: GtagParams): void {
  if (!ALLOWED_CLICK_EVENTS.has(eventName)) return;
  trackEvent(eventName, params);
}

// ---------- Funnel events ----------

export function trackGameStart(settings: GameSettings): void {
  trackEvent("game_start", {
    num_questions: settings.numQuestions,
    time_per_question: settings.timePerQuestion,
    time_per_answer: settings.timePerAnswer,
    categories_count: settings.selectedCategories.length,
    difficulties_count: settings.selectedDifficulties.length,
    eras_count: settings.selectedEras.length,
    game_mode: settings.gameMode,
  });
}

export function trackGameComplete(payload: {
  num_questions: number;
  questions_played: number;
  duration_sec: number;
}): void {
  trackEvent("game_complete", payload);
}
