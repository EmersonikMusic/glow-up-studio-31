import type { User } from "@supabase/supabase-js";

const FIRED_KEY = "google_ads_signup_conversion_fired_for";

// An account created within this window of the SIGNED_IN event counts as a
// brand-new sign-up (covers OAuth redirect round-trip latency).
const NEW_ACCOUNT_WINDOW_MS = 5 * 60 * 1000; // 5 min

/**
 * Fires the Google Ads sign-up conversion exactly once for a freshly-created
 * account, regardless of how the account was created (email, Google, or Apple).
 *
 * Guards:
 *  - `gtag_report_conversion` must exist (gtag.js loaded).
 *  - Fire-once per user id (sessionStorage) so a returning sign-in or a
 *    duplicate SIGNED_IN event can't double-fire.
 *  - The account must have been created within `NEW_ACCOUNT_WINDOW_MS` of now;
 *    a returning user's `created_at` is days/weeks old and is excluded.
 */
export function fireSignUpConversionForUser(user: User): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag_report_conversion !== "function") return;

  const already = sessionStorage.getItem(FIRED_KEY);
  if (already === user.id) return;

  const created = user.created_at ? Date.parse(user.created_at) : NaN;
  if (!Number.isFinite(created)) return;
  const ageMs = Date.now() - created;
  if (ageMs < 0 || ageMs > NEW_ACCOUNT_WINDOW_MS) return;

  sessionStorage.setItem(FIRED_KEY, user.id);
  window.gtag_report_conversion();
}

/**
 * Fires the Google Ads quiz-completion conversion. Called once per fully
 * completed game (the user answered the final question). Unlike sign-up,
 * there is no dedupe — every finished quiz is a distinct conversion.
 *
 * Guards: `gtag` must exist (gtag.js loaded); never throws.
 */
export function fireQuizConversion(): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  try {
    window.gtag("event", "conversion", {
      send_to: "AW-18392006298/Xo0pCKn31-IcEJr9_sFE",
      value: 1.0,
      currency: "CAD",
    });
  } catch {
    // swallow — analytics must never break the app
  }
}

/**
 * Fires the Google Ads "Other" conversion when a game successfully starts.
 * Called once per started game from the shared start chokepoint in
 * TriviaGame's runFetchAndStart, so it covers Quick Play, Custom, and
 * Kids Mode. No dedupe — every started game is a distinct conversion.
 *
 * Guards: `gtag` must exist (gtag.js loaded); never throws.
 */
export function fireGameStartConversion(): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  try {
    window.gtag("event", "conversion", {
      send_to: "AW-18392006298/eqgwCJvR7uIcEJr9_sFE",
    });
  } catch {
    // swallow — analytics must never break the app
  }
}

/**
 * Fires the Google Ads "Search Game Completions" conversion. Called once per
 * fully completed game alongside `fireQuizConversion`. No dedupe — every
 * finished quiz is a distinct conversion.
 *
 * Guards: `gtag` must exist (gtag.js loaded); never throws.
 */
export function fireSearchGameConversion(): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  try {
    window.gtag("event", "conversion", {
      send_to: "AW-18392006298/y8ggCNWF6OIcEJr9_sFE",
      value: 1.0,
      currency: "CAD",
    });
  } catch {
    // swallow — analytics must never break the app
  }
}
