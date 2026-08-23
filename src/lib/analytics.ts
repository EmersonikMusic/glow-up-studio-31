/**
 * Lightweight wrapper around the Google Tag Manager dataLayer loaded in
 * index.html. Safe to call from any component — no-ops outside the browser.
 *
 * Only events in ALLOWED_CLICK_EVENTS (plus the funnel events `game_start`
 * and `game_complete`) are pushed. Each fires as its own named dataLayer
 * event, so GTM can trigger GA4 tags (and any Ads conversion tags) on them
 * without any conversion labels living in the app code.
 */


import type { GameSettings } from "@/data/gameOptions";

type GtagParams = Record<string, unknown>;

const ALLOWED_CLICK_EVENTS = new Set<string>([
  "cta_primary_settings_apply",
  "click_about",
  "click_how_to_play",
  "click_settings",
  "cta_primary_result_play_again",
  "cta_secondary__customize_game",
  "click_skip_question",
  "click_back_question",
  "click_review_game",
  "click_forgot_password",
  "click_send_reset_link",
  "click_resend_reset_link",
  "password_reset_success",
  "click_continue_after_reset",
]);

export function trackEvent(name: string, params?: GtagParams): void {
  // Mirror every GA4-bound event to the browser console for debugging.
  // Filter DevTools by "[GA4]" to see only analytics traffic.
  if (typeof window === "undefined") return;
  // eslint-disable-next-line no-console
  console.log(`[GA4] ${name}`, params ?? {});
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: name, ...(params ?? {}) });
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
  });
}

export function trackGameComplete(payload: {
  num_questions: number;
  questions_played: number;
  duration_sec: number;
}): void {
  trackEvent("game_complete", payload);
}
