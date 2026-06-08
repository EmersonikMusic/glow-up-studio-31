/**
 * Lightweight wrapper around the GA4 gtag.js loaded in index.html.
 * Safe to call from any component — no-ops when gtag is unavailable.
 */

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

export function trackToggle(controlId: string, value: boolean, params?: GtagParams): void {
  trackEvent("ui_toggle", { control_id: slug(controlId), value, ...params });
}

export function trackSlider(controlId: string, value: number, params?: GtagParams): void {
  trackEvent("ui_slider_change", { control_id: slug(controlId), value, ...params });
}

export function trackSelect(group: string, option: string, active: boolean, params?: GtagParams): void {
  trackEvent("ui_select", {
    control_id: `${slug(group)}__${slug(option)}`,
    group: slug(group),
    option,
    active,
    ...params,
  });
}
