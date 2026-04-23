/**
 * Mobile haptics helper. No-op on devices that don't support `navigator.vibrate`.
 * Off by default; toggle persists in localStorage.
 */

const STORAGE_KEY = "to.haptics.enabled";

let enabled = false;

if (typeof window !== "undefined") {
  enabled = window.localStorage.getItem(STORAGE_KEY) === "1";
}

export function isHapticsSupported(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.vibrate === "function";
}

export function vibrate(pattern: number | number[]) {
  if (!enabled || !isHapticsSupported()) return;
  try {
    navigator.vibrate(pattern);
  } catch {
    // Silently fail — some browsers throw if called too frequently.
  }
}

export function isHapticsEnabled(): boolean {
  return enabled;
}

export function setHapticsEnabled(next: boolean) {
  enabled = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
  }
}

export function toggleHaptics(): boolean {
  setHapticsEnabled(!enabled);
  return enabled;
}
