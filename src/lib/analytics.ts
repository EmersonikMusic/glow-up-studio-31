/**
 * Lightweight wrapper around the Google Tag Manager dataLayer loaded in
 * index.html. Safe to call from any component — no-ops outside the browser.
 *
 * Engagement clicks (ENGAGEMENT_ACTIONS) are all emitted under a single
 * shared event name, `user_engagement_action`, with the specific control
 * carried in the `action_name` parameter. One GTM trigger + one GA4 tag
 * therefore covers every engagement interaction, and because they share a
 * single GA4 event name they can never be individually flipped into
 * conversions.
 *
 * The funnel events `game_start` and `game_complete` keep their own dedicated
 * event names — the Google Ads conversion tags in GTM trigger on those.
 */


import type { GameSettings } from "@/data/gameOptions";

type GtagParams = Record<string, unknown>;

/** The shared GA4 event name every engagement click is reported under. */
const ENGAGEMENT_EVENT = "user_engagement_action";

/**
 * Interactions reported to GA4 as engagement (never conversions). Anything
 * not listed here is silently dropped so the GA4 property stays focused.
 */
const ENGAGEMENT_ACTIONS = new Set<string>([
  "cta_primary_settings_apply",
  "click_about",
  "click_how_to_play",
  "click_settings",
  "cta_primary_result_play_again",
  "cta_secondary__customize_game",
  "click_skip_question",
  "click_back_question",
  "click_review_game",
  "click_pause",
  "click_resume",
  "cta_primary_landing_play",
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
 * Report an engagement interaction. Emits the shared
 * `user_engagement_action` event with `action_name` set to the control id,
 * e.g. { event: 'user_engagement_action', action_name: 'click_skip_question' }.
 * Names outside ENGAGEMENT_ACTIONS are silently dropped.
 */
export function trackClick(eventName: string, params?: GtagParams): void {
  if (!ENGAGEMENT_ACTIONS.has(eventName)) return;
  trackEvent(ENGAGEMENT_EVENT, { action_name: eventName, ...(params ?? {}) });
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

/**
 * Identifier for the round currently in progress. Set at game start and
 * cleared once its `game_complete` has fired, so a single completed round
 * can only ever emit one conversion-bound event.
 */
let currentRoundId: string | null = null;

const FIRED_ROUNDS_KEY = "game_complete_fired_rounds";

function readFiredRounds(): string[] {
  try {
    const raw = sessionStorage.getItem(FIRED_ROUNDS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function markRoundFired(roundId: string): void {
  try {
    // Keep the tail bounded — a long session should not grow unboundedly.
    const next = [...readFiredRounds(), roundId].slice(-50);
    sessionStorage.setItem(FIRED_ROUNDS_KEY, JSON.stringify(next));
  } catch {
    // swallow — analytics must never break the app
  }
}

/** Begin a new round and return its id. Called once per game start. */
export function beginRound(): string {
  currentRoundId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return currentRoundId;
}

/**
 * Emit `game_complete` at most once per completed round per browser session.
 * Repeat calls (re-renders, double timer fires, back/forward into the result
 * screen) are dropped until a new round begins via `beginRound()`.
 */
export function trackGameComplete(payload: {
  num_questions: number;
  questions_played: number;
  duration_sec: number;
}): void {
  if (typeof window === "undefined") return;

  const roundId = currentRoundId;
  // No active round means this completion was already counted (or the round
  // never legitimately started) — never fire.
  if (!roundId) return;
  if (readFiredRounds().includes(roundId)) {
    currentRoundId = null;
    return;
  }

  markRoundFired(roundId);
  currentRoundId = null;
  trackEvent("game_complete", { ...payload, round_id: roundId });
}
