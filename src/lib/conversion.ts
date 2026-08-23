import type { User } from "@supabase/supabase-js";

const FIRED_KEY = "google_ads_signup_conversion_fired_for";

// An account created within this window of the SIGNED_IN event counts as a
// brand-new sign-up (covers OAuth redirect round-trip latency).
const NEW_ACCOUNT_WINDOW_MS = 5 * 60 * 1000; // 5 min

/**
 * Pushes a `sign_up` event to the GTM dataLayer exactly once for a
 * freshly-created account, regardless of how the account was created
 * (email, Google, or Apple).
 *
 * The Google Ads conversion itself is configured in GTM against this event —
 * no conversion label lives in the app code. The dedupe and account-age
 * guards stay here because GTM cannot replicate them:
 *  - Fire-once per user id (sessionStorage) so a returning sign-in or a
 *    duplicate SIGNED_IN event can't double-fire.
 *  - The account must have been created within `NEW_ACCOUNT_WINDOW_MS` of now;
 *    a returning user's `created_at` is days/weeks old and is excluded.
 */
export function fireSignUpConversionForUser(user: User): void {
  if (typeof window === "undefined") return;

  const already = sessionStorage.getItem(FIRED_KEY);
  if (already === user.id) return;

  const created = user.created_at ? Date.parse(user.created_at) : NaN;
  if (!Number.isFinite(created)) return;
  const ageMs = Date.now() - created;
  if (ageMs < 0 || ageMs > NEW_ACCOUNT_WINDOW_MS) return;

  sessionStorage.setItem(FIRED_KEY, user.id);
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "sign_up", user_id: user.id });
  } catch {
    // swallow — analytics must never break the app
  }
}
